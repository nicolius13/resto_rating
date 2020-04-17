<template>
  <GoogleMapLoader :map-config="mapConfig" @map="mapSetter" />
</template>

<script>
// map settings
import mapSettings from '@/assets/mapSettings/mapSettings.json';

import GoogleMapLoader from '../googleMapsGenerator/GoogleMapLoader';

export default {
  components: {
    GoogleMapLoader,
  },
  // get the restaurants list from the parent
  props: {
    restoList: {
      type: Array,
      required: true,
    },
  },
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
  },
  watch: {
    restoList() {
      this.filterMarker();
    },
  },
  mounted() {
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
    // dirty wait for the google object to be passed
    setTimeout(() => {
      this.buildMarkers();
    }, 1000);
  },
  methods: {
    // throw an alert if the geoloc is refuse or not supported
    handleLocationError(browserHasGeoloc) {
      alert(
        browserHasGeoloc
          ? 'Error: The Geolocation service failed.'
          : "Error: Your browser doesn't support geolocation."
      );
    },
    mapSetter(event) {
      this.map = event.map;
      this.google = event.google;
    },
    buildMarkers() {
      this.markers = [];
      this.restoList.forEach(resto => {
        const marker = new this.google.maps.Marker({
          map: this.map,
          id: resto.id,
          position: { lat: resto.lat, lng: resto.lng },
          icon: this.restoIcon,
        });
        this.markers.push(marker);
      });
    },
    clearMarkers() {
      this.markers.forEach(marker => {
        marker.setMap(null);
      });
    },
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
  },
};
</script>

<style scoped></style>
