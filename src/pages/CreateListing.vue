<template>
  <base-dialog v-if="error" @close="closeError"></base-dialog>
  <base-dialog v-if="unsavedWarning">
    <template #message>
      <h1 class="dialog">Unsaved changes</h1>
      <p class="dialog">Are you sure you want to leave this page?</p>
      <p class="dialog">The changes will not be saved.</p>
    </template>
    <template #actions>
      <button @click="goBack" class="dialog">YES, LEAVE</button>
      <button class="dialog flat" @click="closeWarning">STAY HERE</button>
    </template>
  </base-dialog>
  <section>
    <header>
      <span class="back" @click="tryGoBack">
        <img
          src="../assets/Frontend_Internship_Test_Slices/ic_back_grey.png"
          alt="+"
          class="img-plus"
        />
        <h2 v-if="!onMobile">Back to overview</h2>
      </span>
      <h1>{{ isEditing ? "Edit Listing" : "Create New Listing" }}</h1>
    </header>
    <form @submit.prevent="postListing">
      <div class="form-input">
        <label for="street-name">Street name*</label>
        <input
          :class="{ invalid: !listingInfo.streetName.isValid }"
          type="text"
          id="street-name"
          placeholder="Enter the street name"
          v-model="listingInfo.streetName.value"
          @input="onlyLetters($event, 'streetName')"
        />
      </div>
      <div class="small-inputs">
        <div class="form-input">
          <label for="house-number">House number*</label>
          <input
            :class="{ invalid: !listingInfo.houseNumber.isValid }"
            type="number"
            min="0"
            step="1"
            id="house-number"
            placeholder="Enter house number"
            v-model="listingInfo.houseNumber.value"
            @input="validateForm"
          />
        </div>
        <div class="form-input">
          <label for="addition">Addition (optional)</label>
          <input
            type="text"
            id="addition"
            placeholder="e.g. A"
            v-model="listingInfo.numberAddition.value"
            @input="validateForm"
          />
        </div>
      </div>
      <div class="form-input">
        <label for="postal-code">Postal code*</label>
        <input
          :class="{ invalid: !listingInfo.zip.isValid }"
          type="text"
          id="postal-code"
          placeholder="e.g. 1000 AA"
          v-model="listingInfo.zip.value"
          @input="validateForm"
        />
      </div>
      <div class="form-input">
        <label for="city">City*</label>
        <input
          :class="{ invalid: !listingInfo.city.isValid }"
          type="text"
          id="city"
          placeholder="Enter the city"
          v-model="listingInfo.city.value"
          @input="onlyLetters($event, 'city')"
        />
      </div>
      <div class="form-input picture">
        <label for="picture">Upload picture (PNG or JPG)*</label>
        <input
          style="display: none"
          type="file"
          id="picture"
          accept="image/png, image/jpeg"
          @change="setPicture"
          ref="picInput"
        />
        <button
          v-show="!listingInfo.picture.value"
          class="upload-button"
          :class="{ invalid: !listingInfo.picture.isValid }"
          @click.prevent="$refs.picInput.click()"
        >
          <img
            src="../assets/Frontend_Internship_Test_Slices/ic_upload.png"
            alt="+"
          />
        </button>
        <div
          v-show="listingInfo.picture.value"
          class="preview-picture-container"
        >
          <img class="preview-picture" ref="previewPicture" alt="" />
          <img
            class="clear-picture"
            src="../assets/Frontend_Internship_Test_Slices/ic_clear_white.png"
            alt="X"
            @click="clearPicture"
          />
        </div>
      </div>
      <div class="form-input">
        <label for="price">Price* ( € ) </label>
        <input
          :class="{ invalid: !listingInfo.price.isValid }"
          type="number"
          id="price"
          placeholder="Enter price"
          v-model="listingInfo.price.value"
          @input="validateForm"
        />
      </div>
      <div class="small-inputs">
        <div class="form-input">
          <label for="size">Size* ( m² )</label>
          <input
            :class="{ invalid: !listingInfo.size.isValid }"
            type="number"
            id="size"
            placeholder="Enter size"
            v-model="listingInfo.size.value"
            @input="validateForm"
          />
        </div>
        <div class="form-input">
          <label for="garage">Garage*</label>
          <select
            :class="{ invalid: !listingInfo.hasGarage.isValid }"
            id="garage"
            name="garage"
            @input="setGarage"
          >
            <option value="select" selected disabled>Select</option>
            <option :value="true" ref="yes">Yes</option>
            <option :value="false" ref="no">No</option>
          </select>
        </div>
      </div>
      <div class="small-inputs">
        <div class="form-input">
          <label for="bedrooms">Bedrooms*</label>
          <input
            :class="{ invalid: !listingInfo.bedrooms.isValid }"
            type="number"
            id="bedrooms"
            placeholder="Enter amount"
            v-model="listingInfo.bedrooms.value"
            @input="validateForm"
          />
        </div>
        <div class="form-input">
          <label for="bathrooms">Bathrooms*</label>
          <input
            :class="{ invalid: !listingInfo.bathrooms.isValid }"
            type="number"
            id="bathrooms"
            placeholder="Enter amount"
            v-model="listingInfo.bathrooms.value"
            @input="validateForm"
          />
        </div>
      </div>
      <div class="form-input">
        <label for="construction-year">Construction year*</label>
        <input
          :class="{ invalid: !listingInfo.constructionYear.isValid }"
          type="text"
          id="construction-year"
          placeholder="e.g. 2001"
          v-model="listingInfo.constructionYear.value"
          @input="validateForm"
        />
      </div>
      <div class="form-input">
        <label for="description">Description*</label>
        <textarea
          :class="{ invalid: !listingInfo.description.isValid }"
          id="description"
          rows="5"
          placeholder="Enter the description"
          v-model="listingInfo.description.value"
          @input="validateForm"
        ></textarea>
      </div>
      <p v-if="!formIsValid" class="invalid-message">Required fields missing</p>
      <button type="submit">{{ isEditing ? "SAVE" : "POST" }}</button>
    </form>
  </section>
</template>

<script>
import { addHouse, createHouse, editHouse, uploadImage } from "../firebase.js";
export default {
  props: ["houseId"],
  data() {
    return {
      listingInfo: {
        constructionYear: {
          value: null,
          required: true,
          isValid: true,
          needsGrouping: false,
        },
        description: {
          value: "",
          required: true,
          isValid: true,
          needsGrouping: false,
        },
        hasGarage: {
          value: "select",
          required: true,
          isValid: true,
          needsGrouping: false,
        },
        picture: {
          value: null,
          required: true,
          isValid: true,
          needsGrouping: false,
        },
        city: {
          value: "",
          required: true,
          isValid: true,
          needsGrouping: true,
        },
        houseNumber: {
          value: null,
          required: true,
          isValid: true,
          needsGrouping: true,
        },
        numberAddition: {
          value: "",
          required: false,
          isValid: true,
          needsGrouping: true,
        },
        streetName: {
          value: "",
          required: true,
          isValid: true,
          needsGrouping: true,
        },
        zip: {
          value: "",
          required: true,
          isValid: true,
          needsGrouping: true,
        },
        price: {
          value: "",
          required: true,
          isValid: true,
          needsGrouping: false,
        },
        bathrooms: {
          value: null,
          required: true,
          isValid: true,
          needsGrouping: true,
        },
        bedrooms: {
          value: null,
          required: true,
          isValid: true,
          needsGrouping: true,
        },
        size: {
          value: "",
          required: true,
          isValid: true,
          needsGrouping: false,
        },
      },
      listingID: "",
      formIsValid: true,
      isEditing: false,
      changesUnsaved: false,
      unsavedWarning: false,
      error: null,
      mounted: false,
    };
  },
  watch: {
    // checking if there are unsaved changes
    listingInfo: {
      handler() {
        if (this.mounted) {
          this.changesUnsaved = true;
        }
      },
      deep: true,
    },
  },
  computed: {
    // addedHouseId() {
    //   return this.$store.getters.addedHouseId;
    // },
    onMobile() {
      return this.$store.getters.onMobile;
    },
    houses() {
      return this.$store.getters.houses;
    },
    currentHouse() {
      // return this.$store.getters.house(this.houseId);
      return this.houses.find((house) => house.id === this.houseId);
    },
  },
  methods: {
    async postListing() {
      // checking form validity
      this.invalidateForm();
      if (!this.formIsValid) return;

      // removing 'required' and 'isValid' props from listingInfo
      // removing picture & adding props that don't need grouping
      const listing = {};
      for (const key in this.listingInfo) {
        if ((key !== "picture") & !this.listingInfo[key].needsGrouping) {
          listing[key] = this.listingInfo[key].value;
        }
      }

      // adding and grouping location & rooms props
      listing.location = {
        city: this.listingInfo.city.value,
        streetName: this.listingInfo.streetName.value,
        houseNumber: this.listingInfo.houseNumber.value,
        zip: this.listingInfo.zip.value,
      };
      listing.rooms = {
        bathrooms: this.listingInfo.bathrooms.value,
        bedrooms: this.listingInfo.bedrooms.value,
      };

      // posting/editing the listing
      try {
        const image = this.listingInfo.picture.value;
        listing.madeByMe = true;
        if (this.isEditing) {
          listing.createdAt = this.currentHouse.createdAt;
          listing.image = image;

          editHouse(this.listingID, listing);
          this.$router.push(`/houses/${this.houseId}`);
        } else {
          listing.createdAt = new Date().toLocaleDateString("de-de");
          listing.image = image;
          addHouse(listing); // uploading data to database
          this.$router.push(`/houses/${this.listingID}`);
        }
      } catch (error) {
        this.error = error.message || "Something went wrong!";
      }
    },
    validateForm() {
      // validating all except garage
      for (const key in this.listingInfo) {
        if (
          this.listingInfo[key].value &&
          this.listingInfo[key].required &&
          key !== "hasGarage"
        )
          this.listingInfo[key].isValid = true;

        this.formIsValid = true;
        for (const key in this.listingInfo) {
          if (!this.listingInfo[key].isValid) {
            this.formIsValid = false;
          }
        }
      }
    },
    invalidateForm() {
      // invalidating garage
      if (this.listingInfo.hasGarage.value === "select")
        this.listingInfo.hasGarage.isValid = false;
      // invalidating the rest
      for (const key in this.listingInfo) {
        if (
          !this.listingInfo[key].value &&
          this.listingInfo[key].required &&
          key !== "hasGarage"
        ) {
          this.listingInfo[key].isValid = false;
          this.formIsValid = false;
        }
      }
    },
    async setPicture(event) {
      const picture = event.target.files[0];
      if (!picture) {
        this.listingInfo.picture.value = null;
        return;
      }
      this.listingInfo.picture.value = picture;
      this.validateForm();
      try {
        this.listingInfo.picture.value = await uploadImage(
          this.listingID,
          picture
        ); // uploading image to cloud storage
        this.setPreviewPicture();
      } catch (e) {
        this.listingInfo.picture.value = null;
        this.validateForm();
        console.error("error uploading image: ", e);
      }
    },
    setGarage(event) {
      this.listingInfo.hasGarage.value = event.target.value;
      this.listingInfo.hasGarage.isValid = true;
      event.target.classList.add("filled-in");
    },
    onlyLetters(event, input) {
      const numbers = /[0-9]/;
      if (numbers.test(event.data)) {
        this.listingInfo[input].value = this.listingInfo[input].value.slice(
          0,
          -1
        );
        console.log("prevented");
        return;
      }
      this.validateForm();
    },
    // noDots(event, input) {
    //   console.log(input);
    //   console.log(this.listingInfo[input].value);
    //   console.log(this.listingInfo.houseNumber.value);
    //   if (event.data === ".") {
    //     this.listingInfo[input].value = this.listingInfo[input].value.slice(
    //       0,
    //       -1
    //     );
    //     return;
    //   }
    //   this.validateForm();
    // },
    setPreviewPicture() {
      const picture = document.querySelector(".preview-picture");
      picture.src = this.listingInfo.picture.value;
    },
    clearPicture(e) {
      const input = e.target.parentElement.previousSibling.previousSibling;
      input.value = "";
      this.listingInfo.picture.value = null;
      this.validateForm();
    },
    tryGoBack() {
      if (this.changesUnsaved) {
        this.unsavedWarning = true;
        return;
      }
      this.goBack();
    },
    goBack() {
      this.$router.back();
      document.body.classList.remove("dialog-open");
    },
    closeWarning() {
      this.unsavedWarning = false;
      document.body.classList.remove("dialog-open");
    },
    closeError() {
      this.error = false;
    },
  },
  created() {
    if (!this.houseId) {
      this.listingID = createHouse();
    } else {
      // setting editing mode
      if (!this.currentHouse) {
        this.$router.push("/houses/create");
      } else {
        this.isEditing = true;
        this.listingID = this.currentHouse.id;
        // setting form
        this.listingInfo.streetName.value =
          this.currentHouse.location.streetName;
        this.listingInfo.houseNumber.value =
          this.currentHouse.location.houseNumber;
        this.listingInfo.numberAddition.value =
          this.currentHouse.location.numberAddition; // should be posted as empty string
        this.listingInfo.zip.value = this.currentHouse.location.zip;
        this.listingInfo.city.value = this.currentHouse.location.city;
        this.listingInfo.picture.value = this.currentHouse.image;
        this.listingInfo.price.value = this.currentHouse.price;
        this.listingInfo.size.value = this.currentHouse.size;
        this.listingInfo.hasGarage.value = this.currentHouse.hasGarage;
        this.listingInfo.bedrooms.value = this.currentHouse.rooms.bedrooms;
        this.listingInfo.bathrooms.value = this.currentHouse.rooms.bathrooms;
        this.listingInfo.constructionYear.value =
          this.currentHouse.constructionYear;
        this.listingInfo.description.value = this.currentHouse.description;
      }
    }
  },
  mounted() {
    // setting form
    if (this.isEditing) {
      this.setPreviewPicture(this.listingInfo.picture.value);
      if (this.listingInfo.hasGarage.value === "true") {
        this.$refs.yes.selected = true;
      } else {
        this.$refs.no.selected = true;
      }
      this.$refs.yes.parentElement.classList.add("filled-in");
    }
    this.mounted = true;
  },
  beforeCreate() {
    // adding class to body for the background image
    document.body.classList.add("create-listing");
  },
  unmounted() {
    document.body.classList.remove("create-listing");
  },
};
</script>

<style scoped>
section {
  max-width: 30rem;
}
header {
  display: flex;
  justify-content: center;
  position: relative;
}
.back {
  margin: 0;
  padding: 0;
  display: inline;
  cursor: pointer;
  position: absolute;
  top: 3px;
  left: 0;
}
h1 {
  margin-right: 50%;
  margin-bottom: 0;
  transform: translateX(50%);
  white-space: nowrap;
}
form {
  width: 100%;
  max-width: 30rem;
  margin-top: 2rem;
}
form .form-input {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}
form input,
form select,
form textarea {
  width: 100%;
  border: none;
  background: var(--background-color-2);
  padding: 1em 1rem;
  border-radius: var(--border-radius);
  resize: none;
}
form select {
  color: var(--tertiary-color);
  /* width: 185px; */
  height: 39px;
  /* height: ; */
}
form select.filled-in {
  color: var(--primary-text-color);
}
form select option {
  color: var(--primary-text-color);
}
form input::placeholder,
form textarea::placeholder {
  color: var(--tertiary-color);
}
form label {
  margin-bottom: 0.5rem;
  font-weight: 700;
  color: var(--secondary-text-color);
}
form .small-inputs {
  display: flex;
  justify-content: space-between;
}
form .small-inputs .form-input {
  flex-shrink: 0;
  margin-right: 1rem;
  width: calc(50% - 0.5rem);
}
form.small-inputs .form-input:first-child {
  margin-right: 1rem;
}
.form-input.picture button {
  width: 7rem;
  height: 7rem;
  background: none;
  border-radius: initial;
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23C3C3C3FF' stroke-width='4' stroke-dasharray='6%2c15' stroke-dashoffset='14' stroke-linecap='square'/%3e%3c/svg%3e");
}
.form-input.picture button.invalid {
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23FF0000FF' stroke-width='4' stroke-dasharray='6%2c15' stroke-dashoffset='14' stroke-linecap='square'/%3e%3c/svg%3e");
  outline: none;
}
.preview-picture-container {
  margin: 1rem 0;
  position: relative;
  height: 7rem;
  width: 7rem;
}
.preview-picture {
  object-fit: cover;
  height: 7rem;
  width: 7rem;
  border-radius: var(--border-radius);
}
.clear-picture {
  position: absolute;
  top: -0.7rem;
  right: -0.7rem;
  cursor: pointer;
}
button {
  margin: 1rem 0;
}
.invalid {
  outline: red 1px solid;
}
.invalid::placeholder {
  color: red;
}
.invalid {
  color: red;
}
.invalid-message {
  font-style: italic;
  color: red;
}
@media screen and (min-width: 1000px) {
  section {
    max-width: var(--max-width);
    margin-bottom: 1rem;
  }
  header {
    flex-direction: column;
  }
  header h1 {
    margin-top: 2rem;
    text-align: left;
  }
  header h2 {
    font-size: 16px;
  }
  .back {
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    width: 11.5rem;
    position: initial;
  }
  .back h2 {
    margin: 0;
    margin-top: 0.1rem;
  }
  .back img {
    margin-right: 0.75rem;
  }
  h1 {
    margin: 0;
    transform: initial;
  }
  form {
    margin-top: 2rem;
  }
  form label {
    font-size: 16px;
  }
  form select {
    height: 46px;
  }
  button {
    width: 50%;
    margin-left: 100%;
    transform: translateX(-100%);
  }
  .form-input.picture button {
    width: 7rem;
    margin-left: 0;
    transform: translateX(0);
  }
  .invalid-message {
    font-size: 12px;
  }
}
/* dialog styles */
h1.dialog,
p.dialog {
  text-align: center;
}
h1.dialog {
  margin-bottom: 1rem;
}
p.dialog {
  margin-top: 0;
  margin-bottom: 0;
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
    margin-bottom: 0.5rem;
  }
  button.dialog {
    font-size: 16px;
    width: 100%;
  }
}
</style>
