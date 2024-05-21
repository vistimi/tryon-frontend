/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    "output": "standalone", // build-serverless-next
}

module.exports = nextConfig
