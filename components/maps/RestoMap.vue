<template>
  <div ref="googleMap" class="google-map"></div>
</template>

<script>
import { mapState } from 'vuex';

import GoogleMapsApiLoader from 'google-maps-api-loader';

// map settings
import mapSettings from '@/assets/mapSettings/mapSettings.json';

export default {
  data() {
    return {
      // apiKey: process.env.GOOGLE_MAPS_API_KEY,
      mapSettings: mapSettings,
      map: null,
      google: null,
      markers: [],
      mapCenter: {
        lat: 17.984052,
        lng: 102.539655,
      },
      restoIcon: require('@/assets/img/resto-icon.png'),
    };
  },
  computed: {
    mapConfig() {
      return {
        ...this.mapSettings,
        center: this.mapCenter,
      };
    },
    ...mapState({
      restoList: state => state.restoMap.filteredList,
      allMarkersList: state => state.restoMap.allMarkersList,
      markersDisplayed: state => state.restoMap.markersDisplayed,
    }),
  },
  watch: {
    restoList() {
      this.filterMarker();
    },
    markersDisplayed: {
      handler(newVal) {
        this.bounceMarker(newVal);
      },
      deep: true,
      immediate: false,
    },
    // watch modification of the map center and re center it
    'mapConfig.center.lat'() {
      this.reCenterMap();
    },
    'mapConfig.center.lng'() {
      this.reCenterMap();
    },
  },
  mounted() {
    GoogleMapsApiLoader({
      apiKey: this.apiKey,
    }).then(googleMapApi => {
      this.google = googleMapApi;
      this.initializeMap();
      // wait until the map is ready
      this.google.maps.event.addListenerOnce(
        this.map,
        'idle',
        this.initMarkers
      );
      // add event listener (when the map is still)
      this.google.maps.event.addListener(this.map, 'idle', this.handleMapIdle);
    });
    // Try HTML geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.mapConfig.center.lat = position.coords.latitude;
          this.mapConfig.center.lng = position.coords.longitude;
        },
        () => {
          this.handleLocationError(true);
        }
      );
    } else {
      this.handleLocationError(false);
    }
  },

  methods: {
    // ////////////////////////
    //          MAP
    // ///////////////////////

    initializeMap() {
      const mapContainer = this.$refs.googleMap;
      this.map = new this.google.maps.Map(mapContainer, this.mapConfig);
    },
    reCenterMap() {
      this.map.setCenter(this.mapConfig.center);
    },
    // throw an alert if the geoloc is refuse or not supported
    handleLocationError(browserHasGeoloc) {
      alert(
        browserHasGeoloc
          ? 'Error: The Geolocation service failed.'
          : "Error: Your browser doesn't support geolocation."
      );
    },

    // ////////////////////////
    //          MARKERS
    // ///////////////////////

    initMarkers() {
      // check if the list of all marker is already populated
      let markerListIsEmpty = true;
      if (this.allMarkersList.length > 0) {
        markerListIsEmpty = false;
      }

      this.restoList.forEach(resto => {
        const markerOptions = {
          id: resto.id,
          position: { lat: resto.lat, lng: resto.lng },
          icon: this.restoIcon,
          animation: this.google.maps.Animation.DROP,
          bouncing: false,
        };
        // pass if the array is alredy populated with all markers
        if (markerListIsEmpty) {
          // put all resto markers into an array
          this.$store.commit('restoMap/addMarker', {
            markerOptions: markerOptions,
            markerList: 'allMarkersList',
          });
        }
      });
    },

    handleMapIdle() {
      // reset the markerDisplayed array
      this.$store.commit('restoMap/resetMarkers');
      // get the map bounds
      const mapBounds = this.map.getBounds();

      this.allMarkersList.forEach(marker => {
        // create a latLng object of the resto coord
        const latLng = new this.google.maps.LatLng(marker.position);
        // check if the restaurant is in the map bounds if true add it to the displayed markers array
        if (mapBounds.contains(latLng)) {
          this.$store.commit('restoMap/addMarker', {
            markerOptions: marker,
            markerList: 'markersDisplayed',
          });
        }
      });
      // build the markers
      this.buildMarkers();
    },

    buildMarkers() {
      // find the markers alredy rendered
      const alreadyRendered = this.markersDisplayed.filter(marker => {
        return this.markers.some(mark => {
          return marker.id === mark.id;
        });
      });
      // find the markers that need to be renered
      const markerToRender = this.markersDisplayed.filter(marker => {
        return !this.markers.some(mark => {
          return marker.id === mark.id;
        });
      });

      // remove markers that are not needed from the map and the markers array
      for (let i = 0; i < this.markers.length; i++) {
        let isListed = false;
        alreadyRendered.forEach(mark => {
          if (this.markers[i].id === mark.id) {
            isListed = true;
          }
        });
        if (!isListed) {
          this.markers[i].setMap(null);
          this.markers.splice(i, 1);
          // decrement i to not jump one element after the splice
          i--;
        }
      }

      markerToRender.forEach((mark, i) => {
        // set the drop animation delay between each marker
        setTimeout(() => {
          const marker = new this.google.maps.Marker({
            map: this.map,
            id: mark.id,
            position: mark.position,
            icon: mark.icon,
            animation: mark.animation,
          });
          this.markers.push(marker);
        }, i * 100);
      });
    },
    // filter the displayed markers by rating
    filterMarker() {
      this.markers.forEach(marker => {
        let isListed = false;
        this.restoList.forEach(resto => {
          if (resto.id === marker.id) {
            isListed = true;
          }
        });
        if (isListed) {
          marker.setVisible(true);
        } else {
          marker.setVisible(false);
        }
      });
    },
    // make the marker bounce when it's selected in the list
    bounceMarker(arr) {
      arr.forEach(marker => {
        if (marker.bouncing) {
          this.markers.forEach(mark => {
            if (marker.id === mark.id) {
              mark.setAnimation(this.google.maps.Animation.BOUNCE);
            }
          });
        } else {
          this.markers.forEach(mark => {
            if (marker.id === mark.id) {
              mark.setAnimation(null);
            }
          });
        }
      });
    },
  },
};
</script>

<style scoped>
.mapContainer,
.google-map {
  height: inherit;
}
</style>
