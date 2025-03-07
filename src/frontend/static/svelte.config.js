// src/frontend/svelte.config.js
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  
  kit: {
    adapter: adapter({
      fallback: 'index.html'
    }),
    
    // Used for Internet Computer CSRF protection
    csrf: {
      checkOrigin: false,
    }
  }
};

export default config;