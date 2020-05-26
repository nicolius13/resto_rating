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
      v-for="resto in displayedResto"
      :key="resto.id"
      :resto="resto"
      :places="places"
    />
    <button
      v-if="hasPage && displayedResto.length > 15"
      @click="seeMoreResto"
      class="okBtn outlineBtn"
    >
      See More
    </button>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import StarPick from '../UI/StarsPick';
import RestaurantCard from './RestaurantCard';

export default {
  components: {
    StarPick,
    RestaurantCard,
  },
  props: {
    places: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      lowerLimit: 0,
      higherLimit: 5,
    };
  },

  computed: {
    displayedResto() {
      return this.filteredList.filter(marker => {
        return this.markersDisplayed.some(mark => {
          return marker.id === mark.id;
        });
      });
    },
    ...mapState({
      restoList: state => state.restoMap.restoList,
      filteredList: state => state.restoMap.filteredList,
      markersDisplayed: state => state.restoMap.markersDisplayed,
      hasPage: state => state.restoMap.searchResultHasPage,
    }),
  },

  // check if we change ratings limit and filter restaurants if so
  watch: {
    lowerLimit() {
      this.filterList();
    },
    higherLimit() {
      this.filterList();
    },
    // watch if restaurant is added
    restoList() {
      this.filterList();
    },
  },
  methods: {
    filterList() {
      let lowerLimit = this.lowerLimit;
      let higherLimit = this.higherLimit;
      // inverse limits if the lowerlimit is higher than the higer limit
      if (this.lowerLimit > this.higherLimit) {
        lowerLimit = this.higherLimit;
        higherLimit = this.lowerLimit;
      }

      const filteredAverages = [];
      // put the id of the restaurant if it's in the range selected
      this.restoList.forEach(resto => {
        if (resto.rating >= lowerLimit && resto.rating <= higherLimit) {
          filteredAverages.push(resto);
        }
      });
      // filter the restaurant list with the resto id put in the filteredAverages array
      this.$store.commit('restoMap/setFilteredList', filteredAverages);
    },

    seeMoreResto() {
      this.$store.commit('restoMap/toggleSeeMoreCliked');
    },
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

.okBtn {
  display: flex;
  margin: 0.8rem auto;
}
</style>
