<template>
  <nav>
    <div>
      <!-- <img
        src="../assets/Frontend_Internship_Test_Slices/img_logo_dtt.png"
        alt="DTT"
      /> -->
      <img src="../assets/logo.png" alt="" />
      <ul>
        <li>
          <router-link to="/houses">
            <h2 :class="{ active: path.includes('/houses') }">Houses</h2>
          </router-link>
        </li>
        <li>
          <router-link to="/about">
            <h2 :class="{ active: path.includes('/about') }">About</h2>
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  computed: {
    path() {
      return this.$route.path;
    },
  },
};
</script>

<style scoped>
nav {
  background: white;
  position: fixed;
  width: 100%;
  z-index: 1;
  top: 0;
  padding: 1rem 0;
  box-shadow: var(--shadow);
}
nav div {
  width: 85%;
  max-width: var(--max-width);
  margin: 0 auto;
  display: flex;
  align-items: center;
}
ul {
  display: inline-flex;
  margin-top: 0.7rem;
}
li {
  margin-left: 3.5rem;
}
li h2 {
  font-size: 16px;
  margin: 0;
  color: var(--tertiary-color);
  transition: var(--transition);
}
li h2:hover {
  color: var(--primary-text-color);
}
li h2.active {
  color: var(--primary-text-color);
}
</style>
