<template>
  <b-modal
    :id="'modal-' + restoId"
    @ok="handleOk"
    @show="resetModal"
    @hidden="resetModal"
    centered
  >
    <template v-slot:modal-title>
      <h3 class="modalTitle">Add a comment</h3>
    </template>
    <b-form @submit.stop.prevent="handleSubmit" class="d-block">
      <b-form-group label="Rating" label-for="rating-input">
        <StarPicker id="rating-input" @starPick="rating = $event" />
      </b-form-group>
      <b-form-group label="Comment" label-for="comment-input">
        <b-form-textarea id="comment-input" v-model="comment"></b-form-textarea>
      </b-form-group>
    </b-form>
    <template v-slot:modal-footer="{ ok, cancel }">
      <button @click="cancel()" class="cancelBtn outlineBtn">Cancel</button>
      <button @click="ok()" class="okBtn outlineBtn">Ok</button>
    </template>
  </b-modal>
</template>

<script>
import StarPicker from '../UI/StarsPick';

export default {
  components: {
    StarPicker,
  },
  props: {
    restoId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      rating: 0,
      comment: '',
    };
  },
  methods: {
    // reset the modal
    resetModal() {
      this.rating = 0;
      this.comment = '';
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // Trigger submit handler
      this.handleSubmit();
    },
    handleSubmit() {
      // emit an event with the comment to add
      this.$emit('addingComment', {
        stars: this.rating,
        comment: this.comment,
      });
      // Hide the modal
      this.$nextTick(() => {
        this.$bvModal.hide('modal-' + this.restoId);
      });
    },
  },
};
</script>

<style>
/* not scoped for the general modal style */
.modal-header {
  border-bottom: 1px solid #292929;
}
.modal-footer {
  border-top: none;
}
.modal-content {
  background-color: #1d1d1d;
  color: #fff;
}

.close {
  color: #ff2e63;
  text-shadow: none;
  opacity: 1;
}
.close:hover {
  color: #ff2e63;
}
</style>

<style scoped>
/* scoped for the inside of the modal */

.modalTitle {
  color: #ff2e63;
}

#comment-input {
  background-color: #292929;
  border: 1px solid #000;
  color: #fff;
}
#comment-input:focus {
  box-shadow: 0 0 0 0.2rem rgba(8, 217, 214, 0.15);
}

/* Buttons */

.cancelBtn {
  color: #838383;
  border: 1px solid #838383;
}
.cancelBtn:hover {
  background-color: #292929;
  color: #fff;
}

.okBtn {
  color: #ff2e63;
  border: 1px solid #ff2e63;
}
.okBtn:hover {
  background-color: #ff2e63;
  color: #fff;
}
</style>
