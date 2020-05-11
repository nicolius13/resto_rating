<template>
  <div>
    <Header />
    <nuxt class="mainApp" />
    <Footer />
  </div>
</template>

<script>
import Header from '../components/UI/Header';
import Footer from '../components/UI/Footer';
export default {
  components: {
    Header,
    Footer,
  },
};
</script>

<style scoped>
/* heigth the screen - header and footer */
.mainApp {
  height: Calc(100vh - 76px - 70px);
}
</style>
