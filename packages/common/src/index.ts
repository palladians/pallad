export const baseTsupConfig = {
  entry: ['./src/index.ts'],
  outDir: './dist',
  format: 'esm',
  sourcemap: true,
  clean: true,
  bundle: true,
  dts: true
}

export const baseVitestConfig = {
  test: {
    environment: 'happy-dom',
    globals: true
  }
}
