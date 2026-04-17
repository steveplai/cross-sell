/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
export default {
  plugins: ['prettier-plugin-tailwindcss'],
  semi: false,
  singleQuote: true,
  tailwindStylesheet: './src/styles/widget.css',
  tailwindFunctions: ['cn', 'clsx', 'cva'],
}
