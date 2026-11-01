import assert from "node:assert/strict";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { after, before, describe, it } from "node:test";
import { createApp } from "./app";

/**
 * Starts the real app on a random port and talks to it over HTTP, the way a
 * browser would. Each Visitor keeps its own session cookie.
 */
let server: Server;
let baseUrl: string;

before(async () => {
  await new Promise<void>((resolve, reject) => {
    server = createApp().listen(0, (error) => (error ? reject(error) : resolve()));
  });
  baseUrl = `http://localhost:${(server.address() as AddressInfo).port}`;
});

after(() => {
  server.close();
});

class Visitor {
  private cookie = "";

  async get(path: string, headers: Record<string, string> = {}) {
    return this.send(path, { headers });
  }

  /** POST a form. Adds the CSRF token a real form would carry, unless told not to. */
  async post(path: string, fields: Record<string, string>, options: { csrf?: boolean; json?: boolean } = {}) {
    const body = new URLSearchParams(fields);
    if (options.csrf !== false) body.set("_csrf", await this.csrfToken());
    return this.send(path, {
      method: "POST",
      body,
      headers: options.json ? { Accept: "application/json" } : {},
    });
  }

  private async csrfToken() {
    const html = await (await this.get("/apply")).text();
    return /name="_csrf" value="([^"]+)"/.exec(html)![1];
  }

  private async send(path: string, init: RequestInit) {
    const response = await fetch(baseUrl + path, {
      ...init,
      redirect: "manual", // we want to see the redirect, not follow it
      headers: { ...init.headers, cookie: this.cookie },
    });
    const setCookie = response.headers.getSetCookie()[0];
    if (setCookie) this.cookie = setCookie.split(";")[0];
    return response;
  }
}

describe("pages", () => {
  it("shows the start page", async () => {
    const response = await new Visitor().get("/");
    assert.equal(response.status, 200);
    assert.match(await response.text(), /Apply for a parking permit/);
  });

  it("returns 404 for an unknown URL", async () => {
    const response = await new Visitor().get("/nope");
    assert.equal(response.status, 404);
    assert.match(await response.text(), /Page not found/);
  });

  it("sends no inline scripts, so the Content-Security-Policy can block them", async () => {
    for (const path of ["/", "/apply", "/details", "/customise"]) {
      const html = await (await new Visitor().get(path)).text();
      const inlineScripts = html.match(/<script(?![^>]*\ssrc=)[^>]*>/g);
      assert.equal(inlineScripts, null, `${path} has an inline script`);
    }
  });

  it("sends no React to pages without an island", async () => {
    const details = await (await new Visitor().get("/details")).text();
    assert.doesNotMatch(details, /\/islands\//);
    const customise = await (await new Visitor().get("/customise")).text();
    assert.match(customise, /\/islands\/customise\.js/);
  });
});

describe("security", () => {
  it("sets security headers and hides the framework name", async () => {
    const response = await new Visitor().get("/");
    assert.match(response.headers.get("content-security-policy") ?? "", /script-src 'self'/);
    assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    assert.equal(response.headers.get("x-powered-by"), null);
  });

  it("tells the browser not to keep pages that hold personal answers", async () => {
    const response = await new Visitor().get("/check");
    assert.equal(response.headers.get("cache-control"), "no-store");
  });

  it("refuses a form post without a CSRF token", async () => {
    const response = await new Visitor().post("/apply", { vehicleReg: "AB12CDE", permitType: "resident" }, { csrf: false });
    assert.equal(response.status, 403);
    assert.match(await response.text(), /Your session has ended/);
  });

  it("refuses a form post with the wrong CSRF token", async () => {
    const visitor = new Visitor();
    await visitor.get("/apply"); // starts the session
    const response = await visitor.post("/apply", { vehicleReg: "AB12CDE", _csrf: "forged" }, { csrf: false });
    assert.equal(response.status, 403);
  });

  it("keeps the session cookie away from page scripts", async () => {
    const response = await new Visitor().get("/apply");
    assert.match(response.headers.getSetCookie()[0], /HttpOnly/i);
    assert.match(response.headers.getSetCookie()[0], /SameSite=Lax/i);
  });
});

describe("sessions", () => {
  it("keeps each visitor's answers separate", async () => {
    const alice = new Visitor();
    const bob = new Visitor();
    await alice.post("/apply", { vehicleReg: "AB12CDE", permitType: "resident" });

    assert.match(await (await alice.get("/apply")).text(), /value="AB12CDE"/);
    assert.doesNotMatch(await (await bob.get("/apply")).text(), /AB12CDE/);
  });

  it("saves the counter per visitor, for both a form post and a fetch", async () => {
    const visitor = new Visitor();
    const formPost = await visitor.post("/apply/increment", {});
    assert.equal(formPost.status, 303); // no JS: redirect back to the page

    const fetchPost = await visitor.post("/apply/increment", {}, { json: true });
    assert.deepEqual(await fetchPost.json(), { count: 2 }); // JS: JSON, no reload

    assert.deepEqual(await (await new Visitor().post("/apply/increment", {}, { json: true })).json(), { count: 1 });
  });
});

describe("which details page comes next", () => {
  it("sends residents to name and address", async () => {
    const visitor = new Visitor();
    const response = await visitor.post("/apply", { vehicleReg: "AB12CDE", permitType: "resident" });
    assert.equal(response.status, 303);
    assert.equal(response.headers.get("location"), "/details");
  });

  it("sends commercial applicants to organisation details", async () => {
    const visitor = new Visitor();
    const response = await visitor.post("/apply", { vehicleReg: "AB12CDE", permitType: "commercial" });
    assert.equal(response.headers.get("location"), "/organisation-details");
  });

  it("redirects people who type the other details URL", async () => {
    const commercial = new Visitor();
    await commercial.post("/apply", { vehicleReg: "AB12CDE", permitType: "commercial" });
    assert.equal((await commercial.get("/details")).headers.get("location"), "/organisation-details");

    const resident = new Visitor();
    await resident.post("/apply", { vehicleReg: "AB12CDE", permitType: "resident" });
    assert.equal((await resident.get("/organisation-details")).headers.get("location"), "/details");
  });
});

describe("server-side validation", () => {
  it("shows the form again with linked error messages", async () => {
    const response = await new Visitor().post("/details", { fullName: "", addressLine1: "", town: "", postcode: "" });
    assert.equal(response.status, 200);

    const html = await response.text();
    assert.match(html, /<title>Error: Your name and address/);
    assert.match(html, /<a href="#fullName">Enter your full name<\/a>/);
    assert.match(html, /aria-describedby="fullName-error"/);
    assert.match(html, /id="fullName-error"/);
  });

  it("keeps what the user typed when there are errors", async () => {
    const response = await new Visitor().post("/details", {
      fullName: "Sam Smith",
      addressLine1: "1 High Street",
      town: "Rivermead",
      postcode: "12345",
    });
    const html = await response.text();
    assert.match(html, /Enter a real postcode/);
    assert.match(html, /value="Sam Smith"/);
  });

  it("moves on when the answers are valid", async () => {
    const response = await new Visitor().post("/details", {
      fullName: "Sam Smith",
      addressLine1: "1 High Street",
      town: "Rivermead",
      postcode: "sw1a1aa",
    });
    assert.equal(response.status, 303);
    assert.equal(response.headers.get("location"), "/customise");
  });
});

describe("check your answers", () => {
  it("posts the form back to /check, the same URL as the page", async () => {
    const visitor = new Visitor();
    await visitor.post("/apply", { vehicleReg: "AB12CDE", permitType: "resident" }); // the form only shows once there are answers
    const html = await (await visitor.get("/check")).text();
    assert.match(html, /<form action="\/check" method="post">/);
  });

  it("sends the user to the confirmation page after they accept", async () => {
    const response = await new Visitor().post("/check", {});
    assert.equal(response.status, 303);
    assert.equal(response.headers.get("location"), "/confirmation");
  });

  it("shows the confirmation page", async () => {
    const response = await new Visitor().get("/confirmation");
    assert.equal(response.status, 200);
    assert.match(await response.text(), /Application complete/);
  });
});
