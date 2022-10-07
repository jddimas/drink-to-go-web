/*=========================================================================================
  File Name: vue.config.js
  Description: configuration file of vue
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/
// Do NOT use the HtmlWebpackPlugin name to avoid a collision with standard Vue usage of the html-webpack-plugin
// NOTE also this uses the vue-cli-service dependency path for html-webpack-plugin
// Beware if the require() path is incorrect, it may fail silently, thus ignoring vue.config.js (per (per https://github.com/vuejs/vue-cli/issues/5442)
const HtmlWebpackPlugin2 = require('@vue/cli-service/node_modules/html-webpack-plugin');

const path = require('path');
module.exports = {
  publicPath: './',
  configureWebpack: {
    resolve: {
      alias: {
        "@assets": path.resolve(__dirname, 'src/assets'),
        "@views": path.resolve(__dirname, 'src/views'),
        "@mixins": path.resolve(__dirname, 'src/components/mixins'),
      }
    },
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    }
  }
  // devServer: {
  //   overlay: {
  //     warnings: true,
  //     errors: true
  //   }
  // }
}

