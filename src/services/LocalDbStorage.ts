import { createStore, get, set, del } from "idb-keyval";

const store = createStore("movie-app-db", "app-data");

export const storage = {
  async set<T>(key: string, value: T) {
    return set(key, value, store);
  },

  async get<T>(key: string) {
    return get<T>(key, store);
  },

  async remove(key: string) {
    return del(key, store);
  },
};
