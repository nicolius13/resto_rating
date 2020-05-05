// import restos from '../restoList.json';

export const state = () => ({
  restoList: [],
  AddedRestaurants: [],
  filteredList: [],
  ratingAverage: [],
  markersDisplayed: [],
  selectedRestaurant: null,
});

export const mutations = {
  resetAll(state) {
    state.restoList = [];
    state.filteredList = [];
    state.ratingAverage = [];
    state.markersDisplayed = [];
  },

  setRestoList(state, list) {
    list.forEach(resto => {
      // add reviews and haveDetails keys
      if (resto.user_ratings_total) {
        state.restoList.push({
          ...resto,
          reviews: [],
          haveDetails: false,
        });
        // add user_ratings_total and rating keys if doesn't exist
      } else {
        state.restoList.push({
          ...resto,
          reviews: [],
          haveDetails: false,
          user_ratings_total: 0,
          rating: 0,
        });
      }
    });
    // add the added restaurant if needed
    if (state.AddedRestaurants) {
      state.AddedRestaurants.forEach(resto => {
        state.restoList.push(resto);
      });
    }
  },

  setRatingAverage(state, ratingAverage) {
    state.ratingAverage = ratingAverage;
  },
  addRatingAverage(state, rating) {
    state.ratingAverage.push({
      restoId: rating.id,
      average: rating.averages,
    });
  },

  // set an unfiltered list if no filtering is done (add resto page)
  setFilteredListToAllResto(state) {
    state.filteredList = state.restoList;
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
  setReviews(state, reviews) {
    state.restoList.find(resto => {
      if (resto.id === reviews.id) {
        resto.reviews = reviews.reviews;
        resto.haveDetails = true;
        return true;
      }
    });
  },
  addComment(state, comment) {
    state.restoList.find(resto => {
      if (resto.id === comment.id) {
        resto.reviews.push(comment.comment);
        // add 1 to the total reviews number
        resto.user_ratings_total++;
        // recalculate the average rating
        resto.rating =
          resto.rating +
          (comment.comment.rating - resto.rating) / resto.user_ratings_total;

        return true;
      }
    });
  },

  // ADD RESTAURANT
  addRestaurant(state, resto) {
    state.restoList.push(resto);
    state.AddedRestaurants.push(resto);
  },
};
