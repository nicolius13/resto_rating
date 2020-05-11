<template>
  <div>
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
};
</script>

<style scoped>
/* heigth the screen - header and footer */
.main {
  height: Calc(100vh - 76px - 70px);
}
</style>
