module.exports = {
    "env": {
        // "browser": true,
        "node": true,
        // "commonjs": true,
        "es6": true,
        "mocha": true
    },
    "extends": ["eslint:recommended"],
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "script"
    },
    "parser": "babel-eslint",
    "globals": {},
    "rules": {
        "no-console": ["error", {
            "allow": ["warn", "error", "info"]
        }]
        // "indent": [
        //     "error",
        //     4
        // ],
        // "linebreak-style": [
        //     "error",
        //     "unix"
        // ],
        // "quotes": [
        //     "error",
        //     "single"
        // ],
        // "semi": [
        //     "error",
        //     "always"
        // ]
    }
};