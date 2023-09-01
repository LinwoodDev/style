import { defineConfig } from 'astro/config';
import LinwoodStyleIntegration from 'linwood-style-astro';

// https://astro.build/config
export default defineConfig({
    integrations: [
        LinwoodStyleIntegration(),
    ]
});
