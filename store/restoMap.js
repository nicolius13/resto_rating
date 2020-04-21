import restos from '../restoList.json';

export const state = () => ({
  restoList: restos,
  filteredList: [],
  ratingAverage: [],
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
};
