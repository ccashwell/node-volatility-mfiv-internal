module.exports = {
  root: true,
  env: {
    browser: true,
    amd: true,
    node: true,
    commonjs: true,
    es6: true,
    jquery: false,
    mocha: true
  },
  extends: [
    "eslint:recommended",
    "eslint-config-prettier",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "plugin:promise/recommended",
    "prettier"
  ],
  globals: {
    __filename: true,
    __dirname: true
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 6,
    tsconfigRootDir: __dirname,
    project: "tsconfig.json",
    createDefaultProgram: true,
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    }
  },
  plugins: ["import", "prettier", "@typescript-eslint", "promise"],
  ignorePatterns: ["src/volatilityIndex.js"],
  rules: {
    // indent: ["error", 2, { SwitchCase: 1 }],
    // quotes: ["warn", "double"],
    // semi: ["error", "never"],
    "no-var": ["error"],
    "no-console": ["off"],
    "no-unused-vars": ["off"],
    // "no-mixed-spaces-and-tabs": ["warn"],
    "@typescript-eslint/await-thenable": ["error"],
    "@typescript-eslint/no-floating-promises": ["error"],
    "@typescript-eslint/no-unused-vars": ["warn"],
    "import/no-unresolved": ["error"],
    "import/extensions": "off",
    "import/order": [
      "error",
      {
        "newlines-between": "never",
        "alphabetize": {
          "order": "asc",
          "caseInsensitive": false
        }
      }
    ],
  },
  settings: {
    "import/resolver": {
      node: {
        paths: ["node_modules/", "node_modules/@types"],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        moduleDirectory: ["node_modules", "src/", "test/"],
        resolvePaths: ["node_modules/@types"],
        tryExtensions: [".js", ".json", ".node", ".ts", ".d.ts"]
      },
      typescript: {
        alwaysTryTypes: true // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
      }
    },
    "import/parsers": { "@typescript-eslint/parser": [".ts", ".tsx"] }
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"], // Your TypeScript files extension
      parserOptions: {
        project: ["./tsconfig.json"] // Specify it only for TypeScript files
      }
    }
  ]
}
