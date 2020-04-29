import restos from '../restoList.json';

export const state = () => ({
  restoList: restos,
  filteredList: [],
  ratingAverage: [],
  allMarkersList: [],
  markersDisplayed: [],
  selectedRestaurant: null,
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

  setSelectedRestaurant(state, resto) {
    state.selectedRestaurant = resto;
  },

  // MARKER
  addMarker(state, marker) {
    state[marker.markerList].push(marker.markerOptions);
  },
  resetMarkers(state) {
    state.markersDisplayed = [];
  },

  // ADD  COMMENT
  addComment(state, comment) {
    state.restoList.find(resto => {
      if (resto.id === comment.id) {
        resto.ratings.push(comment.comment);
        return true;
      }
    });
  },

  // ADD RESTAURANT
  addRestaurant(state, resto) {
    state.restoList.push(resto);
  },
};
