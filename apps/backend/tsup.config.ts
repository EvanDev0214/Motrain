import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['esm'],
  target: 'node22',
  splitting: false,
  sourcemap: false,
  clean: true,
  minify: true
});
