<template>
  <div class="back">
    <Header @mobileMenu="mobileOpen = $event" />
    <nuxt :style="mainHeight" />
    <Footer class="footer" />
  </div>
</template>

<script>
import Header from '../components/UI/Header';
import Footer from '../components/UI/Footer';
export default {
  layoutTransition: 'layout',
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      mobileOpen: false,
    };
  },
  computed: {
    mainHeight() {
      /* heigth the screen - header and footer */
      if (this.mobileOpen) {
        return 'height: Calc(100vh - 252px - 70px);';
      } else {
        return 'height: Calc(100vh - 76px - 70px);';
      }
    },
  },
  // change the body class
  head() {
    return {
      bodyAttrs: {
        class: this.$store.state.restoMap.light
          ? 'light main colorTransition'
          : 'dark main colorTransition',
      },
    };
  },
};
</script>

<style scoped>
.footer {
  bottom: 0;
}
</style>
