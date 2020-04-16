<template>
  <div>
    <Header />
    <nuxt class="mainApp" />
  </div>
</template>

<script>
import Header from '../components/UI/Header';
export default {
  components: {
    Header,
  },
};
</script>

<style scoped>
.mainApp {
  height: Calc(100vh - 76px);
}
</style>
