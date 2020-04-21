<template>
  <div>
    <b-container id="mapContainer" fluid>
      <b-row class="mapRow">
        <b-col cols="8" class="mapCol">
          <RestoMap />
        </b-col>
        <RestoList class="col-4 mapCol list" />
      </b-row>
    </b-container>
  </div>
</template>

<script>
import RestoMap from '../components/maps/RestoMap';
import RestoList from '../components/restoList/RestoList';

export default {
  components: {
    RestoMap,
    RestoList,
  },
};
</script>

<style scoped>
#mapContainer,
.mapRow,
.mapCol {
  height: 100%;
}
.list {
  overflow: auto;
  /* firefox 64 */
  scrollbar-width: thin;
  scrollbar-color: #ff2e63 #292929;
}
/* webkit */
.list::-webkit-scrollbar {
  width: 8px;
}
.list::-webkit-scrollbar-thumb {
  background: #ff2e63;
}
.list::-webkit-scrollbar-track {
  background: #292929;
}
</style>
