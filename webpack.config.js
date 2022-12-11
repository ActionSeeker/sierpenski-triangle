const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
    target: 'electron-renderer',
    externals: [nodeExternals()], // removes node_modules from your final bundle
    context: path.join(__dirname, 'src'),
    entry: { serverEntry: ['./renderer/index.ts'] }, // make sure this matches the main root of your code
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
            },
        ],
    },
    output: {
        path: path.join(__dirname, 'dist'), // this can be any path and directory you want
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    optimization: {
        minimize: true, // enabling this reduces file size and readability
    },
}
