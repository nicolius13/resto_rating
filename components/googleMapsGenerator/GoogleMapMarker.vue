<template>
  <div></div>
</template>

<script>
export default {
  props: {
    google: {
      type: Object,
      required: true,
    },
    map: {
      type: Object,
      required: true,
    },
    marker: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    // eslint-disable-next-line no-new
    new this.google.maps.Marker({
      position: this.marker.position,
      icon: this.marker.icon,
      marker: this.marker,
      map: this.map,
    })
  },
}
</script>

<style scoped></style>
