const path = require("path");
module.exports = {
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "Unit Domains";
      return args;
    });
  },
  runtimeCompiler: true,
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        components: path.resolve(__dirname, "src/components"),
        contracts: path.resolve(__dirname, "src/contracts"),
        contractUtils: path.resolve(__dirname, "src/contractUtils"),
        utils: path.resolve(__dirname, "src/utils"),
        views: path.resolve(__dirname, "src/views"),
        icons: path.resolve(__dirname, "src/assets/icons"),
        images: path.resolve(__dirname, "src/assets/images"),
        http: path.resolve(__dirname, "src/httpconfig"),
        server: path.resolve(__dirname, "src/server"),
        store: path.resolve(__dirname, "src/store"),
      },
      extensions: [".js", ".vue", ".json"],
    },
  },
};
