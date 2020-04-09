<template>
  <section class="container">
    <p>{{ message }}</p>
  </section>
</template>

<script>
export default {
  data() {
    return {
      message: 'Init of a great app !',
    }
  },
}
</script>

<style>
body {
  margin: 0;
}
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
