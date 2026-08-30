import type { StarlightPlugin } from "@astrojs/starlight/types";

export default function createPlugin(): StarlightPlugin {
	return {
		name: "@linwooddev/starlight-style",
		hooks: {
			"config:setup": ({ config, updateConfig }) => {
				updateConfig({
					customCss: [
						"@fontsource-variable/inter",
						"@linwooddev/starlight-style/styles/linwood-style.scss",
						...(config.customCss ?? []),
					],
					components: {
						...config.components,
						Search: "@linwooddev/starlight-style/components/Search.astro",
						ContentPanel:
							"@linwooddev/starlight-style/components/ContentPanel.astro",
					},
				});
			},
		},
	};
}
