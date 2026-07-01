import { localStorageVariables } from "@/constants/storageVariables";
import { LocalStorageService } from "@/services/StorageService";
import { defineStore } from "pinia";

interface UserData {
  email: string;
  name: string;
}

export const UserInfoStore = defineStore("user_info", {
  state: () => ({
    userData: {} as UserData,
  }),

  actions: {
    getUserInfo() {
      const storageService = new LocalStorageService();

      const data = storageService.get(localStorageVariables.USER_DATA);

      if (!data) return;

      this.userData = JSON.parse(data);
    },

    removeUserInfo() {
      this.userData = {} as UserData;
    },

    setUserInfo(data: UserData) {
      this.userData = data;
    },
  },
});
