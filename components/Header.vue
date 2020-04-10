<template>
  <b-navbar id="navBar" toggleable="md">
    <div class="container">
      <b-navbar-brand id="logo" to="/">
        <img src="../assets/logo.png" alt="logo" />
        <span>Resto Finder</span>
      </b-navbar-brand>

      <b-navbar-toggle
        @click="mobileBtn"
        class=" first-button"
        target="nav-collapse"
      >
        <template>
          <div :class="mobileOpen ? 'open' : ''" class="burgerBtn">
            <span></span><span></span><span></span>
          </div>
        </template>
      </b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item class="deco" to="/map">Map</b-nav-item>
          <b-nav-item class="deco" to="/">Add a Restaurant</b-nav-item>
          <b-nav-item class="deco" to="/">About</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </div>
  </b-navbar>
</template>

<script>
export default {
  data() {
    return {
      mobileOpen: false,
    }
  },
  methods: {
    mobileBtn() {
      this.mobileOpen = !this.mobileOpen
    },
  },
}
</script>

<style scoped>
#navBar {
  background-color: #1a1a1a;
}

#logo {
  display: flex;
  align-items: center;
  color: #ff2e63;
  text-decoration: none;
}
#logo img {
  max-width: 50px;
}
#logo span {
  padding-left: 10px;
  font-size: 28px;
}

/* LINK */

.navbar-nav .nav-link {
  color: #08d9d6;
  transition: all 0.3s ease-in-out;
}
.navbar-nav .nav-link:hover {
  color: #0aa7a4;
  transition: all 0.3s ease-in-out;
}
.navbar-nav .deco {
  text-decoration: none;
  position: relative;
}

.navbar-nav .deco:before {
  content: '';
  position: absolute;
  width: 100%;
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: #ff2e63;
  visibility: hidden;
  transform: scaleX(0);
  transition: all 0.3s ease-in-out 0s;
}

.navbar-nav .deco:hover:before,
.navbar-nav .deco.active:before {
  visibility: visible;
  transform: scaleX(1);
}

/* MOBILE MENU BTN */

.navbar-toggler {
  border: none;
}
.navbar-toggler:focus {
  outline: 0;
}

.burgerBtn {
  width: 30px;
  height: 20px;
  position: relative;
  margin: 0px;
  transform: rotate(0deg);
  transition: 0.5s ease-in-out;
  cursor: pointer;
}

.burgerBtn span {
  background: #08d9d6;
  display: block;
  position: absolute;
  height: 3px;
  width: 100%;
  border-radius: 9px;
  opacity: 1;
  left: 0;
  transform: rotate(0deg);
  transition: 0.25s ease-in-out;
}
.burgerBtn:hover span {
  background: #09a5a2;
}

.burgerBtn span:nth-child(1) {
  top: 0px;
}
.burgerBtn span:nth-child(2) {
  top: 10px;
}
.burgerBtn span:nth-child(3) {
  top: 20px;
}

.burgerBtn.open span:nth-child(1) {
  top: 11px;
  transform: rotate(135deg);
}
.burgerBtn.open span:nth-child(2) {
  opacity: 0;
  left: 60px;
}
.burgerBtn.open span:nth-child(3) {
  top: 11px;
  transform: rotate(-135deg);
}
</style>
