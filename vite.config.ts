import { defineConfig } from 'vitest/config'
import tscongifPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tscongifPaths()],
  test: {
    environmentMatchGlobs: [['src/http/controllers/**', 'prisma']],
  },
})
