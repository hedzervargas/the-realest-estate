<template>
  <base-dialog v-if="deletingHouse">
    <template #message>
      <h1 class="dialog">Delete listing</h1>
      <p class="dialog">Are you sure you want to delete this listing?</p>
      <p class="dialog">This action cannot be undone.</p>
    </template>
    <template #actions>
      <button @click="deleteHouse" class="dialog">YES, DELETE</button>
      <button class="dialog flat" @click="closeDialog">GO BACK</button>
    </template>
  </base-dialog>
  <section>
    <div class="listing">
      <div v-if="onMobile" class="controls mobile-controls">
        <router-link to="/houses">
          <img
            src="../../assets/Frontend_Internship_Test_Slices/ic_back_white.png"
            alt="+"
            class="img-plus"
          />
        </router-link>
        <div v-if="house.madeByMe">
          <router-link :to="`/houses/${house.id}/edit`">
            <img
              src="../../assets/Frontend_Internship_Test_Slices/ic_edit_white.png"
              alt="+"
              class="img-plus"
            />
          </router-link>
          <img
            src="../../assets/Frontend_Internship_Test_Slices/ic_delete_white.png"
            alt="+"
            class="img-plus"
            @click="deletingHouse = true"
          />
        </div>
      </div>
      <div class="house-image-container">
        <img class="house-image" :src="house.image" alt="" />
      </div>
      <div class="house-info">
        <header>
          <h1>
            {{ house.location.streetName }} {{ house.location.houseNumber }}
          </h1>
          <div
            v-if="!onMobile && house.madeByMe"
            class="controls desktop-controls"
          >
            <router-link :to="`/houses/${house.id}/edit`">
              <img
                src="../../assets/Frontend_Internship_Test_Slices/ic_edit.png"
                alt="+"
                class="img-plus"
              />
            </router-link>
            <img
              src="../../assets/Frontend_Internship_Test_Slices/ic_delete.png"
              alt="+"
              class="img-plus"
              @click="deletingHouse = true"
            />
          </div>
        </header>
        <div class="location">
          <img
            src="../../assets/Frontend_Internship_Test_Slices/ic_location.png"
            alt="+"
            class="img-plus"
          />
          <p>
            {{ house.location.zip.replace(/\D/g, "") }}
            {{ house.location.zip.replace(/[^a-z]/gi, "") }}
            {{ house.location.city }}
          </p>
        </div>
        <div class="properties">
          <div class="property">
            <img
              src="../../assets/Frontend_Internship_Test_Slices/ic_price.png"
              alt="+"
              class="img-plus"
            />
            <p>{{ formattedPrice }}</p>
          </div>
          <div class="property">
            <img
              src="../../assets/Frontend_Internship_Test_Slices/ic_size.png"
              alt="+"
              class="img-plus"
            />
            <p>{{ house.size }} m2</p>
          </div>
          <div class="property">
            <img
              src="../../assets/Frontend_Internship_Test_Slices/ic_construction_date.png"
              alt="+"
              class="img-plus"
            />
            <p>Built in {{ house.constructionYear }}</p>
          </div>
        </div>
        <div class="properties">
          <div class="property">
            <img
              src="../../assets/Frontend_Internship_Test_Slices/ic_bed.png"
              alt="+"
              class="img-plus"
            />
            <p>{{ house.rooms.bedrooms }}</p>
          </div>
          <div class="property">
            <img
              src="../../assets/Frontend_Internship_Test_Slices/ic_bath.png"
              alt="+"
              class="img-plus"
            />
            <p>{{ house.rooms.bathrooms }}</p>
          </div>
          <div class="property">
            <img
              src="../../assets/Frontend_Internship_Test_Slices/ic_garage.png"
              alt="+"
              class="img-plus"
            />
            <p>{{ house.hasGarage === "true" ? "Yes" : "No" }}</p>
          </div>
        </div>
        <p class="description">
          {{ house.description }}
        </p>
      </div>
    </div>
  </section>
</template>

<script>
import { computed, ref } from "@vue/runtime-core";
import { useStore } from "vuex";
import { useDeleteHouse } from "@/firebase";
import { useRouter } from "vue-router";
export default {
  props: ["houseId"],
  setup(props) {
    const router = useRouter();
    const house = computed(() => {
      const houses = useStore().getters.houses;
      const house = houses.find((house) => house.id === props.houseId);
      return house;
    });

    const deletingHouse = ref(false);

    const deleteHouse = async () => {
      await useDeleteHouse(props.houseId);
      deletingHouse.value = false;
      document.body.classList.remove("dialog-open");
      console.log(router);
      router.push("/houses");
    };
    const closeDialog = () => {
      deletingHouse.value = false;
      document.body.classList.remove("dialog-open");
    };

    const formattedPrice = computed(() => {
      let price = new Intl.NumberFormat("nl-NL", {
        style: "currency",
        currency: "EUR",
      }).format(house.value.price);
      price = price.slice(2, -3);
      return price;
    });

    const onMobile = computed(() => useStore().getters.onMobile);

    return {
      deletingHouse,
      house,
      formattedPrice,
      onMobile,
      deleteHouse,
      closeDialog,
    };
  },
};
</script>

<style scoped>
section {
  margin: 0;
  width: 100vw;
  max-width: 100%;
}
.listing {
  position: relative;
  width: 100%;
  height: 100%;
}
.listing p {
  font-family: "Open Sans";
  color: var(--secondary-text-color);
}
.controls img {
  cursor: pointer;
}
.listing .mobile-controls {
  position: absolute;
  top: 2rem;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 1rem 5%;
}
.listing .mobile-controls div img {
  margin-left: 1rem;
}
.house-image {
  width: 100%;
  display: block;
}
.house-info {
  width: 100%;
  border-top-left-radius: 6vw;
  border-top-right-radius: 6vw;
  padding: 2rem;
  background: var(--background-color-2);
  transform: translateY(-6vw);
}
.house-info h1 {
  margin-bottom: 1rem;
  text-align: initial;
}
.location,
.property {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
}
.location img {
  margin-right: 0.5rem;
}
.location p {
  margin-bottom: 0.4rem;
}
.properties {
  display: flex;
}
.location p,
.properties p {
  font-weight: 600;
  /* margin-bottom: 0.4rem; */
  margin: 0;
}
.property {
  margin-right: 1rem;
}
.property img {
  margin-right: 0.5rem;
}
@media screen and (min-width: 1000px) {
  section {
    width: 65%;
    margin-right: 5%;
  }
  .house-info {
    border-radius: initial;
    transform: translateY(0);
  }
  .house-info h1 {
    margin-bottom: 0.5rem;
  }
  .house-info header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .house-info .desktop-controls img {
    margin-left: 1.5rem;
  }
  .location,
  .property {
    align-items: center;
    margin-bottom: 1rem;
  }
  .location {
    margin-top: 0.75rem;
  }
  .location p,
  .properties p {
    font-size: 14px;
    margin: 0;
  }
}
/* dialog styles */
h1.dialog,
p.dialog {
  text-align: center;
}
button.dialog {
  margin-top: 1rem;
  margin-bottom: 0;
}
button.dialog.flat {
  background: var(--secondary-color);
}
@media screen and (min-width: 1000px) {
  h1.dialog {
    font-size: 22px;
  }
  p.dialog {
    font-size: 16px;
  }
  button.dialog {
    font-size: 16px;
  }
}
</style>
