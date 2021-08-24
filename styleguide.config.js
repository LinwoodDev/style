const path = require('path');
const glob = require('glob');

module.exports = {
    components: function () {
        return glob.sync(path.resolve(__dirname, 'src/components/**/*.tsx'))
            .filter(function (module) {
                return /\/[A-Z]\w*\.tsx$/.test(module);
            });
    },
    webpackConfig: {
        context: path.resolve(__dirname),
        output: {
            filename: 'bundle.js',
            path: path.join(__dirname, 'temp')
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js"]
        },
        module: {
            rules: [{
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    loader: "babel-loader"
                }
            ]
        }
    },
    propsParser: require("react-docgen-typescript").withCustomConfig(
        "./tsconfig.json"
    ).parse,
};