/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 指定正確的專案根目錄，避免 Turbopack 誤判外層 lockfile 導致模組解析錯誤
  turbopack: {
    root: __dirname
  }
};

module.exports = nextConfig;
