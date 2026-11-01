import crypto from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { SessionExpiredPage } from "../../frontend/pages/session-expired/SessionExpiredPage";
import { render } from "../utils/render";

/**
 * CSRF protection: stops other websites from submitting our forms on a user's behalf.
 *
 * 1. Every visitor gets a random secret token, stored in their session.
 * 2. Every form carries it in a hidden field (components/CsrfField.tsx).
 * 3. A POST without the matching token is refused. Another website cannot read
 *    the token, so it cannot build a valid form.
 */

/** The token to put in this visitor's forms. */
export function csrfTokenFor(req: Request): string {
  req.session.csrfToken ??= crypto.randomBytes(32).toString("hex");
  return req.session.csrfToken;
}

export function csrfProtection(req: Request, res: Response, next: NextFunction): void {
  const expected = Buffer.from(csrfTokenFor(req));

  if (req.method === "POST") {
    const sent = Buffer.from(String(req.body?._csrf ?? ""));
    // timingSafeEqual needs equal lengths, and avoids leaking how much matched
    const valid = sent.length === expected.length && crypto.timingSafeEqual(sent, expected);

    if (!valid) {
      // Usually the session ended (or the server restarted), not an attack
      render(res, <SessionExpiredPage />, 403);
      return;
    }
  }
  next();
}
