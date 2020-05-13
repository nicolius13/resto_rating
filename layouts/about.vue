<template>
  <div>
    <Header />
    <nuxt />
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
        class: this.$store.state.restoMap.light
          ? 'light colorTransition'
          : 'dark colorTransition',
      },
    };
  },
};
</script>

<style scoped></style>
