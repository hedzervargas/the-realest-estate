import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref as reference,
  uploadBytes,
} from "firebase/storage";
import { ref } from "vue";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHL_o1mX7ObPQ2mK4VlpsfRLkvZZSD7Qs",
  authDomain: "real-estate-ee502.firebaseapp.com",
  projectId: "real-estate-ee502",
  storageBucket: "real-estate-ee502.appspot.com",
  messagingSenderId: "513771727036",
  appId: "1:513771727036:web:6b40cdf4b99729dc6b08b9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// initialize firestore
const db = getFirestore(app);
const houseCollection = collection(db, "houses");

// stop realtime updates
export let stopRealtime = null;

// read houses (realtime)
export const readHouses = () => {
  const houses = ref([]);
  stopRealtime = onSnapshot(houseCollection, (snapshot) => {
    houses.value = snapshot.docs.map((house) => ({
      id: house.id,
      ...house.data(),
    }));
  });
  return houses;
};

// create house reference
let newHouseRef = null;

export const createHouse = () => {
  newHouseRef = doc(houseCollection);
  console.log("ref created");
  return newHouseRef.id;
};

// add house
export const addHouse = async (listing) => {
  try {
    // const docRef = await addDoc(houseCollection, listing);
    await setDoc(newHouseRef, listing);
    console.log("Document written with ID: ", newHouseRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
  newHouseRef = null;
};

// delete house
export const useDeleteHouse = async (id) => {
  try {
    await deleteImage(id);
    await deleteDoc(doc(houseCollection, id));
    console.log("Succesfully deleted");
  } catch (e) {
    console.error("Error deleting document: ", e);
  }
};

// update house
export const editHouse = async (id, listing) => {
  await setDoc(doc(houseCollection, id), listing);
  console.log("updated");
};

// initialize cloud storage
const storage = getStorage();

// upload image
export const uploadImage = async (id, file) => {
  const imageRef = reference(storage, `images/${id}`);

  try {
    await uploadBytes(imageRef, file); // uploading
    console.log("uploaded file");
    const response = await getImageURL(imageRef); // getting url
    return response;
  } catch (e) {
    console.error("error uploading file: ", e);
  }
};

// get url
const getImageURL = async (imageRef) => {
  try {
    const response = await getDownloadURL(imageRef);
    return response;
  } catch (e) {
    console.error("error getting url: ", e);
  }
};

// delete image
const deleteImage = async (id) => {
  const imageRef = reference(storage, `images/${id}`);
  try {
    await deleteObject(imageRef);
  } catch (e) {
    console.log("error deleting image: ", e);
  }
};
