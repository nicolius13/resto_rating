<template>
  <b-card :id="'resto-' + resto.id">
    <b-card-title
      @click="bounceMarker"
      :class="selectedRestaurant === resto.id ? '' : 'collapsed'"
      :data-id="resto.id"
      >{{ resto.restaurantName }}</b-card-title
    >
    <b-card-text>
      {{ averageRating.toFixed(1) }}
      <span class="stars mainStar">
        <b-icon :icon="stars.average[0]"></b-icon>
        <b-icon :icon="stars.average[1]"></b-icon>
        <b-icon :icon="stars.average[2]"></b-icon>
        <b-icon :icon="stars.average[3]"></b-icon>
        <b-icon :icon="stars.average[4]"></b-icon>
      </span>
      <span class="ratingsNumber"> ({{ comments.length }}) </span>
    </b-card-text>
    <b-collapse
      :id="'collapseInner-' + resto.id"
      :visible="selectedRestaurant === resto.id"
      accordion="restoDetails"
    >
      <b-img :src="img" fluid></b-img>
      <b-card-text class="reviewTitle">Reviews :</b-card-text>
      <div
        v-for="(review, index) in commentList"
        :key="index"
        :class="index === commentList.length - 1 ? '' : 'separator'"
        class="reviewsComment"
      >
        <b-card-text class="reviewsStars">
          <span class="stars">
            <b-icon :icon="stars.comments[index][0]"></b-icon>
            <b-icon :icon="stars.comments[index][1]"></b-icon>
            <b-icon :icon="stars.comments[index][2]"></b-icon>
            <b-icon :icon="stars.comments[index][3]"></b-icon>
            <b-icon :icon="stars.comments[index][4]"></b-icon>
          </span>
        </b-card-text>
        <b-card-text>{{ review.comment }}</b-card-text>
      </div>
      <b-row class="justify-content-around">
        <button
          v-if="resto.ratings.length > 5 && commentLimit !== null"
          @click="commentLimit = null"
          class="outlineBtn addCommBtnBtn"
        >
          See All Comments
        </button>
        <button v-b-modal="'modal-' + resto.id" class="outlineBtn seeMoreBtn ">
          Add Comment
        </button>
      </b-row>
    </b-collapse>
    <AddCommentModal :restoId="resto.id" @addingComment="addComment" />
  </b-card>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';

import AddCommentModal from './AddCommentModal';

export default {
  components: {
    AddCommentModal,
  },
  props: {
    resto: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      // apiKey: process.env.GOOGLE_MAPS_API_KEY,
      averageRating: 5,
      comments: [...this.resto.ratings],
      commentLimit: 5,
      stars: {
        average: [],
        comments: [],
      },
      // placeholder
      img: require('@/assets/img/asian-d.jpg'),
    };
  },
  computed: {
    commentList() {
      return this.commentLimit
        ? this.comments.slice(0, this.commentLimit)
        : this.comments;
    },
    ...mapState({
      selectedRestaurant: state => state.restoMap.selectedRestaurant,
    }),
  },
  watch: {
    // reset the comment displayed each time the selected restaurant change
    selectedRestaurant() {
      this.commentLimit = 5;
    },
    // watch if a comment is added
    comments() {
      this.handleAverages();
    },
  },

  created() {
    this.handleAverages();
    // get street view img
    this.getImg();
  },
  methods: {
    handleAverages() {
      // calculate the average rating
      this.ratingAverage();
      // stars for the  average rating
      this.stars.average = this.starRating(this.averageRating);
      // stars for the reviews
      this.comments.forEach((rating, index) => {
        this.stars.comments[index] = this.starRating(rating.stars);
      });
    },
    // calculate the average rating
    ratingAverage() {
      let averages = 0;
      this.comments.forEach(rating => {
        averages += rating.stars;
      });
      averages = averages / this.comments.length;

      this.averageRating = averages;
    },
    // push the type of star in an array depending of the average rating
    starRating(rating) {
      const starsRating = [];
      const fullStar = Math.floor(rating);
      for (let i = 0; i < fullStar; i++) {
        starsRating.push('star-fill');
      }
      const halfStar = rating - fullStar;
      if (halfStar >= 0.5) {
        starsRating.push('star-half');
      } else if (halfStar < 0.5) {
        starsRating.push('star');
      }
      const emptyStar = 5 - (fullStar + 1);
      for (let i = 0; i < emptyStar; i++) {
        starsRating.push('star');
      }
      return starsRating;
    },
    getImg() {
      const lat = this.resto.lat;
      const lng = this.resto.lng;
      // check if the google street static img exist
      axios
        .get(
          `https://maps.googleapis.com/maps/api/streetview/metadata?size=600x400&location=${lat}${lng}&key=${this.apiKey}`
        )
        .then(response => {
          // if the img exist get the img
          if (response.data.status === 'OK') {
            axios
              .get(
                `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${lat}${lng}&key=${this.apiKey}`
              )
              .then(res => {
                this.img = res.config.url;
              });
          }
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.log(error);
        });
    },
    bounceMarker($event) {
      const markId = parseInt($event.target.getAttribute('data-id'));

      const isCollapsed = $event.target.classList.contains('collapsed');
      // check if the restaurant card is alredy open if not change the selected restaurant otherwise put null
      if (isCollapsed) {
        this.$store.commit('restoMap/setSelectedRestaurant', markId);
      } else {
        this.$store.commit('restoMap/setSelectedRestaurant', null);
      }
    },
    // put the new comment in the comments array
    addComment($event) {
      this.comments.push($event);
    },
  },
};
</script>

<style scoped>
.card {
  background-color: #292929;
  margin: 0.75rem 0;
}

.card-title {
  text-align: center;
  font-size: 1.25rem;
  text-decoration: underline;
  text-decoration-color: transparent;
  transition: all 0.3s ease-in-out;
  /* only firefox 70 and safari 12 */
  text-underline-offset: 5px;
}
.card-title:hover {
  text-decoration-color: #ff2e63;
  transition: all 0.3s ease-in-out;
}

.card-text {
  font-size: 0.75rem;
}

.stars {
  color: #08d9d6;
  margin: 0 0.2rem;
}
.mainStar {
  font-size: 1rem;
}
.ratingsNumber {
  font-size: 0.75rem;
  opacity: 0.4;
}

/* REVIEWS */
.reviewTitle {
  margin-top: 0.8rem;
  margin-bottom: 0;
  color: #ff2e63;
  font-size: 1rem;
}
.reviewsComment {
  padding-top: 0.8rem;
  padding-bottom: 0.8rem;
}
.separator {
  border-bottom: 1px solid #797979;
}
.reviewsStars {
  margin-bottom: 0.2rem;
}
.reviewsStars .stars {
  font-size: 0.8rem;
}
/* buttons */
.seeMoreBtn {
  font-size: 0.8rem;
  color: #08d9d6;
  border: 1px solid #08d9d6;
}
.seeMoreBtn:hover {
  background-color: #08d9d6;
  color: #000;
}

.addCommBtnBtn {
  font-size: 0.8rem;
  color: #ff2e63;
  border: 1px solid #ff2e63;
}
.addCommBtnBtn:hover {
  background-color: #ff2e63;
  color: #fff;
}
</style>
