<template>
  <div>
    <b-container id="mapContainer" class=" d-flex flex-column" fluid>
      <b-row class="justify-content-center">
        <h1 class="pageTitle">Add Restaurant</h1>
      </b-row>
      <b-row>
        <b-col>
          <h4 class="text-center instruction">
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
  layout: 'maps',
  components: {
    Maps,
    AddRestoModal,
  },
  data() {
    return {
      newRestoCoord: {},
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
      this.newRestoCoord = event.latLng;
    },
    addResto($event) {
      this.$store.commit('restoMap/addRestaurant', {
        id: (this.$store.state.restoMap.restoList.length + 1).toString(),
        name: $event.name,
        geometry: {
          location: this.newRestoCoord,
        },
        reviews: [],
        rating: 0,
        user_ratings_total: 0,
      });
    },
  },
};
</script>

<style scoped lang="postcss">
.pageTitle {
  font-size: rfs(3rem);
  margin-top: 1.5rem;
  margin-bottom: 0;
}
.instruction {
  font-size: rfs(1.5rem);
  color: #ff2e63;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}
</style>
