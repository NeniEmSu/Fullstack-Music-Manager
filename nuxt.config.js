module.exports = {
  mode: 'universal',

  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      {
        src: 'https://kit.fontawesome.com/41fc25a21c.js'
      }
    ]
  },

  loading: { color: '#fff' },

  css: [],

  plugins: [],

  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/stylelint-module',
    '@nuxtjs/moment'
  ],

  modules: [
    'bootstrap-vue/nuxt',
    'vue-sweetalert2/nuxt',
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    '@nuxtjs/dotenv'
  ],

  axios: {
    proxy: true
  },

  build: {
    extend(config, ctx) {
      config.module.rules.push({
        test: /\.(ogg|mp3|mp4|wav|mpe?g)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]'
        }
      })
    }
  }
}
