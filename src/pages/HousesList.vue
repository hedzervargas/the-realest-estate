<template>
  <base-dialog v-if="error" @close="closeDialog"></base-dialog>
  <section>
    <header>
      <h1>Houses</h1>
      <router-link to="/houses/create">
        <img
          v-if="onMobile"
          src="../assets/Frontend_Internship_Test_Slices/ic_plus_grey.png"
          alt="+"
          class="img-plus"
        />
        <div v-else class="create">
          <img
            src="../assets/Frontend_Internship_Test_Slices/ic_plus_white.png"
            alt="+"
            class="img-plus"
          />
          <button>CREATE NEW</button>
        </div>
      </router-link>
    </header>
    <form @submit.prevent="">
      <div class="input-wrapper">
        <input
          type="text"
          placeholder="Search for a house"
          ref="searchBar"
          v-model="search"
        />
        <img
          src="../assets/Frontend_Internship_Test_Slices/ic_search.png"
          alt=""
          class="img-search"
          @click="$refs.searchBar.focus"
        />
        <img
          v-if="search"
          src="../assets/Frontend_Internship_Test_Slices/ic_clear.png"
          alt=""
          class="img-clear"
          @click="search = ''"
        />
      </div>
      <div class="sorting">
        <button
          @click="setSorting('price')"
          :class="{ active: sorting === 'price' }"
        >
          Price
        </button>
        <button
          @click="setSorting('size')"
          :class="{ active: sorting === 'size' }"
        >
          Size
        </button>
      </div>
    </form>
    <h2
      v-if="!isLoading && search && filteredHouses.length"
      class="result-amount"
    >
      {{ filteredHouses.length }} results found
    </h2>
    <base-spinner v-if="isLoading"></base-spinner>
    <ul v-else-if="sortedHouses.length">
      <house-item
        v-for="house in sortedHouses"
        :key="house.id"
        :house="house"
      ></house-item>
    </ul>
    <div v-else class="empty">
      <img
        src="../assets/Frontend_Internship_Test_Slices/img_empty_houses.png"
        alt=""
      />
      <p>No results found.</p>
      <p>Please try another keyword</p>
    </div>
  </section>
</template>

<script>
import { computed, onMounted, ref, watch } from "vue";
import HouseItem from "../components/houses-list/HouseItem.vue";
import { useStore } from "vuex";
export default {
  components: { HouseItem },
  setup() {
    const search = ref("");
    const sorting = ref("price");
    const error = ref(null);
    const isLoading = ref(false);

    const store = useStore();

    const houses = computed(() => store.getters.houses);

    // setting isLoading to false
    watch(houses, (newVal, oldVal) => {
      if (!oldVal.length && newVal.length) isLoading.value = false;
    });

    const filteredHouses = computed(() => {
      // filtering for year, desc & location (case insensitive)
      if (!houses.value) return [];
      const s = search.value.toLowerCase();
      const fHouses = houses.value.filter((house) => {
        const yearIncl = house.constructionYear.toString().includes(s);
        const descIncl = house.description.toLowerCase().includes(s);
        let locIncl = false;
        for (const key in house.location) {
          if (house.location[key].toString().toLowerCase().includes(s)) {
            locIncl = true;
          }
        }
        return yearIncl || descIncl || locIncl;
      });
      return fHouses;
    });

    const sortedHouses = computed(() => {
      // sorting by price or size
      if (!filteredHouses.value) return [];
      const sHouses = [...filteredHouses.value];
      sHouses.sort((a, b) => b[sorting.value] - a[sorting.value]);
      return sHouses;
    });

    const onMobile = computed(() => useStore().getters.onMobile);

    function setSorting(newSorting) {
      sorting.value = newSorting;
    }

    function closeDialog() {
      error.value = null;
    }

    onMounted(() => {
      // setting isLoading to true
      if (!houses.value.length) isLoading.value = true;
    });

    return {
      search,
      sorting,
      error,
      isLoading,
      houses,
      onMobile,
      filteredHouses,
      sortedHouses,
      setSorting,
      closeDialog,
    };
  },
};
</script>

<style scoped>
header {
  position: relative;
}
header h1 {
  display: inline-block;
  text-align: center;
  margin-left: 50%;
  transform: translateX(-50%);
}
.create {
  position: relative;
}
.img-plus {
  position: absolute;
  top: 3px;
  right: 0;
}
.create button {
  padding: 0 1.5rem 0 3.5rem;
  height: 2.75rem;
}
input {
  width: 100%;
  border: none;
  background: var(--tertiary-color);
  padding: 0.8rem 3rem;
  border-radius: var(--border-radius);
}
input::placeholder {
  color: var(--quaternary-color);
}
.input-wrapper {
  position: relative;
}
.img-search {
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  cursor: pointer;
}
.img-clear {
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  cursor: pointer;
}
.sorting {
  border-radius: var(--border-radius);
  padding: 0;
  margin: 1rem 0;
  overflow: hidden;
  display: flex;
}
.sorting button {
  width: 50%;
  background: var(--quaternary-color);
  display: block;
  transition: var(--transition);
  border-radius: initial;
}
.sorting button:hover,
.sorting .active {
  background: var(--primary-color);
}
.empty {
  margin-top: 15vh;
}
.empty img {
  display: block;
  margin: 0 auto 2rem auto;
}
.empty p {
  font-family: "Montserrat";
  color: var(--secondary-text-color);
  font-size: 14px;
  margin: 0;
  margin-bottom: 0.25rem;
  text-align: center;
}
.result-amount {
  margin-top: 1.38rem;
  font-size: 14px;
}
@media screen and (min-width: 740px) {
  .result-amount {
    font-size: 20px;
  }
}
@media screen and (min-width: 1000px) {
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  header h1 {
    margin: 0;
    transform: translateX(0);
    font-size: 24px;
  }
  .img-plus {
    position: absolute;
    top: 50%;
    left: 1.4rem;
    transform: translateY(-50%);
  }
  form {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.25rem;
    margin-bottom: 1rem;
  }
  input {
    width: 25rem;
  }
  .sorting {
    width: 18rem;
  }
  .sorting button {
    font-size: 16px;
    padding: 0.7rem;
  }
  .empty p {
    font-size: 16px;
  }
}
</style>
>
