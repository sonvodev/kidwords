import path from "path";
import { type RsbuildConfig, defineConfig, loadEnv } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { TanStackRouterRspack } from "@tanstack/router-plugin/rspack";

const { publicVars } = loadEnv({
	prefixes: ["REACT_APP"],
	cwd: path.resolve(__dirname),
});

// GitHub Pages serves a project site under "/<repo>/". The CI build sets
// REACT_APP_BASE_PATH so assets and the router resolve against that subpath.
// Locally it stays "/".
const basePath = process.env.REACT_APP_BASE_PATH || "/";

const htmlTitle =
	"KidWords" +
	(process.env.REACT_APP_ENVIRONMENT
		? ` (${(process.env.REACT_APP_ENVIRONMENT || "").toUpperCase()})`
		: "");

const config: RsbuildConfig = {
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
			components: path.resolve(__dirname, "./src/components"),
			routes: path.resolve(__dirname, "./src/routes"),
			assets: path.resolve(__dirname, "./src/assets"),
			styles: path.resolve(__dirname, "./src/styles"),
			contexts: path.resolve(__dirname, "./src/contexts"),
			common: path.resolve(__dirname, "./src/common"),
			models: path.resolve(__dirname, "./src/models"),
			pages: path.resolve(__dirname, "./src/pages"),
			services: path.resolve(__dirname, "./src/services"),
			utils: path.resolve(__dirname, "./src/utils"),
			hooks: path.resolve(__dirname, "./src/hooks"),
		},
	},
	tools: {
		rspack: {
			plugins: [TanStackRouterRspack()],
		},
	},
	html: {
		title: htmlTitle,
	},
	server: {
		port: +process.env.REACT_APP_PORT! || 5000,
		base: "/",
	},
	source: {
		define: {
			"process.env": {},
			...publicVars,
			"process.env.REACT_APP_BASE_PATH": JSON.stringify(basePath),
		},
	},
	output: {
		assetPrefix: basePath,
	},
	plugins: [pluginReact()],
};

export default defineConfig(config);
