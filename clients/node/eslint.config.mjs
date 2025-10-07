import path from "node:path";
import { fileURLToPath } from "node:url";

import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import _import from "eslint-plugin-import";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default [
	{
		ignores: [
			"node_modules/*",
			"**/node_modules",
			"packages/**/dist/*",
			"packages/**/src/prisma/*",
			"**/*.md",
		],
	},
	...fixupConfigRules(
		compat.extends(
			"plugin:import/errors",
			"plugin:import/warnings",
			"plugin:import/typescript",
			"plugin:@typescript-eslint/recommended",
			"plugin:prettier/recommended",
		),
	),
	{
		plugins: {
			import: fixupPluginRules(_import),
		},

		languageOptions: {
			parser: tsParser,
			ecmaVersion: 2020,
			sourceType: "module",
		},

		settings: {
			"import/parsers": {
				"@typescript-eslint/parser": [".ts", ".tsx"],
			},

			"import/resolver": {
				typescript: {
					alwaysTryTypes: true,
					project: ["tsconfig.json", "packages/*/tsconfig.json"],
				},
			},

			"import/extensions": [".ts", ".tsx"],
		},

		rules: {
			"@typescript-eslint/no-unused-vars": [
				"off",
				{
					argsIgnorePattern: "^_",
				},
			],

			"@typescript-eslint/no-empty-interface": "off",
			"@typescript-eslint/no-empty-function": "off",
			"import/no-named-as-default": "off",
			"import/default": "off",
			"import/no-named-as-default-member": "off",
			"no-duplicate-imports": "error",

			"import/order": [
				"error",
				{
					groups: [
						"builtin",
						"external",
						"parent",
						"sibling",
						"index",
					],
					"newlines-between": "always",

					alphabetize: {
						order: "asc",
						caseInsensitive: true,
					},
				},
			],

			"import/no-unresolved": "error",

			"@typescript-eslint/no-explicit-any": "warn",
		},
	},
];
