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
      markerArr: state => state.restoMap.markers,
    }),
  },
  watch: {
    restoList() {
      this.filterMarker();
    },
    markerArr: {
      handler(newVal) {
        this.bounceMarker(newVal);
      },
      deep: true,
      immediate: false,
      // this.bounceMarker(),
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
      this.$store.commit('restoMap/resetMarkers');

      this.restoList.forEach(resto => {
        this.$store.commit('restoMap/addMarker', {
          id: resto.id,
          position: { lat: resto.lat, lng: resto.lng },
          icon: this.restoIcon,
          animation: this.google.maps.Animation.DROP,
          bouncing: false,
        });
      });
      this.buildMarkers();
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

    buildMarkers() {
      // reset the markers arrays
      this.markers = [];

      this.markerArr.forEach((mark, i) => {
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
        }, i * 200);
      });
    },
    // clearMarkers() {
    //   this.markers.forEach(marker => {
    //     marker.setMap(null);
    //   });
    // },
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
