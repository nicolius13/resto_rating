<template>
  <div>
    <Header />
    <nuxt class="mainApp" />
  </div>
</template>

<script>
import Header from '../components/UI/Header';
export default {
  layoutTransition: 'layout',
  components: {
    Header,
  },
};
</script>

<style scoped>
/* heigth the screen - header */
.mainApp {
  height: Calc(100vh - 76px);
}
</style>
