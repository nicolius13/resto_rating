<template>
  <div>
    <b-container>
      <b-row class="flex-nowrap no-gutters pt-5">
        <b-col cols="1" sm="2" class="text-right">
          <img class="logo" src="@/assets/img/logo.png" alt="logo" />
        </b-col>
        <b-col cols="8" class="titleCol d-flex">
          <h1 class="hero_title">Your Restaurant finder</h1>
        </b-col>
        <b-col class="d-none d-sm-block"></b-col>
      </b-row>
      <b-row class="flex-nowrap">
        <b-col cols="1" sm="2"></b-col>
        <b-col cols="8" class="titleCol d-flex">
          <p class="hero_text">
            Our mision is simple : helping you to find the perfect restaurant at
            the right place
          </p>
        </b-col>
        <b-col class="d-none d-sm-block"></b-col>
      </b-row>
    </b-container>
    <b-container fluid class="map_section">
      <b-row>
        <b-img :src="waveImg" fluid-grow alt="" />
      </b-row>
      <b-container class="map_content">
        <b-row>
          <b-col>
            <h3 class="slog text-center">
              Find the best restaurants<br />
              anywhere you are, whenever you want !
            </h3>
          </b-col>
        </b-row>
        <b-row class="cities text-center mx-auto">
          <b-col>
            <a @click="toMap({ lat: 17.971235, lng: 102.615405 })">Vientiane</a>
          </b-col>
          <b-col>
            <a @click="toMap({ lat: 13.753139, lng: 100.499931 })">Bangkok</a>
          </b-col>
          <b-col>
            <a @click="toMap({ lat: 48.8573, lng: 2.349363 })">Paris</a>
          </b-col>
          <b-col>
            <a @click="toMap({ lat: 43.604675, lng: 3.879026 })">Montpellier</a>
          </b-col>
          <b-col>
            <a @click="toMap({ lat: 50.82699, lng: 4.34449 })">Brussels </a>
          </b-col>
          <b-col>
            <a @click="toMap({ lat: 52.516933, lng: 13.38456 })">Berlin</a>
          </b-col>
          <b-col>
            <a @click="toMap({ lat: 52.37776, lng: 4.88335 })">Amsterdam</a>
          </b-col>
          <b-col>
            <a @click="toMap({ lat: 51.50716, lng: -0.127715 })">London</a>
          </b-col>
          <b-col>
            <a @click="toMap({ lat: 33.750485, lng: -84.389364 })">Atlanta</a>
          </b-col>
          <b-col>
            <a @click="toMap({ lat: 45.516096, lng: -73.682442 })">Montreal</a>
          </b-col>
        </b-row>

        <b-row class="cities mx-auto">
          <b-col class="text-right">
            <p class="blue">Even:</p>
          </b-col>
          <b-col class="text-left">
            <a @click="toMap({ lat: 17.395094, lng: 104.804415 })">Thakhek</a>
          </b-col>
          <b-col class="text-right">
            <p class="blue">Or:</p>
          </b-col>
          <b-col class="text-left">
            <a @click="toMap({ lat: 46.644531, lng: 1.560187 })">Tendu</a>
          </b-col>
        </b-row>
      </b-container>
    </b-container>
  </div>
</template>

<script>
export default {
  layout: 'about',
  transition: 'page',
  computed: {
    waveImg() {
      return this.$store.state.restoMap.light
        ? require('@/assets/img/backgrounds/waveB.png')
        : require('@/assets/img/backgrounds/wave.png');
    },
  },
  methods: {
    toMap(location) {
      this.$store.commit('restoMap/setAutoComplLocation', location);
      // go to 'resto map' page
      this.$router.push({
        path: '/map',
      });
    },
  },
};
</script>

<style scoped lang="postcss">
.hero_title {
  text-transform: uppercase;
  text-align: left;
  font-weight: 600;
  font-size: rfs(6rem);
}

.titleCol {
  margin-left: 2rem;
}

.logo {
  max-width: rfs(100px);
  margin-top: 10px;
}

.hero_text {
  font-size: rfs(1.7rem);
  text-align: left;
  max-width: 330px;
}

@media only screen and (max-width: 550px) {
  .hero_title {
    font-size: rfs(5rem);
  }

  .hero_text {
    font-size: rfs(1.1rem);
  }
}

/* MAP SECTION */

.map_section {
  background: url('../assets/img/backgrounds/world.svg');
  background-position: top center;
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-color: #a74554;
  margin-top: 0;
}
.light .map_section {
  color: #fff;
}
@media only screen and (min-width: 1200px) {
  .map_section {
    margin-top: -250px;
  }
}

.map_content {
  padding-top: rfs(4rem);
  padding-bottom: rfs(5rem);
  font-weight: 600;
}

.slog {
  font-weight: 600;
  font-size: rfs(3.5rem);
  margin-bottom: rfs(5rem);
}

.cities {
  max-width: 720px;
}
.cities .col {
  margin-bottom: rfs(2rem);
}
.cities a {
  font-size: rfs(1.2rem);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
.cities a:hover {
  color: #08d9d6;
  transition: all 0.2s ease-in-out;
}
.light .cities a:hover {
  color: #ff8811;
}

.blue {
  color: #08d9d6;
  font-size: rfs(1.3rem);
}
.light .blue {
  color: #ff8811;
}
</style>
