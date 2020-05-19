<template>
  <div id="footer" class="colorTransition">
    <b-container fluid="md" class="footerRow">
      <b-row class="footerRow" align-v="center" align-h="center">
        <b-col cols="2" class="d-none d-sm-flex">
          <ThemeBtn />
        </b-col>
        <b-col>
          <p class="text-center credit">
            designed and developed by Nicolas Vastrade
          </p>
        </b-col>
        <b-col cols="4" md="3">
          <div class="text-right icons">
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
  </div>
</template>

<script>
import ThemeBtn from './ThemeBtn';
export default {
  components: {
    ThemeBtn,
  },
};
</script>

<style lang="postcss" scoped>
#footer {
  height: 70px;
  width: 100%;
  background-color: #1d1d1d;
  position: absolute;
}
.light #footer {
  background-color: #e2e2e2;
}
.footerRow {
  height: 100%;
}
p {
  margin: 0;
}

.credit {
  color: rgb(110, 110, 110);
}

/* Social links */
.icons {
  font-size: rfs(1.5rem);
}
.socialIcon {
  color: #fff;
  transition: all 0.2s ease-in-out;
  margin: 0 0.5rem;
}
.light .socialIcon {
  color: rgb(34, 34, 34);
}
.socialIcon:hover {
  color: #ff2e63;
  transition: all 0.2s ease-in-out;
}
</style>
