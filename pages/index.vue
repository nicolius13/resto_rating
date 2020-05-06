<template>
  <b-container class="landing">
    <b-row>
      <h1 class="findTitle">Find Restaurant</h1>
    </b-row>
    <b-row class="searchBar justify-content-center">
      <input ref="autoInput" type="text" />
      <button @click="handleGoBtn" class="okBtn outlineBtn mainBtn">
        GO
      </button>
    </b-row>
  </b-container>
</template>

<script>
import GoogleMapsApiLoader from 'google-maps-api-loader';
import { v4 as uuidV4 } from 'uuid';

export default {
  data() {
    return {
      apiKey: process.env.GOOGLE_MAPS_API_KEY,
      google: {},
      autocomplete: {},
      sessionToken: '',
      locationSelected: null,
    };
  },
  mounted() {
    GoogleMapsApiLoader({
      libraries: ['places'],
      apiKey: this.apiKey,
    }).then(googleMapApi => {
      const input = this.$refs.autoInput;
      this.google = googleMapApi;
      // create a unique id for the autocomplete session
      this.sessionToken = uuidV4();
      this.autocomplete = new this.google.maps.places.Autocomplete(input, {
        types: ['(cities)'],
        sessionToken: this.sessionToken,
      });
      this.autocomplete.setFields(['geometry']);
      this.autocomplete.addListener('place_changed', () => {
        // get the location and save it 'localy'
        const place = this.autocomplete.getPlace();
        this.locationSelected = place.geometry.location;

        // create a NEW unique id for the autocomplete session and change it
        this.sessionToken = uuidV4();
        this.autocomplete.setOptions({ sessionToken: this.sessionToken });
      });
    });
  },
  methods: {
    handleGoBtn() {
      // if there is a selected location send it to the store
      if (this.locationSelected) {
        this.$store.commit(
          'restoMap/setAutoComplLocation',
          this.locationSelected
        );
      }
      // go to 'resto map' page
      this.$router.push({
        path: '/map',
      });
    },
  },
};
</script>

<style>
.landing {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.landing::after {
  content: '';
  background: url('../assets/img/asian-d.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  box-shadow: inset 0 0 10em 2em #1d1d1d;
  opacity: 0.3;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: absolute;
  z-index: -1;
}

/* autocomplete prediction */
.pac-icon {
  background: url('../assets/img/resto-icon.png');
  background-repeat: no-repeat;
  background-size: 15px;
}
</style>

<style scoped>
.findTitle {
  margin-bottom: 2rem;
}

.searchBar {
  width: 100%;
}
/* autocomplete input */
.pac-target-input {
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  border-radius: 0.25rem;
  width: 60%;
}
.pac-target-input:focus {
  box-shadow: 0 0 0 0.2rem rgba(8, 217, 214, 0.5);
}

/* GO button */
.mainBtn {
  font-size: 1.2rem;
  font-weight: 600;
  border: 3px solid #ff2e63;
  margin: 0 0.4rem;
  line-height: 1.5;
}
.mainBtn:hover {
  text-decoration: none;
}
</style>
