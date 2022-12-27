const TimeBuilder = require("./src/tools/TimeBuilder.js");
const timestamp = TimeBuilder.getCurrent("-");
const freshnetConfig = require("./freshnet.config.js");

const vueConfig = {
	publicPath: "./",
	productionSourceMap: false,
	devServer: {
		disableHostCheck: true,
		port: freshnetConfig.devPort,
		public: "0.0.0.0:8080",
		// open: process.platform === "darwin",
		host: "0.0.0.0",
		// https: false,
		// hotOnly: false,
	},
	css: {
		extract: {
			filename: `./css/style.${timestamp}.css`,
			chunkFilename: `./css/style.${timestamp}.chunk.css`,
		},
	},
	configureWebpack: (config) => {
		config.output.filename = `./js/app.${timestamp}.js`;
		config.output.chunkFilename = `./js/app.${timestamp}.chunk.js`;
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
