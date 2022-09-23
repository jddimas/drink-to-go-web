/*=========================================================================================
  File Name: vue.config.js
  Description: configuration file of vue
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/
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

