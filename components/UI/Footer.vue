<template>
  <b-container id="footer" fluid>
    <b-row class="footerRow" align-v="center" align-h="center">
      <b-col cols="2"></b-col>
      <b-col cols="8">
        <p class="text-center credit">
          designed and developed by Nicolas Vastrade
        </p>
      </b-col>
      <b-col cols="2">
        <div class="text-center icons">
          <a
            class="socialIcon"
            href="https://github.com/nicolius13"
            target="blank"
            ><font-awesome-icon :icon="['fab', 'github-alt']" />
          </a>
          <a
            class="socialIcon"
            href="https://www.linkedin.com/in/nicolas-vastrade-029a60a7"
            target="blank"
          >
            <font-awesome-icon :icon="['fab', 'linkedin-in']" />
          </a>
          <a
            class="socialIcon"
            href="https://www.facebook.com/nicolas.vastrade"
            target="blank"
          >
            <font-awesome-icon :icon="['fab', 'facebook-f']" />
          </a>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {};
</script>

<style lang="postcss" scoped>
#footer {
  height: 70px;
  width: 100%;
  background-color: #1d1d1d;
  position: absolute;
}
.footerRow {
  height: 100%;
}
p {
  margin: 0;
}

.credit {
  color: #525252;
}

.icons {
  font-size: rfs(1.5rem);
}
.socialIcon {
  color: #fff;
  transition: all 0.2s ease-in-out;
  margin: 0 0.5rem;
}
.socialIcon:hover {
  color: #ff2e63;
  transition: all 0.2s ease-in-out;
}
</style>
