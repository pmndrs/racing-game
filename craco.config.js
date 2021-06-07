const { join, resolve } = require('path')
const CracoEsbuildPlugin = require('craco-esbuild')
const { ProvidePlugin } = require('webpack')

module.exports = {
  webpack: {
    plugins: [
      new ProvidePlugin({
        React: 'react',
      }),
    ],
  },
  plugins: [
    {
      options: {
        includePaths: [resolve(join('.', 'node_modules'))],
      },
      plugin: CracoEsbuildPlugin,
    },
  ],
}
