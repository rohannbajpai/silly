/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  },
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        async_hooks: false,
        util: false,
        url: false,
        http: false,
        https: false,
        zlib: false,
        stream: false,
        path: false,
      };
    }

    // Handle Undici module
    config.module.rules.push({
      test: /node_modules\/undici/,
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
        plugins: [
          '@babel/plugin-proposal-class-properties',
          '@babel/plugin-transform-private-methods',
          '@babel/plugin-transform-class-properties'
        ]
      }
    });

    return config;
  }
};

module.exports = nextConfig; 