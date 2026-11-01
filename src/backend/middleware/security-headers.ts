import helmet from "helmet";

/**
 * Security headers (helmet's defaults).
 *
 * The Content-Security-Policy only allows scripts, styles, images and fonts
 * from this site. Our pages have no inline scripts, so nothing is lost.
 */
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      // Would break http://localhost in some browsers. Remove this line behind HTTPS.
      "upgrade-insecure-requests": null,
    },
  },
});
