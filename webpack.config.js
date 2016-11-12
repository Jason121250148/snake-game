const webpack = require("webpack");
const path = require("path");

module.exports = {
    //entry: __dirname + "/src/main.js",
    entry: [
        "webpack/hot/dev-server",
         "webpack-dev-server/client?http://localhost:8080",
         path.resolve(__dirname, "src/main.js")
    ],
    output: {
        path: __dirname + "/public",
        filename: "bundle.js"
    },

    module: {
        loaders: [
            {
                test: /\.less$/,
                loader: "style!css!less"
            },
            {
                test: /\.js$/,
                exclude: "node_modules/",
                loader: "babel"
            }
        ]
    },

    plugins: [
        new webpack.ProvidePlugin({
            "$": "jquery",
            "jQuery": "jquery"
        }),
        // new webpack.BannerPlugin("Hi, this is Jason, Wang."),
        new webpack.HotModuleReplacementPlugin()
    ],

    devServer: {
        contentBase: "./public",
        colors: true,
        hot: true
    }
};
