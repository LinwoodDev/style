import type { AstroIntegration } from 'astro';

export default function LinwoodStyleIntegration() : AstroIntegration {
  return {
    name: 'linwood-style-astro',
    hooks: {
      'astro:config:setup': async ({ config, updateConfig, injectScript }) => {
        injectScript('page-ssr', `import "linwood-style-web/css/linwood-style.css";`);
      },
    },
  };
}