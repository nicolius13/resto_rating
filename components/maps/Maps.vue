<template>
  <div id="google-map" ref="googleMap"></div>
</template>

<script>
import { mapState } from 'vuex';
import MarkerClusterer from '@google/markerclustererplus';
import GoogleMapsApiLoader from 'google-maps-api-loader';

// map settings
import mapSettings from '@/assets/mapSettings/mapSettings.json';

export default {
  data() {
    return {
      apiKey: process.env.GOOGLE_MAPS_API_KEY,
      mapSettings: mapSettings,
      pageLoad: true,
      places: null,
      map: null,
      google: null,
      markers: [],
      markerCluster: null,
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
      allRestaurants: state => state.restoMap.restoList,
      restoList: state => state.restoMap.filteredList,
      markersDisplayed: state => state.restoMap.markersDisplayed,
      selectedRestaurant: state => state.restoMap.selectedRestaurant,
    }),
  },
  watch: {
    restoList() {
      if (this.map && !this.pageLoad) {
        this.handleMapIdle();
      }
    },
    // watch modification of the map center and re center it
    'mapConfig.center.lat'() {
      if (this.map) {
        this.reCenterMap();
      }
    },
    'mapConfig.center.lng'() {
      if (this.map) {
        this.reCenterMap();
      }
    },
    // watch if a restaurant is added
    allRestaurants() {
      // if (this.map && !this.pageLoad) {
      //   this.initMarkers();
      //   this.handleMapIdle();
      // }
    },
  },
  mounted() {
    // MAP INIT
    GoogleMapsApiLoader({
      libraries: ['places'],
      apiKey: this.apiKey,
    }).then(googleMapApi => {
      this.google = googleMapApi;
      this.initializeMap();
      // wait until the map is ready to initialise the markers
      this.google.maps.event.addListenerOnce(this.map, 'idle', () => {
        this.places = new this.google.maps.places.PlacesService(this.map);
        this.places.nearbySearch(
          {
            location: this.mapConfig.center,
            rankBy: this.google.maps.places.RankBy.DISTANCE,
            type: 'restaurant',
          },
          (res, status) => {
            if (status === this.google.maps.places.PlacesServiceStatus.OK) {
              this.$store.commit('restoMap/setRestoList', res);
              this.$emit('restoImported');
              this.initMarkers();
            }
          }
        );
        // send google, map and place service object to parent
        this.$emit('googleMap', {
          google: this.google,
          map: this.map,
          places: this.places,
        });
      });

      // EVENT LISTENER
      // add event listener (when the map is still)
      this.google.maps.event.addListener(this.map, 'idle', this.handleMapIdle);
    });

    //  GEOLOC
    // Try HTML geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.mapConfig.center.lat = position.coords.latitude;
          this.mapConfig.center.lng = position.coords.longitude;
        },
        () => {
          // denied geoloc
          this.handleLocationError(true);
        }
      );
    } else {
      // browser don't support geoloc
      this.handleLocationError(false);
    }

    this.pageLoad = false;
  },

  beforeDestroy() {
    this.$store.commit('restoMap/resetAll');
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
      // create a marker in the center position
      // eslint-disable-next-line no-new
      new this.google.maps.Marker({
        map: this.map,
        id: 'you_here',
        position: this.mapConfig.center,
        icon: require('@/assets/img/here.png'),
      });
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
      // if (!this.restoList.length > 0) {
      //   this.allRestaurants.forEach(resto => {
      // const markerOptions = {
      //   id: resto.id,
      //   position: {
      //     lat: resto.geometry.location.lat(),
      //     lng: resto.geometry.location.lng(),
      //   },
      //   icon: this.restoIcon,
      //   animation: this.google.maps.Animation.DROP,
      //   bouncing: false,
      // };
      // put all resto markers into an array
      // this.$store.commit('restoMap/addMarker', {
      //   markerOptions: markerOptions,
      //   markerList: 'allMarkersList',
      // });
      // });
      // }
      // build an empty markers cluster
      this.markerCluster = new MarkerClusterer(this.map, [], {
        maxZoom: 12,
        clusterClass: 'custom-clustericon',
        styles: [
          {
            width: 30,
            height: 30,
          },
        ],
      });
    },

    handleMapIdle() {
      // reset the markerDisplayed array
      this.$store.commit('restoMap/resetMarkers');
      // get the map bounds
      const mapBounds = this.map.getBounds();

      this.restoList.forEach(resto => {
        // create a latLng object of the resto coord
        const latLng = new this.google.maps.LatLng({
          lat: resto.geometry.location.lat(),
          lng: resto.geometry.location.lng(),
        });
        const markerOptions = {
          id: resto.id,
          position: latLng,
          icon: this.restoIcon,
          animation: this.google.maps.Animation.DROP,
          bouncing: false,
        };
        // check if the restaurant is in the map bounds if true add it to the displayed markers array
        if (mapBounds.contains(latLng)) {
          this.$store.commit('restoMap/addMarker', {
            markerOptions: markerOptions,
            markerList: 'markersDisplayed',
          });
        }
      });
      // remove the markers that are not needed
      this.trimMarkers();
      // build the markers
      this.buildMarkers();
    },

    trimMarkers() {
      // find the markers alredy rendered
      const alreadyRendered = this.markersDisplayed.filter(marker => {
        return this.markers.some(mark => {
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
          // remove unecessary marker from the cluster
          this.markerCluster.removeMarker(this.markers[i]);
          // remove unecessary marker form the map
          this.markers[i].setMap(null);
          // delete marker from the marker array
          this.markers.splice(i, 1);
          // decrement i to not jump one element after the splice
          i--;
        }
      }
    },

    buildMarkers() {
      // find the markers that need to be rendered
      const markerToRender = this.markersDisplayed.filter(marker => {
        return !this.markers.some(mark => {
          return marker.id === mark.id;
        });
      });

      // build the needed markers
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

          // if was open before and a resto selected make it bounce if needed
          if (marker.id === this.selectedRestaurant) {
            marker.setAnimation(this.google.maps.Animation.BOUNCE);
          }
          // push the new marker in the array
          this.markers.push(marker);
          if (this.markerCluster) {
            // put the marker into the marker cluster
            this.markerCluster.addMarker(marker);
          }
        }, i * 100);
      });
      // emit the markers array to be accesible by the parents components
      this.$emit('markers', this.markers);
    },
  },
};
</script>

<style>
/* can't be scoped because of the marker cluster styling */

.custom-clustericon {
  background: #ff2e63;
  color: #fff;
  border-radius: 100%;
  font-weight: bold;
  font-size: 15px;
  display: flex;
  align-items: center;
  box-shadow: 0px 0px 0px 5px rgba(255, 46, 99, 0.6),
    0px 0px 0px 10px rgba(255, 46, 99, 0.4);
}
</style>
