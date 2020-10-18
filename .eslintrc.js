/* eslint-disable quotes */
/* eslint-disable quote-props */

module.exports = {
  "env": {
    "browser": false,
    "node": true,
    "es6": true,
  },
  "extends": "airbnb-base",
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module",
  },
  "rules": {
    "no-underscore-dangle": ["error", { "allow": ["_id"] }],
  },
};
