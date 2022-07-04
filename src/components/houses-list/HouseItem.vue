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
  <li ref="list" :class="{ big: bigList }">
    <router-link :to="`/houses/${house.id}`">
      <div class="img-container" :class="{ big: bigList }">
        <img :src="house.image" alt="" class="house-img" />
      </div>
    </router-link>
    <div class="info">
      <div class="main-info">
        <h2>
          {{ house.location.streetName }} {{ house.location.houseNumber }}
        </h2>
        <p>{{ formattedPrice }}</p>
        <p class="zip">
          {{ house.location.zip + " " + house.location.city }}
        </p>
      </div>
      <div class="properties" :class="{ big: bigList }">
        <div class="bedrooms">
          <img
            src="../../assets/Frontend_Internship_Test_Slices/ic_bed.png"
            alt="bedrooms"
          />
          <p>{{ house.rooms.bedrooms }}</p>
        </div>
        <div class="bathrooms">
          <img
            src="../../assets/Frontend_Internship_Test_Slices/ic_bath.png"
            alt="bathrooms"
          />
          <p>{{ house.rooms.bathrooms }}</p>
        </div>
        <div class="size">
          <img
            src="../../assets/Frontend_Internship_Test_Slices/ic_size.png"
            alt="size"
          />
          <p>{{ house.size }}</p>
        </div>
      </div>
    </div>
    <div v-if="house.madeByMe" class="controls" :class="{ big: bigList }">
      <router-link :to="`/houses/${house.id}/edit`">
        <img
          src="../../assets/Frontend_Internship_Test_Slices/ic_edit.png"
          alt="edit"
          class="edit"
        />
      </router-link>
      <img
        src="../../assets/Frontend_Internship_Test_Slices/ic_delete.png"
        alt="delete"
        @click="deletingHouse = true"
      />
    </div>
  </li>
</template>

<script>
import { ref } from "@vue/reactivity";
// import { computed, onMounted } from "@vue/runtime-core";
import { computed, onMounted, onUnmounted } from "@vue/runtime-core";
import { useDeleteHouse } from "@/firebase";
export default {
  props: ["house"],
  setup(props) {
    const bigList = ref(null);
    const deletingHouse = ref(false);

    const formattedPrice = computed(() => {
      // adding dot every three digits
      let price = new Intl.NumberFormat("nl-NL", {
        style: "currency",
        currency: "EUR",
      }).format(props.house.price);
      price = price.slice(0, -3);
      return price;
    });

    const deleteHouse = async () => {
      await useDeleteHouse(props.house.id);
      closeDialog();
    };

    const closeDialog = () => {
      deletingHouse.value = false;
      document.body.classList.remove("dialog-open");
    };

    // controlling width of list
    const list = ref(null);

    const checkListWidth = () => {
      let listWidth = list.value.offsetWidth;
      listWidth > 650 ? (bigList.value = true) : (bigList.value = false);
    };

    const keepCheckingListWidth = () => {
      checkListWidth();
      window.addEventListener("resize", checkListWidth);
    };

    onMounted(keepCheckingListWidth);
    onUnmounted(() => {
      window.removeEventListener("resize", checkListWidth);
    });

    return {
      bigList,
      deletingHouse,
      formattedPrice,
      deleteHouse,
      list,
      closeDialog,
    };
  },
};
</script>

<style scoped>
li {
  background: var(--background-color-2);
  border-radius: var(--border-radius);
  margin-bottom: 1rem;
  display: flex;
  padding: 0.8rem;
  height: 8rem;
  width: 100%;
  position: relative;
  box-shadow: var(--shadow);
}
.img-container {
  width: 7rem;
  height: 100%;
  margin-right: 0.75rem;
}
.house-img {
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: var(--border-radius);
}
.info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
h2,
p {
  margin: 0 0 0.1rem 0;
}
h2 {
  font-size: 14px;
}
p {
  font-size: 12px;
}
.info p {
  line-height: 1.6;
}
.zip {
  color: var(--quaternary-color);
}
.properties {
  display: flex;
  align-items: flex-end;
  margin-top: 0.35rem;
}
.properties div {
  display: flex;
  align-items: flex-end;
  margin-right: 1rem;
}
.properties img {
  margin-right: 0.5rem;
}
.properties p {
  color: var(--tertiary-text-color);
}
.controls {
  position: absolute;
  top: 1rem;
  right: 1rem;
}
.controls .edit {
  margin-right: 0.5rem;
}
.controls img {
  cursor: pointer;
}
/* big list */
li.big {
  height: 10rem;
  padding: 1rem;
}
.img-container.big {
  width: 9rem;
  margin-right: 1rem;
}
li.big h2 {
  font-size: 20px;
  margin-bottom: 0.35rem;
}
li.big p {
  font-size: 16px;
}
li.big .main-info p {
  margin-bottom: 0.25rem;
}
.properties.big {
  margin-top: 0.35rem;
}
.properties.big div {
  align-items: center;
}
.controls.big {
  top: 1.5rem;
  right: 1.5rem;
}
.controls.big .edit {
  margin-right: 1rem;
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
