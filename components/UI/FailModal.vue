<template>
  <b-modal id="geolocFailModal" centered>
    <template v-slot:modal-title>
      <h3 class="modalTitle">{{ geolocError.title }}</h3>
    </template>
    <p class="text-center">{{ geolocError.error }}</p>
    <template v-slot:modal-footer="{ ok }">
      <button @click="ok()" class="okBtn outlineBtn float-right">Ok</button>
    </template>
  </b-modal>
</template>

<script>
export default {
  props: {
    geolocError: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="postcss" scoped>
p {
  margin: 0;
}
</style>
<style lang="postcss">
#geolocFailModal .modal-footer {
  padding-top: 0;
}
</style>
