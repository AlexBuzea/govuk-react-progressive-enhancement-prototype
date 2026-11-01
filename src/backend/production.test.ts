import assert from "node:assert/strict";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { after, before, describe, it } from "node:test";

/**
 * Production mode is decided when the app's files are first loaded, so this runs in
 * its own file with the environment set before the app is imported.
 *
 * Hosts like Render handle HTTPS in a proxy and pass plain HTTP on to the app. The
 * proxy marks such requests with the X-Forwarded-Proto header.
 */
process.env.NODE_ENV = "production";
process.env.SESSION_SECRET = "test-secret";

let server: Server;
let baseUrl: string;

before(async () => {
  const { createApp } = await import("./app");
  await new Promise<void>((resolve, reject) => {
    server = createApp().listen(0, (error) => (error ? reject(error) : resolve()));
  });
  baseUrl = `http://localhost:${(server.address() as AddressInfo).port}`;
});

after(() => {
  server.close();
});

describe("behind a hosting proxy (production)", () => {
  it("sets a Secure session cookie when the proxy says the request was HTTPS", async () => {
    const response = await fetch(`${baseUrl}/apply`, { headers: { "X-Forwarded-Proto": "https" } });
    const cookie = response.headers.getSetCookie()[0] ?? "";
    assert.match(cookie, /Secure/i);
    assert.match(cookie, /HttpOnly/i);
  });

  it("lets a form be posted through the proxy (the session and CSRF token survive)", async () => {
    const proxied = { "X-Forwarded-Proto": "https" };
    const page = await fetch(`${baseUrl}/apply`, { headers: proxied });
    const cookie = page.headers.getSetCookie()[0].split(";")[0];
    const token = /name="_csrf" value="([^"]+)"/.exec(await page.text())![1];

    const response = await fetch(`${baseUrl}/apply`, {
      method: "POST",
      redirect: "manual",
      headers: { ...proxied, cookie },
      body: new URLSearchParams({ vehicleReg: "AB12CDE", permitType: "resident", _csrf: token }),
    });
    assert.equal(response.status, 303);
    assert.equal(response.headers.get("location"), "/details");
  });
});
