const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const entries = require('./build/webpack.entries.js')
const output = require('./build/webpack.output.js')
const plugIns = require('./build/webpack.plugins.js')
const rules = require('./build/webpack.rules.js')

const optimize = ()=>{
  return {
    minimize: true,
    minimizer: [
        new TerserPlugin({
            test: /\.(ts|js)x?$/,
            extractComments: "all",
            terserOptions: {
                compress: {
                    drop_console: true,
                },
            },
        }),
        new CssMinimizerPlugin(),
    ],
    splitChunks: {
        chunks: "all",
        minSize: 0,
        maxInitialRequests: 10,
        maxAsyncRequests: 10,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name(module, chunks, cacheGroupKey) {
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];
              return `${cacheGroupKey}.${packageName.replace("@", "")}`;
            }
          },
          common: {
            minChunks: 2,
            priority: -10
          }
        }
      },
  }
};

var config = {
    entry: entries.baseCode(),
    output: output.webRoot(),
    resolve: {
        extensions: ['.js','.jsx','.ts','.vue','.scss','.json'],
        modules: ['node_modules'],
    },
    module: {
        rules: rules.filters(),
    },
    plugins: plugIns.buildPlugs(),
    optimization: {},
    devServer: {
        port: 3000,
        compress: true,
        hot: true,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
            }
    },
    performance: {
        hints: false
    }

  };

module.exports = ( env, argv) => {

    if (argv.mode === 'development') {
        config.devtool = 'source-map';
        console.log("Runing on Developer Mode " );
    }
  
    if (argv.mode === 'production') {
        config.optimization = optimize();
        console.log("Enabled Production Plugins ");
    }
  
    return config;
  };

  

