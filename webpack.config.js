const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: {
        polyfill: ['@babel/polyfill', 'es5-shim', 'es5-shim/es5-sham'],
        app: './src/index.js'
    },
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js', '.css']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: "pre",
                use: 'es3ify-loader'
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                },
                exclude: /node_modules/,
            },
            {
                test: /\.san$/,
                use: 'san-loader',
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'index.html')
        }),
        new CleanWebpackPlugin(),
    ],
    devtool: "source-map",
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 9000
    },
    optimization: {
        minimize: false, // 是否压缩打包文件 默认为 true
        // splitChunks: {
        //     cacheGroups: {
        //         common: {
        //             name: 'common',
        //             minSize: 1,
        //             chunks: 'all',
        //             priority: 100,
        //             minChunks: 2 // 使用含n个及以上的打包为一个文件
        //         },
        //         vendor: {
        //             name: "vendor",
        //             test: /[\\/]node_modules[\\/]/,
        //             chunks: "all",
        //             priority: 10
        //         }
        //     }
        // }
    }
}