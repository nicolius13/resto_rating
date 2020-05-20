<template>
  <b-modal
    :id="'modal-' + restoId"
    @ok="handleOk"
    @show="resetModal"
    @hidden="resetModal"
    class="colorTransition"
    centered
  >
    <!-- title -->
    <template v-slot:modal-title>
      <h3 class="modalTitle colorTransition">Add a comment</h3>
    </template>
    <!-- form -->
    <b-form @submit.stop.prevent="handleSubmit" class="d-block">
      <b-form-group label="Rating" label-for="rating-input">
        <StarPicker id="rating-input" @starPick="rating = $event" />
      </b-form-group>
      <b-form-group label="Comment" label-for="comment-input">
        <b-form-textarea
          id="comment-input"
          v-model="text"
          class="textInput"
        ></b-form-textarea>
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
import StarPicker from '../UI/StarsPick';

export default {
  components: {
    StarPicker,
  },
  props: {
    restoId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      rating: 0,
      text: '',
    };
  },
  methods: {
    // reset the modal
    resetModal() {
      this.rating = 0;
      this.text = '';
    },
    handleOk(bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault();
      // check if the review have a rating =/= 0 and a text
      if (this.rating === 0 && this.text === '') {
        this.$bvModal
          .msgBoxConfirm(
            'Are you sure you want to add a review with a rating of 0 and no comment ?',
            {
              id: 'confirmModal',
              title: 'Please Confirm',
              size: 'md',
              buttonSize: 'sm',
              centered: true,
              okTitle: 'YES',
              cancelTitle: 'NO',
            }
          )
          .then(value => {
            if (value === true) {
              // Trigger submit handler
              this.handleSubmit();
            }
          });
      }
    },
    handleSubmit() {
      // emit an event with the comment to add
      this.$emit('addingComment', {
        rating: this.rating,
        text: this.text,
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
#confirmModal .modal-body {
  text-align: center;
}
</style>
