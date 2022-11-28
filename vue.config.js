const TimeBuilder = require("./src/tools/TimeBuilder.js");
const timestamp = TimeBuilder.getCurrent("-");
const config = require("./freshnet.config.js");

module.exports = {
	publicPath: "./",
	outputDir: config.exportAbsolutePath,
	productionSourceMap: false,
	devServer: {
		disableHostCheck: true,
		port: config.devPort,
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
	/* pwa: {
		manifestOptions: {
			name: "Freshnet Enterprise",
			short_name: "Freshnet",
			icons: [
				{ src: "./logos-192.png", type: "image/png", sizes: "192x192" },
				{ src: "./logos-512.png", type: "image/png", sizes: "512x512" },
				{ src: "./logos-512.svg", type: "image/svg+xml", sizes: "512x512" },
			],
			start_url: "/",
			background_color: "#f0f0f0",
			display: "standalone",
			scope: "/",
			theme_color: "#2f579d",
		},

		workboxPluginMode: "InjectManifest",
		workboxOptions: { swSrc: "src/sw.js" },

		msTileColor: "#000000",
		appleMobileWebAppCapable: "no",
		appleMobileWebAppStatusBarStyle: "default",

		assetsVersion: "",
		manifestPath: "manifest.json",

		manifestCrossorigin: undefined,

		// workboxOptions: {
		//    navigateFallback: "./index.html",
		//    runtimeCaching: [
		//       {
		//          urlPattern: new RegExp("^https://api.zippopoptam.us/us/"),
		//          handler: "networkFirst",
		//          options: {
		//             networkTimeoutSeconds: 20,
		//             cacheName: "api-cache",
		//             cacheableResponse: {
		//                statuses: [0, 200],
		//             },
		//          },
		//       },
		//    ],
		// },
	}, */
};
