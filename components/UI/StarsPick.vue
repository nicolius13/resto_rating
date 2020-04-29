<template>
  <div>
    <span
      v-b-hover="starHover"
      @click="selectStars(0)"
      :class="{ fullStar: selected >= 0 }"
      class="stack"
      data-star="0"
    >
      <b-iconstack>
        <b-icon
          :class="isHovered[0] ? 'colorFill' : ''"
          class="fill"
          stacked
          icon="star-fill"
          scale="0.8"
        ></b-icon>
        <b-icon :class="{ select: selected >= 0 }" stacked icon="star"></b-icon>
      </b-iconstack>
    </span>

    <span
      v-b-hover="starHover"
      @click="selectStars(1)"
      :class="{ fullStar: selected >= 1 }"
      class="stack"
      data-star="1"
    >
      <b-iconstack>
        <b-icon
          :class="isHovered[1] ? 'colorFill' : ''"
          class="fill"
          stacked
          icon="star-fill"
          scale="0.8"
        ></b-icon>
        <b-icon :class="{ select: selected >= 1 }" stacked icon="star"></b-icon>
      </b-iconstack>
    </span>

    <span
      v-b-hover="starHover"
      @click="selectStars(2)"
      :class="{ fullStar: selected >= 2 }"
      class="stack"
      data-star="2"
    >
      <b-iconstack>
        <b-icon
          :class="isHovered[2] ? 'colorFill' : ''"
          class="fill"
          stacked
          icon="star-fill"
          scale="0.8"
        ></b-icon>
        <b-icon :class="{ select: selected >= 2 }" stacked icon="star"></b-icon>
      </b-iconstack>
    </span>

    <span
      v-b-hover="starHover"
      @click="selectStars(3)"
      :class="{ fullStar: selected >= 3 }"
      class="stack"
      data-star="3"
    >
      <b-iconstack>
        <b-icon
          :class="isHovered[3] ? 'colorFill' : ''"
          class="fill"
          stacked
          icon="star-fill"
          scale="0.8"
        ></b-icon>
        <b-icon :class="{ select: selected >= 3 }" stacked icon="star"></b-icon>
      </b-iconstack>
    </span>

    <span
      v-b-hover="starHover"
      @click="selectStars(4)"
      :class="{ fullStar: selected >= 4 }"
      class="stack"
      data-star="4"
    >
      <b-iconstack>
        <b-icon
          :class="isHovered[4] ? 'colorFill' : ''"
          class="fill"
          stacked
          icon="star-fill"
          scale="0.8"
        ></b-icon>
        <b-icon :class="{ select: selected >= 4 }" stacked icon="star"></b-icon>
      </b-iconstack>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    stars: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      isHovered: [false, false, false, false, false],
      selected: this.stars - 1,
      firstClick: true,
    };
  },
  methods: {
    starHover(hovered, event) {
      const starIndex = parseInt(event.target.dataset.star);

      for (let i = 0; i <= starIndex; i++) {
        this.$set(this.isHovered, i, !this.isHovered[i]);
      }
    },
    // manage the star clickings
    selectStars(star) {
      // put 1 star on the first click of the first star
      if (star === 0 && this.firstClick) {
        this.firstClick = false;
        this.selected = star;
        this.$emit('starPick', this.selected + 1);
        // put 0 star on the second click on the first star
      } else if (star === 0 && !this.firstClick) {
        this.firstClick = true;
        this.selected = -1;
        this.$emit('starPick', 0);
        // put the number of stars clicked
      } else if (star > 0) {
        this.firstClick = true;
        this.selected = star;
        this.$emit('starPick', this.selected + 1);
      }
    },
    classSelect(star) {
      if (this.isHovered[1]) {
        return 'colorFill';
      } else {
        return '';
      }
    },
  },
};
</script>

<style scoped>
.stack {
  cursor: pointer;
}

.select {
  color: #08d9d6;
}
.fill {
  color: #1d1d1d;
}
.colorFill {
  color: #08d9d6;
}
.fullStar .fill {
  color: #08d9d6;
}
.fullStar .colorFill {
  color: #048684;
}
</style>
