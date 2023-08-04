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

const vueConfig = {
  transpileDependencies: true,
  publicPath: "./",
  productionSourceMap: false,
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
};

module.exports = defineConfig(vueConfig);
