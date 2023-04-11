const TimeBuilder = require("./src/tools/TimeBuilder.js");
const timestamp = TimeBuilder.getCurrent("-");
const freshnetConfig = require("./freshnet.config.js");

const vueConfig = {
   publicPath: "./",
   productionSourceMap: false,
   devServer: {
      // disableHostCheck: true,
      port: freshnetConfig.devPort,
      // public: `0.0.0.0:${freshnetConfig.devPort}`,
      // open: process.platform === "darwin",
      // host: "0.0.0.0",
      // https: false,
      // hotOnly: false,
   },
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
   chainWebpack: (config) => {
      config.plugin("html").tap((args) => {
         args[0].title = "Freshnet Enterprise";
         return args;
      });
   },
};

if (typeof freshnetConfig.exportAbsolutePath === "string") {
   vueConfig["outputDir"] = freshnetConfig.exportAbsolutePath;
}

module.exports = vueConfig;
