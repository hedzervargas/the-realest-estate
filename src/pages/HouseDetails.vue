<template>
  <base-dialog v-if="error" @close="closeDialog"></base-dialog>
  <section class="page">
    <div v-if="!onMobile" class="back">
      <router-link to="/houses">
        <img
          src="../assets/Frontend_Internship_Test_Slices/ic_back_grey.png"
          alt="+"
          class="img-plus"
        />
        <h2>Back to overview</h2>
      </router-link>
    </div>
    <base-spinner v-if="isLoading"></base-spinner>
    <div v-else class="components">
      <house-listing :houseId="houseId"></house-listing>
      <the-recommendations :houseId="houseId"></the-recommendations>
    </div>
  </section>
</template>

<script>
import HouseListing from "../components/house-details/HouseListing.vue";
import TheRecommendations from "../components/house-details/TheRecommendations.vue";
export default {
  components: { HouseListing, TheRecommendations },
  props: ["houseId"],
  data() {
    return {
      error: null,
    };
  },
  computed: {
    houses() {
      return this.$store.getters.houses;
    },
    onMobile() {
      return this.$store.getters.onMobile;
    },
    isLoading() {
      let loading = false;
      // *** temporary ***
      if (
        !this.houses.length ||
        !this.houses.find((house) => house.id === this.houseId)
      ) {
        loading = true;
      }
      return loading;
    },
  },
  methods: {
    closeDialog() {
      this.error = false;
    },
  },
};
</script>

<style>
.page {
  width: 100%;
  margin: 0;
}
a {
  display: inline-flex;
  align-items: center;
}
.back h2 {
  font-size: 16px;
  margin: 0;
}
.back img {
  margin-right: 0.75rem;
}
@media screen and (min-width: 1000px) {
  .page {
    margin: 8rem auto 0 auto;
    width: 90%;
    max-width: var(--max-width);
  }
  .components {
    display: flex;
    margin: 1.5rem 0 3rem 0;
  }
}
</style>
