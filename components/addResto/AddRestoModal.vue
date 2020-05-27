<template>
  <b-modal
    id="addRestoModal"
    @ok="handleSubmit"
    @show="resetModal"
    @hidden="resetModal"
    :oncontextmenu="show ? 'return true;' : 'return false;'"
    class="colorTransition"
    centered
  >
    <template v-slot:modal-title>
      <h3 class="modalTitle colorTransition">Add a Restaurant</h3>
    </template>
    <!-- form -->
    <b-form
      ref="addRestoForm"
      @submit.stop.prevent="handleSubmit"
      class="d-block"
    >
      <b-form-group
        :state="nameState"
        label="Name"
        label-for="name-input"
        invalid-feedback="Name is required"
      >
        <b-form-input
          id="name-input"
          v-model="name"
          :state="nameState"
          class="textInput colorTransition"
          required
        ></b-form-input>
      </b-form-group>
    </b-form>
    <!-- footer -->
    <template v-slot:modal-footer="{ ok, cancel }">
      <button @click="cancel()" class="cancelBtn outlineBtn">Cancel</button>
      <button @click="ok()" class="okBtn outlineBtn">Ok</button>
    </template>
  </b-modal>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      nameState: null,
      show: false,
    };
  },
  mounted() {
    // prevent the context menu to show on right click on the map
    // when the modal is shown enable the right click on the modal
    this.$root.$on('bv::modal::shown', () => {
      this.show = true;
    });
    // when th modal hide disable the right click on it
    this.$root.$on('bv::modal::hide', () => {
      this.show = false;
    });
  },
  methods: {
    // reset the modal
    resetModal() {
      this.name = '';
      this.nameState = null;
    },
    checkFormValidity() {
      const valid = this.$refs.addRestoForm.checkValidity();
      this.nameState = valid;
      return valid;
    },
    handleSubmit(bvModalEvt) {
      // prevent modal from closing
      bvModalEvt.preventDefault();
      // exit when the form isn't valid
      if (!this.checkFormValidity()) {
        return;
      }
      // emit an event with the comment to add
      this.$emit('addingResto', {
        name: this.name,
      });
      // hide the modal
      this.$nextTick(() => {
        this.$bvModal.hide('addRestoModal');
      });
    },
  },
};
</script>

<style scoped></style>
