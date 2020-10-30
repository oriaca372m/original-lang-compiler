const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
	mode: 'development',
	target: 'node',
	devtool: 'inline-source-map',
	externals: [nodeExternals()],
	entry: './src/main.ts',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [
			{
				enforce: 'pre',
				test: /\.(ts|js)$/,
				exclude: /node_modules/,
				loader: 'eslint-loader',
				options: {
					fix: true
				}
			},
			{
				test: /\.ts$/,
				loader: 'ts-loader'
			}
		]
	},
	resolve: {
		extensions: ['.wasm', '.ts', '.mjs', '.js', '.json'],
		alias: {
			Src: path.resolve(__dirname, 'src/')
		}
	},
	cache: {
		type: 'filesystem',
		buildDependencies: {
			config: [__filename]
		}
	}
}
