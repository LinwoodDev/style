import type { StarlightPlugin } from "@astrojs/starlight/types";


interface Config {
}

export default function createPlugin(config?: Config): StarlightPlugin {
	return {
		name: "@linwooddev/starlight-style",
		hooks: {
			"config:setup": ({ config, updateConfig }) => {
				updateConfig({
					customCss: [
						...(config.customCss ?? []),
						"@linwooddev/starlight-style/styles/shared.css",
					],
				});
			},
		},
	};
}