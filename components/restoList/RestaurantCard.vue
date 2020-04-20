<template>
  <b-card>
    <b-card-title v-b-toggle="'collapseInner-' + resto.id">{{
      resto.restaurantName
    }}</b-card-title>
    <b-card-text>
      {{ averageRating.toFixed(1) }}
      <span class="stars">
        <b-icon :icon="stars.average[0]"></b-icon>
        <b-icon :icon="stars.average[1]"></b-icon>
        <b-icon :icon="stars.average[2]"></b-icon>
        <b-icon :icon="stars.average[3]"></b-icon>
        <b-icon :icon="stars.average[4]"></b-icon>
      </span>
      <span class="ratingsNumber"> ({{ resto.ratings.length }}) </span>
    </b-card-text>
    <b-collapse :id="'collapseInner-' + resto.id" accordion="restoDetails">
      <b-img :src="img" fluid></b-img>
      <b-card-text>Reviews :</b-card-text>
      <div v-for="(review, index) in resto.ratings" :key="index">
        <b-card-text class="reviewsStars">
          <span class="stars">
            <b-icon :icon="stars.comments[index][0]"></b-icon>
            <b-icon :icon="stars.comments[index][1]"></b-icon>
            <b-icon :icon="stars.comments[index][2]"></b-icon>
            <b-icon :icon="stars.comments[index][3]"></b-icon>
            <b-icon :icon="stars.comments[index][4]"></b-icon>
          </span>
        </b-card-text>
        <b-card-text class="reviewsComment">{{ review.comment }}</b-card-text>
      </div>
    </b-collapse>
  </b-card>
</template>

<script>
import axios from 'axios';

export default {
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
      stars: {
        average: [],
        comments: [],
      },
      // placeholder
      img: require('@/assets/img/asian-d.jpg'),
    };
  },
  created() {
    // calculate the average rating
    this.ratingAverage();
    // stars for the  average rating
    this.stars.average = this.starRating(this.averageRating);
    // stars for the reviews
    this.resto.ratings.forEach((rating, index) => {
      this.stars.comments[index] = this.starRating(rating.stars);
    });
    // get street view img
    this.getImg();
  },
  methods: {
    // calculate the average rating
    ratingAverage() {
      let averages = 0;
      this.resto.ratings.forEach(rating => {
        averages += rating.stars;
      });
      averages = averages / this.resto.ratings.length;

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
          console.log(error);
        });
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
  font-size: 1rem;
  color: #08d9d6;
  margin: 0 0.2rem;
}
.ratingsNumber {
  font-size: 0.75rem;
  opacity: 0.4;
}

/* REVIEWS */

.reviewsStars {
  margin-bottom: 0.2rem;
}
.reviewsComment {
  margin-bottom: 0.8rem;
}
</style>
