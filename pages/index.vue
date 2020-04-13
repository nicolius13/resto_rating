<template>
  <div>
    <section class="main">
      <div class="searchWrapper">
        <h1>Find Restaurant</h1>
        <div class="search">
          <div class="searchBar"></div>
          <div class="searchBtn">GO</div>
        </div>
        <p>{{ message }}</p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: 'Init of a great app !',
    }
  },
}
</script>

<style>
body {
  min-height: 100vh;
  margin: 0;
  background-color: #1d1d1d;
  color: #fff;
  font-family: 'Montserrat', sans-serif;
}
.main {
  height: Calc(100vh - 76px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.main::after {
  content: '';
  background: url('../assets/asian-d.jpg');
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

/* PlaceHolder */
p {
  text-align: center;
}
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
