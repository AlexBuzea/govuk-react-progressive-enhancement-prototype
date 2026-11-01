import session from "express-session";

const isProduction = process.env.NODE_ENV === "production";

/**
 * One session per visitor: the answers they have entered are kept here
 * (see store.ts for what is stored).
 *
 * Sessions live in memory (fine for a prototype, lost on restart). In production
 * pass a Redis or database store. (app.ts sets trust proxy in production so the secure
 * cookie works behind a host's HTTPS proxy.)
 */
export function sessionMiddleware() {
  if (isProduction && !process.env.SESSION_SECRET) {
    throw new Error("Set the SESSION_SECRET environment variable in production");
  }

  return session({
    secret: process.env.SESSION_SECRET ?? "dev-only-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // not readable by scripts on the page
      sameSite: "lax", // not sent on cross-site form posts
      secure: isProduction, // HTTPS only in production
    },
  });
}
