/****************************************
    Webpack multipage setup with multiple `module.exports`
    Development phase
/****************************************/

const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack')

//Common config
var config = {
    mode: "development",

    stats: {
        modules: false,
        entrypoints: false,
    },

    performance: {
        maxEntrypointSize: 1024000,
        maxAssetSize: 1024000
    },

    devtool: "source-map",

    module: {
        rules: [
            {
                test: /\.(scss|css)$/,
                use: [
                    { loader: MiniCssExtractPlugin.loader, options: {} },
                    { loader: "css-loader", options: { url: false } },
                    { loader: "postcss-loader", options: {} },
                    { loader: "sass-loader", options: {} },
                ]
            },

            {
                test: /\.(glsl|vs|fs|vert|frag)$/,
                exclude: /node_modules/,
                use: ['raw-loader', 'glslify-loader']
            },
        ],
    },
}



//Home Page setup
var homePage = Object.assign({}, config, {
    name: "homePage",

    entry: {
        home: path.resolve(__dirname, "./src/home.index.js"),
    },

    output: {
        filename: "js/[name].js",
        path: path.resolve(__dirname, "dist"),
    },

    devServer: {
        compress: true,
        port: 8080,

        proxy: [
            {
                '/api': {
                    target: 'http://portfolio.localhost:80',
                    changeOrigin: true,
                    secure: false,
                },

                devMiddleware: {
                    writeToDisk: true,
                },
            }
        ]
    },


    plugins: [
        new CleanWebpackPlugin({}),

        new CopyPlugin({
            patterns: [
                { from: "static/img", to: "assets/img" },
                { from: "static/models", to: "assets/models" },
                { from: "static/draco", to: "assets/draco" },
                { from: "static/fonts", to: "assets/fonts" },
                { from: "src/php", to: "assets/php" },
            ],
        }),

        new HtmlWebpackPlugin({
            template: "./src/pages/home.html",
            filename: 'index.html',
            inject: "head",
            chunks: ['home'],
            scriptLoading: 'defer'
        }),

        new MiniCssExtractPlugin({       
            filename: "css/[name].css",
        }),
    ],

    optimization: {
        splitChunks: {
            cacheGroups: {
                default: false,

                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    chunks: "initial",
                    name: "homeVendor",
                    priority: -10,
                },

                async: {
                    chunks: "async",
                    name: "homeAsync",
                    enforce: true,
                    priority: -9,
                    reuseExistingChunk: true,
                },

                'touchModul': {
                    test: /[\\/]node_modules[\\/]hammerjs[\\/]|[\\/]src[\\/]js[\\/]touch|[\\/]node_modules[\\/]rangetouch[\\/]/,
                    name: 'homeTouchModul',
                    chunks: 'all',
                    enforce: true,
                    priority: 10
                },
            }
        },
    }
});


//webpack Settings for all other pages (except for the Home page)
var otherPages = Object.assign({}, config, {
    name: "otherPages",

    entry: {
        about: path.resolve(__dirname, "./src/about.index.js"),
        works: path.resolve(__dirname, "./src/works.index.js"),
        lab: path.resolve(__dirname, "./src/lab.index.js"),
    },

    output: {
        filename: "js/[name].js",
        path: path.resolve(__dirname, "dist"),
    },


    plugins: [
        //about.php
        new HtmlWebpackPlugin({
            template: './src/pages/about/about.php',
            filename: 'about/index.php',
            inject: "head",
            chunks: ['about'],
            scriptLoading: 'defer'
        }),

        //works.php
        new HtmlWebpackPlugin({
            template: './src/pages/works/works.php',
            filename: 'works/index.php',
            inject: "head",
            chunks: ['works'],
            scriptLoading: 'defer'
        }),

        //lab.php
        new HtmlWebpackPlugin({
            template: './src/pages/lab/lab.php',
            filename: 'lab/index.php',
            inject: "head",
            chunks: ['lab'],
            scriptLoading: 'defer'
        }),


        new MiniCssExtractPlugin({     
            filename: "css/[name].css",
        }),
    ],

    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    chunks: "initial",
                    name: "vendor",
                    priority: -10,
                },
            }
        },
    }

});
module.exports = [homePage, otherPages];