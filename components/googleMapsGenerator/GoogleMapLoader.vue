<template>
  <div class="mapContainer">
    <div ref="googleMap" class="google-map"></div>
    <template v-if="google && map">
      <slot :google="google" :map="map" />
    </template>
  </div>
</template>

<script>
import GoogleMapsApiLoader from 'google-maps-api-loader';

export default {
  props: {
    mapConfig: {
      type: Object,
      required: true,
    },
    apiKey: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      google: null,
      map: null,
    };
  },
  watch: {
    // watch modification of the map center and re center it
    'mapConfig.center.lat'() {
      this.reCenterMap();
    },
    'mapConfig.center.lng'() {
      this.reCenterMap();
    },
  },
  async mounted() {
    const googleMapApi = await GoogleMapsApiLoader({
      apiKey: this.apiKey,
    });
    this.google = googleMapApi;
    this.initializeMap();
  },
  methods: {
    initializeMap() {
      const mapContainer = this.$refs.googleMap;
      this.map = new this.google.maps.Map(mapContainer, this.mapConfig);
    },
    reCenterMap() {
      this.map.setCenter(this.mapConfig.center);
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
