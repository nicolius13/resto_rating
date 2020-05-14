<template>
  <div>
    <b-container id="mapContainer" fluid>
      <b-row class="mapRow">
        <b-col cols="12" md="8" class="mapCol">
          <Maps @googleMap="googleInit" @markers="markers = $event" />
        </b-col>
        <RestoList
          id="list"
          :places="places"
          class="colorTransition col-12 col-md-4 mapCol"
        />
      </b-row>
    </b-container>
    <transition name="fade">
      <button id="top" @click="backTopTop" v-show="toTop" href="#header">
        <b-icon-arrow-up font-scale="1.2"></b-icon-arrow-up>
      </button>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import Maps from '../components/maps/Maps';
import RestoList from '../components/restoList/RestoList';

export default {
  layout: 'maps',
  transition: 'page',
  components: {
    Maps,
    RestoList,
  },
  data() {
    return {
      google: null,
      map: null,
      places: null,
      markers: [],
      toTop: false,
    };
  },
  computed: {
    ...mapState({
      selectedRestaurant: state => state.restoMap.selectedRestaurant,
    }),
  },
  watch: {
    selectedRestaurant() {
      this.bounceMarker();
    },
    markers(newVal) {
      this.markers.forEach(marker => {
        this.google.maps.event.clearListeners(marker, 'click');

        // add click listener to make the resto card visible when clicked
        marker.addListener('click', () => {
          this.clickMarker(marker);
        });
      });
    },
  },
  mounted() {
    // add listener whe scroll to show/hide the toTop btn
    window.addEventListener('scroll', this.scrollHandler);
  },
  methods: {
    googleInit($event) {
      this.google = $event.google;
      this.map = $event.map;
      this.places = $event.places;
    },
    // change the selected restaurant
    clickMarker(marker) {
      this.$store.commit('restoMap/setSelectedRestaurant', marker.id);
      // scroll to the restaurant card
      const resto = document.getElementById('resto-' + marker.id);
      const list = document.getElementById('list');
      // scroll to the list if th escreen is smaller than 768px
      if (window.innerWidth <= 768) {
        list.scrollIntoView();
      }
      list.scrollTo(0, resto.offsetTop);
    },

    // make the marker bounce when it's selected in the list
    bounceMarker() {
      this.markers.forEach(marker => {
        if (marker.id === this.selectedRestaurant) {
          marker.setAnimation(this.google.maps.Animation.BOUNCE);
        } else {
          marker.setAnimation(null);
        }
      });
    },
    // Scroll btn
    // check if we scroll pass 400px and show the button
    scrollHandler() {
      if (window.pageYOffset > 400) {
        this.toTop = true;
      } else {
        this.toTop = false;
      }
    },
    // scroll to top
    backTopTop() {
      window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
    },
  },
};
</script>

<style scoped lang="postcss">
#list {
  overflow: auto;
  /* firefox 64 */
  scrollbar-width: thin;
  scrollbar-color: #ff2e63 #292929;
}
.light #list {
  scrollbar-color: #ff2e63 #eeeeee;
}
/* webkit */
#list::-webkit-scrollbar {
  width: 8px;
}
#list::-webkit-scrollbar-thumb {
  background: #ff2e63;
}
#list::-webkit-scrollbar-track {
  background: #292929;
}
.light #list::-webkit-scrollbar-track {
  background: #eeeeee;
}

/* TOP BTN */

#top {
  background: #ff2e63;
  color: #fff;
  border: none;
  border-radius: 0.25rem;
  margin: 0.2rem 0.4rem;
  padding: 0.4rem 0.8rem;
  position: fixed;
  right: 10px;
  bottom: 20px;
  z-index: 9999;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
