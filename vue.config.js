const path = require("path");
module.exports = {
    runtimeCompiler: true,
    configureWebpack: {
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
                components: path.resolve(__dirname, 'src/components'),
                contracts: path.resolve(__dirname, 'src/contracts'),
                contractUtils: path.resolve(__dirname, 'src/contractUtils'),
                utils: path.resolve(__dirname, 'src/utils'),
                views: path.resolve(__dirname, 'src/views'),
                icons: path.resolve(__dirname, 'src/assets/icons'),
                images: path.resolve(__dirname, 'src/assets/images'),
                http: path.resolve(__dirname, 'src/httpconfig'),




            },
            extensions: ['.js', '.vue', '.json']
        }
    }
};