const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const Dec = require('types-webpack-bundler');
const path = require('path');
const TypescriptDeclarationPlugin = require('typescript-declaration-webpack-plugin');

module.exports = {
	context: __dirname,
	mode: 'production',
	entry: './src/index.ts',
	module: {
		rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
    ],
	},
	devtool: 'source-map',
	plugins: [new TypescriptDeclarationPlugin({
	
})],
	resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
	watchOptions: {
    // for some systems, watching many files can result in a lot of CPU or memory usage
    // https://webpack.js.org/configuration/watch/#watchoptionsignored
    // don't use this pattern, if you have a monorepo with linked packages
    ignored: /node_modules/,
  },
	output: {
		path: path.resolve(__dirname, 'lib'),
		filename: 'iban-to-bic.js',
		library: 'ibanToBic'
	},
};