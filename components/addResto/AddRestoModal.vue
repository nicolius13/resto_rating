<template>
  <b-modal
    id="addRestoModal"
    @ok="handleOk"
    @show="resetModal"
    @hidden="resetModal"
    centered
  >
    <template v-slot:modal-title>
      <h3 class="modalTitle">Add a Restaurant</h3>
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
          class="textInput"
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
    };
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
    handleOk(bvModalEvt) {
      // prevent modal from closing
      bvModalEvt.preventDefault();
      // trigger submit handler
      this.handleSubmit();
    },
    handleSubmit() {
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
