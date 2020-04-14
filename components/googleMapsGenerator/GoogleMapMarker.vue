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
      map: this.map,
      position: this.marker.position,
      icon: this.marker.icon,
    })
  },
}
</script>

<style scoped></style>
