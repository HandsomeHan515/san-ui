const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

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
        alias: {
            "@": path.resolve(__dirname, './src')
        },
        extensions: ['.js', '.san', '.scss']
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
            {
                test: /\.scss$/,
                include: [path.resolve(__dirname, 'src/styles')],
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                require('autoprefixer'),
                            ]
                        }
                    },
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'index.html')
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "css/[name].bundle.css",
            chunkFilename: "css/[id].chunk.css"
        })
    ],
    devtool: "source-map",
    devServer: {
        open: true,
        hot: true,
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        host: 'localhost',
        port: 8088
    }
}