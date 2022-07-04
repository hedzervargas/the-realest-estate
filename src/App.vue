<template>
  <mobile-nav-bar v-if="onMobile"></mobile-nav-bar>
  <nav-bar v-else></nav-bar>
  <router-view></router-view>
</template>

<script>
import NavBar from "./nav/NavBar.vue";
import MobileNavBar from "./nav/MobileNavBar.vue";
import { stopRealtime } from "./firebase";
export default {
  components: { NavBar, MobileNavBar },
  computed: {
    onMobile() {
      return this.$store.getters.onMobile;
    },
  },
  mounted() {
    this.$store.dispatch("setHouses");
    this.$store.dispatch("toMobile");
  },
  unmounted() {
    stopRealtime();
  },
};
</script>

<style>
/* fonts */
@import url("https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,500;0,600;0,700;1,500&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap");
*,
::after,
::before {
  box-sizing: border-box;
  outline: none;
}

body {
  margin: 0;
}

:root {
  /* element colors */
  --primary-color: #eb5440;
  --secondary-color: #4a4b4c;
  --tertiary-color: #e8e8e8;
  --quaternary-color: #c3c3c3;
  --background-color-1: #f6f6f6;
  --background-color-2: #ffffff;

  /* text colors*/
  --primary-text-color: #000000;
  --secondary-text-color: #4a4b4c;
  --tertiary-text-color: #636363;
  --hyperlink-color: #067bc2;

  /* fonts  */
  --heading-font: "Roboto", sans-serif;
  /* rest of the vars */
  --background-color: var(--grey-50);
  --text-color: var(--grey-900);
  --border-radius: 0.5rem;
  --letter-spacing: 1px;
  --transition: 0.3s ease-in-out all;
  --max-width: 1120px;
  --fixed-width: 600px;

  /* box shadow*/
  --shadow: 13px 17px 23px 0px rgba(0, 0, 0, 0.06);
}

body,
input,
select,
textarea {
  background: var(--background-color-1);
  font-family: "Montserrat";
  font-weight: 400;
  font-size: 12px;
  color: var(--primary-text-color);
}
body.dialog-open {
  overflow: hidden;
}
body.create-listing {
  background-image: linear-gradient(
      0deg,
      rgba(34, 193, 195, 0) 0%,
      rgba(246, 246, 246, 1) 50%
    ),
    url("./assets/Frontend_Internship_Test_Slices/img_background@2x.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center bottom;
  height: 100%;
  width: 100%;
}
@media screen and (min-width: 1000px) {
  body.create-listing {
    background-image: url("./assets/Frontend_Internship_Test_Slices/img_background@2x.png");
    background-position: initial;
    background-size: cover;
  }
}
h1,
h2 {
  margin: 0;
  margin-bottom: 1.38rem;
  font-family: "Montserrat";
  font-weight: 700;
  font-size: 18px;
  line-height: 1.3;
  text-transform: capitalize;
  letter-spacing: var(--letterSpacing);
}
h1 {
  font-size: 18px;
  margin-top: 0;
}
h2 {
  font-size: 14px;
}
p {
  font-family: "Montserrat";
  font-weight: 400;
  font-size: 12px;
  color: var(--primary-text-color);
}
button {
  font-family: "Montserrat";
  font-weight: 700;
  font-size: 12px;
  color: var(--background-color-2);
  border: transparent;
  padding: 0.8rem;
  height: 100%;
  width: 100%;
  cursor: pointer;
  background: var(--primary-color);
  border-radius: var(--border-radius);
}
/* desktop font sizes */
@media screen and (min-width: 1000px) {
  body {
    font-size: 18px;
  }
  input,
  textarea,
  select {
    font-size: 14px;
  }
  p {
    font-size: 18px;
  }
  button {
    font-size: 18px;
  }
  h1 {
    font-size: 32px;
  }
  h2 {
    font-size: 22px;
  }
}

a {
  text-decoration: none;
  color: var(--primary-text-color);
}
ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.img {
  width: 100%;
  display: block;
  object-fit: cover;
}
section {
  width: 90%;
  max-width: var(--max-width);
  margin: 3rem auto 5rem auto;
}
@media screen and (min-width: 1000px) {
  section {
    margin: 8rem auto 3rem auto;
  }
}
</style>
