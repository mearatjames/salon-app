module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],

  configureWebpack: {
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js' // 'vue/dist/vue.common.js' for webpack 1
      }
    }
  },

  pwa: {
    name: 'AiAi Salon'
  },
}