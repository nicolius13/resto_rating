<template>
  <div>
    <b-container id="mapContainer" class=" d-flex flex-column" fluid>
      <b-row class="justify-content-center">
        <h1 class="pageTitle">Add Restaurant</h1>
      </b-row>
      <b-row>
        <b-col>
          <h4 class="text-center">
            To add a restaurant right click on the map where you want to add it
          </h4>
        </b-col>
      </b-row>
      <b-row class=" flex-grow-1">
        <b-col class="d-flex flex-grow-1">
          <Maps
            @googleMap="googleInit"
            @markers="markers = $event"
            @restoImported="setFilteredList"
          />
        </b-col>
      </b-row>
    </b-container>
    <!-- MODAL -->
    <addRestoModal @addingResto="addResto" />
  </div>
</template>

<script>
import AddRestoModal from '../components/addResto/AddRestoModal';

import Maps from '../components/maps/Maps';
export default {
  components: {
    Maps,
    AddRestoModal,
  },
  data() {
    return {
      newResto: {},
      markers: [],
    };
  },
  watch: {
    markers() {
      // set all markers to be not clickable
      this.markers.forEach(marker => {
        marker.setClickable(false);
      });
    },
  },
  methods: {
    googleInit($event) {
      this.google = $event.google;
      this.map = $event.map;
      // add right click event on the map
      this.google.maps.event.addListener(
        this.map,
        'rightclick',
        mapsMouseEvent => {
          mapsMouseEvent.stop();
          this.addRestoClick(mapsMouseEvent);
        }
      );
    },

    setFilteredList() {
      // set the filtered list to all restaurant because there is no filtering in this page
      this.$store.commit('restoMap/setFilteredListToAllResto');
    },
    // ////////////////////////
    //        ADD RESTO
    // ///////////////////////
    addRestoClick(event) {
      this.$bvModal.show('addRestoModal');

      // add lat and lng to the new resto object
      this.newResto.lat = event.latLng.lat();
      this.newResto.lng = event.latLng.lng();
    },
    addResto($event) {
      // add the name in the new resto object
      this.newResto.restaurantName = $event.name;
      this.$store.commit('restoMap/addRestaurant', {
        ...this.newResto,
        id: this.$store.state.restoMap.restoList.length + 1,
        ratings: [],
      });
    },
  },
};
</script>

<style scoped>
.pageTitle {
  margin-top: 1.5rem;
  margin-bottom: 0;
  /* color: #ff2e63; */
}
h4 {
  color: #ff2e63;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}
</style>
