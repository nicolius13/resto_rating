<template>
  <div class="landing">
    <div class="searchWrapper">
      <h1>Find Restaurant</h1>
      <div class="search">
        <input ref="autoInput" type="text" />
        <nuxt-link class="okBtn outlineBtn mainBtn" to="/map">GO</nuxt-link>
      </div>
    </div>
  </div>
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
        const place = this.autocomplete.getPlace();
        this.$store.commit(
          'restoMap/setAutoComplLocation',
          place.geometry.location
        );
        // create a NEW unique id for the autocomplete session and change it
        this.sessionToken = uuidV4();
        this.autocomplete.setOptions({ sessionToken: this.sessionToken });
      });
    });
  },
};
</script>

<style>
body {
  min-height: 100vh;
  margin: 0;
  background-color: #1d1d1d;
  color: #fff;
  font-family: 'Montserrat', sans-serif;
}
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
h1 {
  color: #08d9d6;
  font-size: 45px;
  text-align: center;
}

.searchWrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  width: 100%;
  min-height: 40%;
}
</style>

<style scoped>
.pac-target-input {
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  border-radius: 0.25rem;
}
.pac-target-input:focus {
  box-shadow: 0 0 0 0.2rem rgba(8, 217, 214, 0.5);
}

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

/* PlaceHolder */

.search {
  display: flex;
  justify-content: center;
}
.searchBar {
  background-color: #fff;
  width: 300px;
  height: 30px;
}
.searchBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background-color: #ff2e63;
  height: 30px;
  width: 50px;
}
</style>
