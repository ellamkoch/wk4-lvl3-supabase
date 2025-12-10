/**
 * Stylelint configuration for basic CSS linting.
 * We extend the "standard" config which enforces:
 * - Valid CSS syntax
 * - Consistent formatting and conventions
 */

/** @type {import("stylelint").Config} */
module.exports = {
  extends: ["stylelint-config-standard"],

  rules: {
    // Disallow invalid hex colors
    "color-no-invalid-hex": true,

    // Avoid empty rule blocks
    "block-no-empty": true,

    // Allow camelCase class
    "selector-class-pattern": null
  }
};
