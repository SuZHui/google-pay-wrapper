/** @type {import('vite').UserConfig} */
export default {
  build: {
    target: 'esnext',
    outDir: './example/lib',
    lib: {
      entry: './lib/main.ts',
      name: 'GooglePay',
      formats: ['es'],
      fileName: 'GooglePayWrapper',
    },
  },
};
