import { defineConfig } from 'vite'
import { featureDetails } from './src/data/featureDetails.js'

// Emit entry documents so direct links also work on static hosting.
export default defineConfig({
  plugins: [{
    name: 'destination-entry-pages',
    enforce: 'post',
    generateBundle(_, bundle) {
      const entry = bundle['index.html']
      if (!entry) return
      const routes = ['parcours', 'solutions', 'fonctionnalites', 'comment-ca-marche', 'contact',
        ...featureDetails.map(feature => `fonctionnalites/${feature.slug}`)]
      for (const route of routes) {
        this.emitFile({ type: 'asset', fileName: `${route}/index.html`, source: entry.source })
      }
    },
  }],
})
