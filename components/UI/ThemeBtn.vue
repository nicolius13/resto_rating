<template>
  <button @click="toggleTheme" class="themeBtn colorTransition">
    <b-icon :icon="light ? 'sun' : 'moon'"></b-icon>
    {{ light ? 'Light' : 'Dark' }}
  </button>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      light: state => state.restoMap.light,
    }),
  },
  methods: {
    toggleTheme() {
      this.$store.commit('restoMap/toggleTheme');
    },
  },
};
</script>

<style lang="postcss" scoped>
/* Theme Switch */
.themeBtn {
  background-color: #2c2c2c;
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 1rem;
  color: rgb(200, 200, 200);
}
.light .themeBtn {
  background-color: #f5f5f5;
  color: #3d3d3d;
}

.credit {
  font-size: rfs(1rem);
  color: #525252;
}
.light .credit {
  color: #8d8d8d;
}
</style>
