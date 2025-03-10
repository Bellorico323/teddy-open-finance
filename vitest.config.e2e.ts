import swc from "unplugin-swc"
import { defineConfig } from "vitest/config"

export default defineConfig(async () => {
	const tsconfigPaths = (await import("vite-tsconfig-paths")).default

	return {
		test: {
			include: ["**/*.e2e-spec.ts"],
			globals: true,
			root: "./",
			setupFiles: ["./test/setup-e2e.ts"],
		},
		plugins: [
			tsconfigPaths(),
			swc.vite({
				module: { type: "es6" },
			}),
		],
	}
})
