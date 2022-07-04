<template>
  <section v-if="recommendedHouses.length">
    <h2>Recommended for you</h2>
    <ul>
      <house-item
        v-for="house in recommendedHouses"
        :key="house.id"
        :house="house"
      ></house-item>
    </ul>
  </section>
  <section v-else>
    <p>There are no recommendations for this house yet</p>
  </section>
</template>

<script>
import { computed } from "@vue/runtime-core";
import HouseItem from "../houses-list/HouseItem.vue";
import { useStore } from "vuex";
export default {
  components: { HouseItem },
  props: ["houseId"],
  setup(props) {
    const houses = computed(() => useStore().getters.houses);

    const currentHouse = computed(() =>
      houses.value.find((house) => house.id === props.houseId)
    );

    const recommendedHouses = computed(() => {
      // recommending by price
      let rHouses = [];
      const maxPrice = currentHouse.value.price * 1.5;
      const minPrice = currentHouse.value.price * 0.5;

      // push all recommended houses to array
      houses.value.forEach((house) => {
        if (
          house.price > minPrice &&
          house.price < maxPrice &&
          house.id !== currentHouse.value.id &&
          !house.madeByMe // *** temporary ***  ( change after auth )
        ) {
          rHouses.push(house);
        }
      });

      // remove untill there are 3 random recommended houses left
      if (rHouses.length > 3) {
        for (let i = rHouses.length - 3; i > 0; i--) {
          const index = Math.floor(Math.random() * rHouses.length);
          rHouses.splice(index, 1);
        }
      }
      return rHouses;
    });

    return {
      recommendedHouses,
    };
  },
};
</script>

<style scoped>
section {
  margin-bottom: 5rem;
  margin-top: 0;
}
@media screen and (min-width: 1000px) {
  section {
    margin: 0;
    width: 35%;
  }
  h2 {
    margin-top: 0;
  }
}
</style>
