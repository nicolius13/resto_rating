<template>
  <div>
    <b-container id="mapContainer" fluid>
      <b-row class="mapRow">
        <b-col cols="8" class="mapCol">
          <Map />
        </b-col>
        <b-col cols="4">
          This is a map page
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Map from '../components/Map'
export default {
  components: {
    Map,
  },
}
</script>

<style scoped>
#mapContainer,
.mapRow,
.mapCol {
  height: 100%;
}
#map {
  height: 100%;
}
</style>
