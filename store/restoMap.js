// import restos from '../restoList.json';

export const state = () => ({
  restoList: [],
  addedRestaurants: [],
  filteredList: [],
  filteringFinished: false,
  ratingAverage: [],
  markersDisplayed: [],
  selectedRestaurant: null,
  autoComplLocation: null,
  light: false,
  searchResultHasPage: false,
  seeMoreCliked: false,
});

export const mutations = {
  // reset all the state that need to be reset
  resetAll(state) {
    state.restoList = [];
    state.filteredList = [];
    state.ratingAverage = [];
    state.markersDisplayed = [];
    state.filteringFinished = false;
    state.searchResultHasPage = false;
    state.seeMoreCliked = false;
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
        // add user_ratings_total and rating keys if it doesn't exist
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
    if (state.addedRestaurants) {
      state.addedRestaurants.forEach(resto => {
        state.restoList.push(resto);
      });
    }
  },

  // rating average
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
    state.filteringFinished = true;
  },
  filteringList(state, filteredAverages) {
    state.filteringFinished = false;

    // filter the restaurant list with the resto id put in the filteredAverages array
    state.filteredList = state.restoList.filter((resto, i) => {
      if (i === filteredAverages.length - 1) {
        state.filteringFinished = true;
      }
      return filteredAverages.includes(resto.id);
    });
  },
  resetFilteringFinished(state) {
    state.filteringFinished = false;
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
    state.addedRestaurants.push(resto);
  },

  setSearchResultHasPage(state, hasPage) {
    state.searchResultHasPage = hasPage;
  },

  toggleSeeMoreCliked(state) {
    state.seeMoreCliked = !state.seeMoreCliked;
  },

  // AUTOCOMPLETE
  setAutoComplLocation(state, location) {
    state.autoComplLocation = location;
  },

  // THEME
  toggleTheme(state) {
    state.light = !state.light;
  },
};
