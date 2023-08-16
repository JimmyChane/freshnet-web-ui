const { defineConfig } = require("@vue/cli-service");

const freshnetConfig = require("./freshnet.config.ts");

const AppendIdentifierPlugin = {
  apply(compiler) {
    compiler.hooks.compilation.tap("AppendIdentifierPlugin", (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: "AppendIdentifierPlugin",
          stage: webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
        },
        () => {
          for (const chunk of compilation.chunks) {
            for (const file of chunk.files) {
              if (file.endsWith(".js")) {
                const newFileName = file.replace(/(\.js$)/, "(1).js");
                compilation.renameAsset(file, newFileName);
              } else if (file.endsWith(".css")) {
                const newFileName = file.replace(/(\.css$)/, "(1).css");
                compilation.renameAsset(file, newFileName);
              }
            }
          }
        },
      );
    });
  },
};

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: { port: freshnetConfig.devPort },
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: "javascript/auto",
        },
      ],
    },
    resolve: {
      fallback: {
        "path": require.resolve("path-browserify"),
        "stream": require.resolve("stream-browserify"),
        fs: false,
      },
    },
  },
  chainWebpack: (config) => {
    config.plugin("appendIdentifier").use(AppendIdentifierPlugin);
  },
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "Freshnet Enterprise";
      return args;
    });
  },

  pwa: {
    name: "Freshnet Enterprise",
    themeColor: "#2f579d",
    msTileColor: "#f0f0f0",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",

    iconPaths: {
      favicon16: "./icon/favicons-16.ico",
      favicon32: "./icon/favicons-32.ico",
      faviconSVG: "./icon/favicon.svg",
    },

    manifestOptions: {
      name: "Freshnet Enterprise",
      short_name: "Freshnet",
      icons: [
        { src: "./icon/logos-129.png", type: "image/png", sizes: "129x129" },
        { src: "./icon/logos-192.png", type: "image/png", sizes: "192x192" },
        { src: "./icon/logos-512.png", type: "image/png", sizes: "512x512" },
        {
          src: "./icon/logos-512.svg",
          type: "image/svg+xml",
          sizes: "512x512",
        },
      ],
      start_url: "/",
      scope: "./",
      display: "standalone",
      background_color: "#f0f0f0",
      theme_color: "#2f579d",
    },

    workboxOptions: {
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/api\.freshnet\.app\//,
          method: "GET",
          handler: "NetworkFirst",
          options: {
            cacheName: "api.freshnet.app-precache",
          },
        },
        {
          urlPattern: /^https:\/\/res\.freshnet\.app\//,
          method: "GET",
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: "res.freshnet.app-precache",
          },
        },
        {
          urlPattern: /^(?!https:\/\/(?:res|api)\.freshnet\.app\/).*/,
          method: "GET",
          handler: "NetworkFirst",
          options: {
            cacheName: "external-precache",
          },
        },
      ],
    },
  },
});
