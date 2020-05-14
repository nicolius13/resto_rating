<template>
  <b-container :style="{ '--bgImg': bgImg }" class="landing colorTransition">
    <b-row>
      <h1 class="findTitle colorTransition">Find Restaurants</h1>
    </b-row>
    <b-row class="searchBar justify-content-center">
      <b-input-group class="inputGroup colorTransition">
        <b-form-input
          id="autoInput"
          v-model="input"
          class="colorTransition"
          type="text"
          placeholder="Where do you want to eat ?"
        />
        <b-input-group-append>
          <b-button
            @click="getGeoloc"
            :class="geolocIcon"
            class="geoloc colorTransition"
          ></b-button>
        </b-input-group-append>
      </b-input-group>
      <button @click="handleGoBtn" class="okBtn outlineBtn mainBtn">
        GO
      </button>
    </b-row>
    <FailModal :geolocError="geolocError" />
  </b-container>
</template>

<script>
import GoogleMapsApiLoader from 'google-maps-api-loader';
import { v4 as uuidV4 } from 'uuid';

import FailModal from '../components/UI/FailModal';

export default {
  transition: 'page',
  components: {
    FailModal,
  },
  data() {
    return {
      apiKey: process.env.GOOGLE_MAPS_API_KEY,
      input: '',
      google: null,
      autocomplete: null,
      sessionToken: '',
      locationSelected: null,
      geocoder: null,
      geoloc: null,
      geolocError: { title: '', error: '' },
      backImgArray: [
        require('@/assets/img/backgrounds/asian-d.jpg'),
        require('@/assets/img/backgrounds/resto-d.jpg'),
        require('@/assets/img/backgrounds/table-d.jpg'),
      ],
      bgImg: '',
    };
  },
  computed: {
    geolocIcon() {
      return this.$store.state.restoMap.light ? 'light' : 'dark';
    },
  },
  created() {
    // choose the background img
    const randNum = Math.floor(Math.random() * this.backImgArray.length);
    this.bgImg = `url(${this.backImgArray[randNum]})`;
  },
  mounted() {
    // init the google object
    GoogleMapsApiLoader({
      libraries: ['places'],
      apiKey: this.apiKey,
    }).then(googleMapApi => {
      this.google = googleMapApi;
      this.handleAutocomplete();
      this.initGeocoding();
    });
  },
  methods: {
    // AUTOCOMPLETE
    handleAutocomplete() {
      const input = document.getElementById('autoInput');

      // create a unique id for the autocomplete session
      this.sessionToken = uuidV4();
      // create the autocomplete service object
      this.autocomplete = new this.google.maps.places.Autocomplete(input, {
        types: ['(cities)'],
        fields: ['geometry'],
        sessionToken: this.sessionToken,
      });
      this.autocomplete.addListener('place_changed', () => {
        // get the location and save it 'localy'
        const place = this.autocomplete.getPlace();
        this.locationSelected = {};
        this.locationSelected.lat = place.geometry.location.lat();
        this.locationSelected.lng = place.geometry.location.lng();

        // create a NEW unique id for the autocomplete session and change it
        this.sessionToken = uuidV4();
        this.autocomplete.setOptions({ sessionToken: this.sessionToken });
      });
    },

    // GO BTN
    handleGoBtn() {
      // if there is a selected location by AUTOCOMPLETE send it to the store
      if (this.locationSelected) {
        this.$store.commit(
          'restoMap/setAutoComplLocation',
          this.locationSelected
        );
        // esle if there is a selected location by GEOLOC send it to the store
      } else if (this.geoloc) {
        this.$store.commit('restoMap/setAutoComplLocation', this.geoloc);
      }
      // go to 'resto map' page
      this.$router.push({
        path: '/map',
      });
    },

    // GEOLOC BTN
    getGeoloc() {
      //  GEOLOC
      // Try HTML geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            this.geoloc = {};
            this.geoloc.lat = position.coords.latitude;
            this.geoloc.lng = position.coords.longitude;
            this.geocodeLatLng();
          },
          () => {
            // denied geoloc
            this.handleLocationError(true);
          }
        );
      } else {
        // browser don't support geoloc
        this.handleLocationError(false);
      }
    },
    // open a modal if the geoloc is refuse or not supported
    handleLocationError(browserHasGeoloc) {
      if (browserHasGeoloc) {
        this.geolocError = {
          title: 'Geolocation fail',
          error: 'The Geolocation service failed.',
        };
        this.$bvModal.show('geolocFailModal');
      } else {
        this.geolocError = {
          title: 'Geolocation fail',
          error: "Your browser doesn't support geolocation.",
        };
        this.$bvModal.show('geolocFailModal');
      }
    },
    // geocoding
    initGeocoding() {
      this.geocoder = new this.google.maps.Geocoder();
    },
    geocodeLatLng() {
      const latLng = {
        lat: this.geoloc.lat,
        lng: this.geoloc.lng,
      };
      // try to have the adress from the geoloc
      this.geocoder.geocode({ location: latLng }, (res, status) => {
        if (status === 'OK') {
          if (res[0]) {
            this.input = res[0].formatted_address;
          } else {
            this.geolocError = {
              title: 'Geocoder fail',
              error: 'No results found.',
            };
            this.$bvModal.show('geolocFailModal');
          }
        } else {
          this.geolocError = {
            title: 'Geocoder fail',
            error: 'Geocoder failed due to: ' + status,
          };
          this.$bvModal.show('geolocFailModal');
        }
      });
    },
  },
};
</script>

<style lang="postcss">
.landing {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.landing::after {
  content: '';
  background: var(--bgImg, url('../assets/img/backgrounds/asian-d.jpg'));
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
.light .landing::after {
  box-shadow: inset 0 0 10em 2em #e2e2e2;
}

/* autocomplete prediction */
.pac-icon {
  background: url('../assets/img/mapIcons/resto-icon.png');
  background-repeat: no-repeat;
  background-size: 15px;
}
</style>

<style scoped>
.findTitle {
  font-size: rfs(5rem);
  margin-bottom: 2rem;
}

.searchBar {
  width: 100%;
}

.inputGroup {
  width: 60%;
}
/* Autocomplete Input */
.form-control {
  color: #000;
}
#autoInput {
  display: flex;
  box-sizing: content-box;
  padding: 0.375rem 0.75rem;
  font-size: rfs(1rem);
  font-weight: 400;
  line-height: 1.5;
  border: none;
}
.light #autoInput {
  background-color: #e2e2e2;
  color: #1d1d1d;
}
#autoInput:focus {
  box-shadow: 0 0 0 0.2rem rgba(8, 217, 214, 0.5);
}

.light .form-control::placeholder {
  color: #5f5f5f;
}

/* Geoloc Btn */
.geoloc {
  width: 50px;
  border: none;
}
.geoloc.dark {
  background: url('../assets/img/geoloc.png'), #fff;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 30px;
}
.geoloc:focus {
  box-shadow: 0 0 0 0.2rem rgba(8, 217, 214, 0.5);
}
.geoloc.light {
  background: url('../assets/img/geoloc.png'), #e2e2e2;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 30px;
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
