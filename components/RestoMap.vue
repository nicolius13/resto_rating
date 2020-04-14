<template>
  <GoogleMapLoader :map-config="mapConfig" :api-key="apiKey">
    <template slot-scope="{ google, map }">
      <GoogleMapMarker
        v-for="marker in markers"
        :key="marker.id"
        :marker="marker"
        :google="google"
        :map="map"
      />
    </template>
  </GoogleMapLoader>
</template>

<script>
import GoogleMapLoader from '../components/googleMapsGenerator/GoogleMapLoader'
import GoogleMapMarker from '../components/googleMapsGenerator/GoogleMapMarker'

// map settings
import mapSettings from '../assets/mapSettings/mapSettings.json'

export default {
  components: {
    GoogleMapLoader,
    GoogleMapMarker,
  },
  // get the restaurants list from the parent
  props: {
    restoList: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      // apiKey: process.env.GOOGLE_MAPS_API_KEY,
      mapSettings: mapSettings,
      markers: [],
      mapCenter: {
        lat: 17.984052,
        lng: 102.539655,
      },
      restoIcon: require('../assets/img/resto-icon.png'),
    }
  },
  computed: {
    mapConfig() {
      return {
        ...this.mapSettings,
        center: this.mapCenter,
      }
    },
  },
  mounted() {
    // Try HTML geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.mapConfig.center.lat = position.coords.latitude
          this.mapConfig.center.lng = position.coords.longitude
        },
        () => {
          this.handleLocationError(true)
        }
      )
    } else {
      this.handleLocationError(false)
    }
    // get the restos list from the JSON file
    this.getMarkers()
  },
  methods: {
    // throw an alert if the geoloc is refuse or not supported
    handleLocationError(browserHasGeoloc) {
      alert(
        browserHasGeoloc
          ? 'Error: The Geolocation service failed.'
          : "Error: Your browser doesn't support geolocation."
      )
    },
    getMarkers() {
      this.restoList.forEach((resto, index) => {
        this.markers.push({
          id: index,
          position: { lat: resto.lat, lng: resto.lng },
          icon: this.restoIcon,
        })
      })
    },
  },
}
</script>

<style scoped></style>
