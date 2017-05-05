"use strict";

const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require("webpack");

module.exports = {
    context: path.resolve("./src"),
    entry: {
        "rs": [ "./rs/main.js", "./res/main.less" ]
    },
    output: {
        path: path.resolve("./public/assets"),
        publicPath: "/assets/",
        filename: "[name]/index.js"
    },
    devServer: {
        contentBase: path.resolve("./public")
    },

    module: {
        loaders: [
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel"
            }
        ]
    },

    plugins: [
        new webpack.ProvidePlugin({
            "$": "jquery",
            "jQuery": "jquery"
        }),
        new ExtractTextPlugin("./[name]/res/index.css")
    ],

    // devServer: {
    //     contentBase: "./public",
    //     colors: true,
    //     hot: true
    // }
};
