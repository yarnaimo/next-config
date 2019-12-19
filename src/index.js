const { resolve, join } = require('path')
const webpack = require('webpack')

const withSass = require('@zeit/next-sass')
const withCss = require('@zeit/next-css')
const withPWA = require('next-pwa')
const withFonts = require('next-fonts')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})

const registerSW = config => {
    const registerScript = join(__dirname, 'register.js')
    console.log(
        `> [@yarnaimo/next-config] register service worker with: ${resolve(
            registerScript,
        )}`,
    )

    const entry = config.entry
    config.entry = async () =>
        entry().then(entries => {
            if (
                entries['main.js'] &&
                !entries['main.js'].includes(registerScript)
            ) {
                entries['main.js'].unshift(registerScript)
            }
            return entries
        })
}

module.exports = (nextConfig = {}) => {
    const nextConfigWithPlugins = withBundleAnalyzer(
        withFonts(withCss(withSass(withPWA(nextConfig)))),
    )

    return {
        ...nextConfigWithPlugins,

        /**
         * @param {webpack.Configuration} [config]
         */
        webpack(config, options) {
            if (!options.dev) {
                registerSW(config)
            }

            config.plugins.push(
                new webpack.IgnorePlugin({
                    resourceRegExp: /(?:^|\/)firebase-admin$/,
                    contextRegExp: /.*/,
                }),
            )

            if (typeof nextConfigWithPlugins.webpack === 'function') {
                return nextConfigWithPlugins.webpack(config, options)
            }

            return config
        },
    }
}
