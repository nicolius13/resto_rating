<template>
  <div class="back">
    <Header />
    <nuxt class="main" />
    <Footer />
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
  // change the body class
  head() {
    return {
      bodyAttrs: {
        class: this.$store.state.restoMap.light ? 'light main' : 'dark',
      },
    };
  },
};
</script>

<style scoped>
/* heigth the screen - header and footer */
.main {
  height: Calc(100vh - 76px - 70px);
}
</style>
