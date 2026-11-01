// Runs at the top of <body>. The GOV.UK CSS uses these classes to style
// components that need JavaScript (see "Add the JavaScript" in the Design System docs).
document.body.className +=
  " js-enabled" + ("noModule" in HTMLScriptElement.prototype ? " govuk-frontend-supported" : "");
