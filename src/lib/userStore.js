import { create } from "zustand";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true,
  fetchUserInfo: async (uid) => {
    if(!uid) return set({ currentUser: null, isLoading: false });

    try {
      // We get our data here
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return set({ currentUser: docSnap.data(), isLoading: false });
      } else {
        console.log("No such document!");
        return set({ currentUser: null, isLoading: false });
      }
    } catch (error) {
      
      console.error(error);
      return set({ currentUser: null, isLoading: false });

    }
  }
}));