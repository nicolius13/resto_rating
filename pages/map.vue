<template>
  <div>
    <b-container id="mapContainer" fluid>
      <b-row class="mapRow">
        <b-col cols="8" class="mapCol">
          <Maps @googleMap="googleInit" @markers="markers = $event" />
        </b-col>
        <RestoList id="list" :places="places" class="col-4 mapCol" />
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import Maps from '../components/maps/Maps';
import RestoList from '../components/restoList/RestoList';

export default {
  layout: 'maps',
  components: {
    Maps,
    RestoList,
  },
  data() {
    return {
      google: null,
      map: null,
      places: null,
      markers: [],
    };
  },
  computed: {
    ...mapState({
      selectedRestaurant: state => state.restoMap.selectedRestaurant,
    }),
  },
  watch: {
    selectedRestaurant() {
      this.bounceMarker();
    },
    markers(newVal) {
      this.markers.forEach(marker => {
        this.google.maps.event.clearListeners(marker, 'click');

        // add click listener to make the resto card visible when clicked
        marker.addListener('click', () => {
          this.clickMarker(marker);
        });
      });
    },
  },
  methods: {
    googleInit($event) {
      this.google = $event.google;
      this.map = $event.map;
      this.places = $event.places;
    },
    // change the selected restaurant
    clickMarker(marker) {
      this.$store.commit('restoMap/setSelectedRestaurant', marker.id);
      // scroll to the restaurant card
      const resto = document.getElementById('resto-' + marker.id);
      resto.scrollIntoView(true);
    },

    // make the marker bounce when it's selected in the list
    bounceMarker() {
      this.markers.forEach(marker => {
        if (marker.id === this.selectedRestaurant) {
          marker.setAnimation(this.google.maps.Animation.BOUNCE);
        } else {
          marker.setAnimation(null);
        }
      });
    },
  },
};
</script>

<style scoped>
#list {
  overflow: auto;
  /* firefox 64 */
  scrollbar-width: thin;
  scrollbar-color: #ff2e63 #292929;
}
/* webkit */
#list::-webkit-scrollbar {
  width: 8px;
}
#list::-webkit-scrollbar-thumb {
  background: #ff2e63;
}
#list::-webkit-scrollbar-track {
  background: #292929;
}
</style>
