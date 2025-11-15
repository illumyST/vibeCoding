// 使用 Tailwind v4 需改成獨立的 PostCSS 插件包 @tailwindcss/postcss
module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer')
  ]
};