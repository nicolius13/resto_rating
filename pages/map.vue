<template>
  <div>
    <b-container id="mapContainer" fluid>
      <b-row class="mapRow">
        <b-col cols="8" class="mapCol">
          <RestoMap :restoList="restoList" />
        </b-col>
        <b-col cols="4">
          This is a resto list
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
// import the list of restaurants
import restos from '../restoList.json'

import RestoMap from '../components/RestoMap'

export default {
  components: {
    RestoMap,
  },
  data() {
    return {
      restoList: restos,
    }
  },
}
</script>

<style scoped>
#mapContainer,
.mapRow,
.mapCol {
  height: 100%;
}
</style>
