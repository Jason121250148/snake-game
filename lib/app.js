import express from "express";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";

const app = express();
app.get("/", (req, res) => {
    res.redirect("/rooms");
});
app.use(express.static("public"));

const builderConfig = require("../webpack.config");
const builder = webpack(Object.assign({
    devtool: "cheap-module-source-map"
}, builderConfig));
app.use(webpackDevMiddleware(
    builder,
    {
        publicPath: builderConfig.output.publicPath
    }
));

export default app;
