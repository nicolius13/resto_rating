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
    />
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
      ratingAverages: state => state.restoMap.ratingAverage,
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
      this.calAverage();
      this.filterList();
    },
  },
  fetch() {
    this.calAverage();
    this.filterList();
  },
  methods: {
    // calculate the average rating
    calAverage() {
      this.restoList.forEach(resto => {
        let averages = 0;
        // check if there is comments if yes => calculate the average
        if (resto.ratings.length !== 0) {
          resto.ratings.forEach(rating => {
            averages += rating.stars;
          });
          averages = averages / resto.ratings.length;
          this.$store.commit('restoMap/addRattingAverage', {
            averages,
            id: resto.id,
          });
          // if no comment put average to 0
        } else {
          this.$store.commit('restoMap/addRattingAverage', {
            averages: 0,
            id: resto.id,
          });
        }
      });
    },
    filterList() {
      let lowerLimit = this.lowerLimit;
      let higherLimit = this.higherLimit;
      // inverse limits if the lowerlimit is higher than the higer limit
      if (this.lowerLimit > this.higherLimit) {
        lowerLimit = this.higherLimit;
        higherLimit = this.lowerLimit;
      }
      // reset the filteredAverages array
      const filteredAverages = [];
      // put the id of the restaurant if it's in the range selected
      this.ratingAverages.forEach(rating => {
        if (rating.average >= lowerLimit && rating.average <= higherLimit) {
          filteredAverages.push(rating.restoId);
        }
      });
      // filter the restaurant list with the resto id put in the filteredAverages array
      this.$store.commit('restoMap/filteringList', filteredAverages);
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
</style>
