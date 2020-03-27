'use strict';
// const isDev = process.env.NODE_ENV === 'development'
const webpack = require('webpack');
const path = require('path');

module.exports = {

    // mode: isDev ? 'development': 'production',
    // mode: 'development',

    entry: './src/index.js',

    // devServer: {
    //   contentBase: './public',
    //   inline: true,
    //   hot: true
    // },
    output: {
        path: path.resolve(__dirname, 'public'),
        publicPath: '/public/',
        filename: 'bundle.js'
    },
    devtool: 'source-map',
    module: {
        rules: [
          {
            test: [ /\.vert$/, /\.frag$/ ],
            use: 'raw-loader'
          }
        ],
        performance: { hints: false }
    },

    plugins: [
        new webpack.DefinePlugin({
            'CANVAS_RENDERER': JSON.stringify(true),
            'WEBGL_RENDERER': JSON.stringify(true)
        })
    ]

};
