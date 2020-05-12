<template>
  <div id="google-map" ref="googleMap">
    <FailModal :geolocError="geolocError" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import MarkerClusterer from '@google/markerclustererplus';
import GoogleMapsApiLoader from 'google-maps-api-loader';

// map settings
import mapSettings from '@/assets/mapSettings/mapSettings.json';

import FailModal from '../UI/FailModal';

export default {
  components: {
    FailModal,
  },
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
        lat: 17.395192,
        lng: 104.804329,
      },
      restoIcon: require('@/assets/img/mapIcons/resto-icon.png'),
      geolocError: {},
    };
  },
  computed: {
    mapConfig() {
      if (this.light) {
        return {
          ...this.mapSettings.light,
          center: this.mapCenter,
        };
      } else {
        return {
          ...this.mapSettings.dark,
          center: this.mapCenter,
        };
      }
    },
    ...mapState({
      restoList: state => state.restoMap.filteredList,
      markersDisplayed: state => state.restoMap.markersDisplayed,
      selectedRestaurant: state => state.restoMap.selectedRestaurant,
      AddedRestaurants: state => state.restoMap.AddedRestaurants,
      filteringFinished: state => state.restoMap.filteringFinished,
      autoComplLocation: state => state.restoMap.autoComplLocation,
      light: state => state.restoMap.light,
    }),
  },
  watch: {
    // watch if a restaurant is added
    AddedRestaurants() {
      this.handleMapIdle();
    },
    filteringFinished() {
      if (this.filteringFinished && this.map) {
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
  },
  mounted() {
    // MAP INIT
    GoogleMapsApiLoader({
      libraries: ['places'],
      apiKey: this.apiKey,
    }).then(googleMapApi => {
      this.google = googleMapApi;
      this.initializeMap();
    });
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
      // wait until the map is ready to initialise the place service
      this.google.maps.event.addListenerOnce(this.map, 'idle', () => {
        this.places = new this.google.maps.places.PlacesService(this.map);
        // send google, map and place service object to parent
        this.$emit('googleMap', {
          google: this.google,
          map: this.map,
          places: this.places,
        });
        this.handleGeoloc();
      });

      // Event listener
      // create the 'search this area' btn when the user finish to drag the map
      this.google.maps.event.addListenerOnce(this.map, 'dragend', () => {
        const searchThisAreaDiv = document.createElement('div');
        const mapControl = new this.MapControl(searchThisAreaDiv, this);
        mapControl.index = 1;
        this.map.controls[this.google.maps.ControlPosition.TOP_CENTER].push(
          searchThisAreaDiv
        );
      });

      this.google.maps.event.addListener(this.map, 'dragend', () => {
        const searchAreaControl = document.getElementById('searchAreaControl');
        searchAreaControl.style.display = 'flex';
      });

      // wait that the map is loaded
      this.google.maps.event.addListenerOnce(this.map, 'tilesloaded', () => {
        // add event listener (when the map is still)
        this.google.maps.event.addListener(this.map, 'idle', () => {
          this.handleMapIdle();
        });
      });
    },

    // MAP CONTROL constructor
    MapControl(controlDiv, vue) {
      // Set CSS for the control border.
      const controlUI = document.createElement('div');
      controlUI.id = 'searchAreaControl';
      controlUI.style.display = 'flex';
      controlUI.style.alignItems = 'center';
      controlUI.style.padding = '0 17px';
      controlUI.style.backgroundColor = '#fff';
      controlUI.style.borderRadius = '0.25rem';
      controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
      controlUI.style.cursor = 'pointer';
      controlUI.style.margin = '10px';
      controlUI.style.textAlign = 'center';
      controlUI.title = 'Click to Search this area';
      controlDiv.appendChild(controlUI);

      // Set CSS for the control interior.
      // icon
      const controlIcon = document.createElement('div');
      const icon = require('@/assets/img/mapIcons/search.png');
      controlIcon.style.backgroundImage = `url(${icon})`;
      controlIcon.style.backgroundSize = '18px 18px';
      controlIcon.style.width = '18px';
      controlIcon.style.height = '18px';
      controlUI.appendChild(controlIcon);

      // text
      const controlText = document.createElement('div');
      controlText.style.color = 'rgb(86, 86, 86)';
      controlText.style.fontSize = '16px';
      controlText.style.lineHeight = '40px';
      controlText.style.paddingLeft = '5px';
      controlText.style.paddingRight = '5px';
      controlText.innerHTML = 'Search this area';
      controlUI.appendChild(controlText);

      // Hover events
      controlUI.addEventListener('mouseenter', () => {
        controlText.style.color = 'rgb(0, 0, 0)';
      });
      controlUI.addEventListener('mouseleave', () => {
        controlText.style.color = 'rgb(86, 86, 86)';
      });

      // Click event
      controlUI.addEventListener('click', () => {
        vue.$store.commit('restoMap/resetAll');
        vue.searchPlace(vue.map.getCenter(), true);
        controlUI.style.display = 'none';
      });
    },

    // GEOLOC
    handleGeoloc() {
      // if there is no autocomplete done (in the landing page) ask for the geoloc
      if (!this.autoComplLocation) {
        //  GEOLOC
        // Try HTML geolocation
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            position => {
              this.mapCenter.lat = position.coords.latitude;
              this.mapCenter.lng = position.coords.longitude;
              // search the area given by the geoloc
              this.searchPlace();
            },
            () => {
              // denied geoloc
              this.handleLocationError(true);
              // search the area given by me :)
              this.searchPlace();
            }
          );
        } else {
          // browser don't support geoloc
          this.handleLocationError(false);
          // search the area given by me :)
          this.searchPlace();
        }
      } else {
        this.mapCenter.lat = this.autoComplLocation.lat;
        this.mapCenter.lng = this.autoComplLocation.lng;
        // search the area given by autocomplete
        this.searchPlace();
      }
    },
    // open a modal if the geoloc is refuse or not supported
    handleLocationError(browserHasGeoloc) {
      if (browserHasGeoloc) {
        this.geolocError = {
          title: 'Geolocation fail',
          error: 'The Geolocation service failed.',
        };
        this.$bvModal.show('geolocFailModal');
      } else {
        this.geolocError = {
          title: 'Geolocation fail',
          error: "Your browser doesn't support geolocation.",
        };
        this.$bvModal.show('geolocFailModal');
      }
    },
    searchPlace(center = this.mapCenter, needHandleMarker = false) {
      this.places.nearbySearch(
        {
          location: center,
          rankBy: this.google.maps.places.RankBy.DISTANCE,
          type: 'restaurant',
        },
        (res, status) => {
          if (status === this.google.maps.places.PlacesServiceStatus.OK) {
            this.$store.commit('restoMap/setRestoList', res);
            this.$emit('restoImported');
            this.initMarkers();
            // handle Markers only if needed (when search this zone btn is clicked)
            if (needHandleMarker) {
              this.handleMapIdle();
            }
          }
        }
      );
    },

    reCenterMap() {
      this.map.setCenter(this.mapConfig.center);
      // create a marker in the center position
      const center = new this.google.maps.Marker({
        map: this.map,
        id: 'you_here',
        position: this.mapConfig.center,
        icon: require('@/assets/img/mapIcons/here.png'),
      });
      // recenter and zoom if clicked
      center.addListener('click', () => {
        this.map.setCenter(this.mapCenter);
        this.map.setZoom(17);
      });
    },

    // ////////////////////////
    //          MARKERS
    // ///////////////////////

    initMarkers() {
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
