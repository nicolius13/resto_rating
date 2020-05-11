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
};
</script>

<style scoped></style>
