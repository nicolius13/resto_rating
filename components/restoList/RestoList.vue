<template>
  <div>
    <h6 class="filterTitle">Filter restaurants :</h6>
    <div class="pickers">
      <div>
        <p class="mb-0">From</p>
        <div class="d-flex">
          <span class="mr-2">{{ lowerLimit }}</span>
          <StarPick :stars="lowerLimit" @starPick="lowerLimit = $event" />
        </div>
      </div>
      <div>
        <p class="mb-0">To</p>
        <div class="d-flex">
          <span class="mr-2">{{ higherLimit }}</span>
          <StarPick :stars="higherLimit" @starPick="higherLimit = $event" />
        </div>
      </div>
    </div>
    <RestaurantCard
      v-for="(resto, index) in restoList"
      :key="index"
      :resto="resto"
      :restoId="index"
    />
  </div>
</template>

<script>
import StarPick from '../UI/StarsPick';
import RestaurantCard from './RestaurantCard';

export default {
  components: {
    RestaurantCard,
    StarPick,
  },
  props: {
    restoList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      lowerLimit: 0,
      higherLimit: 5,
    };
  },
};
</script>

<style scoped>
.filterTitle {
  margin-top: 1rem;
  color: #ff2e63;
}
.pickers {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
</style>
