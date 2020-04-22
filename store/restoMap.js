import restos from '../restoList.json';

export const state = () => ({
  restoList: restos,
  filteredList: [],
  ratingAverage: [],
  allMarkersList: [],
  markersDisplayed: [],
});

export const mutations = {
  addRattingAverage(state, rating) {
    state.ratingAverage.push({
      restoId: rating.id,
      average: rating.averages,
    });
  },
  filteringList(state, filteredAverages) {
    // filter the restaurant list with the resto id put in the filteredAverages array
    state.filteredList = state.restoList.filter(resto => {
      return filteredAverages.includes(resto.id);
    });
  },

  // MARKER
  addMarker(state, marker) {
    state[marker.markerList].push(marker.markerOptions);
  },
  resetMarkers(state) {
    state.markersDisplayed = [];
  },
  toggleBounce(state, { i, bounce }) {
    if (bounce) {
      state.markersDisplayed[i].bouncing = !state.markersDisplayed[i].bouncing;
    } else {
      state.markersDisplayed[i].bouncing = bounce;
    }
  },
};
