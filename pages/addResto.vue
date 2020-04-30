<template>
  <div>
    <b-container id="mapContainer" class=" d-flex flex-column" fluid>
      <b-row class="justify-content-center">
        <h1 class="pageTitle">Add Restaurant</h1>
      </b-row>
      <b-row class=" flex-grow-1">
        <b-col class="d-flex flex-grow-1">
          <Maps @googleMap="googleInit" @markers="markers = $event" />
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
      this.markers.forEach(marker => {
        marker.setClickable(false);
      });
    },
  },
  created() {
    // set the filtered list to all restaurant because there is no filtering in this page
    this.$store.commit('restoMap/setFilteredList');
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
  margin-top: 2rem;
}
</style>
