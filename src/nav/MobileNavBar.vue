<template>
  <nav>
    <ul>
      <li>
        <router-link to="/houses">
          <img :src="housesImgSrc" alt="houses" />
        </router-link>
      </li>
      <li>
        <router-link to="/about">
          <img :src="aboutImgSrc" alt="about" />
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  computed: {
    path() {
      return this.$route.path;
    },
    aboutImgSrc() {
      if (this.path.includes("/about"))
        return require(`../assets/Frontend_Internship_Test_Slices/ic_mobile_navigarion_info_active.png`);
      return require(`../assets/Frontend_Internship_Test_Slices/ic_mobile_navigarion_info.png`);
    },
    housesImgSrc() {
      if (this.path.includes("/houses"))
        return require(`../assets/Frontend_Internship_Test_Slices/ic_mobile_navigarion_home_active.png`);
      return require(`../assets/Frontend_Internship_Test_Slices/ic_mobile_navigarion_home.png`);
    },
  },
};
</script>

<style scoped>
nav {
  position: fixed;
  width: 100%;
  bottom: 0;
  z-index: 1;
  background: white;
}
ul {
  display: flex;
  margin: 1rem;
  justify-content: space-around;
}
</style>
