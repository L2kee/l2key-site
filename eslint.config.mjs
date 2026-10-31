import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Next.js's standard lint setup (the file create-next-app ships), plus
// private/ (local screenshots and previews) and public/ (static files,
// including the Flutter compiled ElectricalAI Pro app), never hand written code.
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // social/ holds the social bot's Node scripts, which use require() on purpose.
  {
    files: ["social/**/*.js"],
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "private/**", "public/**"]),
]);

export default eslintConfig;
