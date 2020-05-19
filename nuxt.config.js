import pkg from './package';

// Router base
const routerBase = '/resto_rating';
// only add `router.base = '/resto_rating/'` if `DEPLOY_ENV` is `GH_PAGES`
const addRouterBase =
  process.env.DEPLOY_ENV === 'GH_PAGES'
    ? {
        router: {
          base: routerBase,
        },
      }
    : {};

export default {
  mode: 'universal',

  /*
   ** Headers of the page
   */
  head: {
    title: 'Resto Finder',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1 shrink-to-fit=no',
      },
      { hid: 'description', name: 'description', content: pkg.description },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href:
          process.env.DEPLOY_ENV === 'GH_PAGES'
            ? `${routerBase}/favicon.ico`
            : '/favicon.ico',
      },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700&display=swap',
      },
    ],
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#ff2e63' },

  /*
   ** Global CSS
   */
  css: ['@/assets/css/main.css'],

  /*
   ** Env
   */
  env: {
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  },

  /*
   ** Router
   */

  ...addRouterBase,

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    'bootstrap-vue/nuxt',
    '@nuxtjs/dotenv',
    [
      'nuxt-fontawesome',
      {
        imports: [
          {
            set: '@fortawesome/free-brands-svg-icons',
            icons: ['faGithubAlt', 'faLinkedinIn', 'faFacebookF'],
          },
        ],
      },
    ],
  ],
  /*
   ** bootstrapVue module configuration
   */
  bootstrapVue: {
    icons: true,
  },
  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
  },

  /*
   ** Build configuration
   */
  build: {
    postcss: {
      plugins: {
        rfs: {},
      },
    },

    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        });
      }
    },
  },
};
