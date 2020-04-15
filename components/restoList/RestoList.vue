<template>
  <div>
    This is a resto list!
    <RestaurantCard
      v-for="(resto, index) in restoList"
      :key="index"
      :resto="resto"
      :restoId="index"
    />
  </div>
</template>

<script>
import RestaurantCard from './RestaurantCard';

export default {
  components: {
    RestaurantCard,
  },
  props: {
    restoList: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped></style>
