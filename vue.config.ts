const TimeBuilder = require("./src/tools/TimeBuilder.js");
const timestamp = TimeBuilder.getCurrent("-");
const freshnetConfig = require("./freshnet.config.js");

const vueConfig: Record<string, any> = {
  publicPath: "./",
  productionSourceMap: false,
  devServer: { port: freshnetConfig.devPort },
  css: {
    extract: {
      filename: `./css/style.${timestamp}.css`,
      chunkFilename: `./css/style.${timestamp}.chunk.css`,
    },
  },
  configureWebpack: {
    output: {
      filename: `./js/app.${timestamp}.js`,
      chunkFilename: `./js/app.${timestamp}.chunk.js`,
    },
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: "javascript/auto",
        },
      ],
    },
  },
  chainWebpack: (config: any) => {
    config.plugin("html").tap((args: any) => {
      args[0].title = "Freshnet Enterprise";
      return args;
    });
  },
};

if (typeof freshnetConfig.exportAbsolutePath === "string") {
  vueConfig["outputDir"] = freshnetConfig.exportAbsolutePath;
}

module.exports = vueConfig;
