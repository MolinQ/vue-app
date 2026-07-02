import { defineStore } from "pinia";
import { storageKeys } from "@/constants/storageVariables";
import { storage } from "@/services/LocalDbStorage";
import type {
  RegisterData,
  StoredUser,
  UserCredentials,
  UserData,
  UsersRegistry,
} from "@/types/auth";

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    currentUser: null as UserData | null,
    isAuthenticated: false,
    isInitialized: false,
  }),

  actions: {
    async getUsersRegistry(): Promise<UsersRegistry> {
      return (await storage.get<UsersRegistry>(storageKeys.USERS)) ?? {};
    },

    async saveUsersRegistry(users: UsersRegistry) {
      await storage.set(storageKeys.USERS, users);
    },

    async init() {
      const sessionKey = await storage.get<string>(storageKeys.SESSION_KEY);
      const user = await storage.get<UserData>(storageKeys.USER_PROFILE);

      if (sessionKey && user) {
        this.currentUser = user;
        this.isAuthenticated = true;
      }

      this.isInitialized = true;
    },

    async register(data: RegisterData) {
      const email = data.email.trim().toLowerCase();
      const users = await this.getUsersRegistry();

      if (users[email]) {
        throw new AuthError("User with this email already exists");
      }

      const newUser: StoredUser = {
        email,
        name: data.name.trim(),
        password: data.password,
      };

      users[email] = newUser;
      await this.saveUsersRegistry(users);
      await this.createSession(newUser);
    },

    async login(credentials: UserCredentials) {
      const email = credentials.email.trim().toLowerCase();
      const users = await this.getUsersRegistry();
      const user = users[email];

      if (!user) {
        throw new AuthError("User with this email is not registered");
      }

      if (user.password !== credentials.password) {
        throw new AuthError("Invalid password");
      }

      await this.createSession(user);
    },

    async createSession(user: UserData) {
      const sessionKey = crypto.randomUUID();
      const profile: UserData = {
        email: user.email,
        name: user.name,
      };

      await storage.set(storageKeys.SESSION_KEY, sessionKey);
      await storage.set(storageKeys.USER_PROFILE, profile);

      this.currentUser = profile;
      this.isAuthenticated = true;
    },

    async logout() {
      await storage.remove(storageKeys.SESSION_KEY);
      await storage.remove(storageKeys.USER_PROFILE);

      this.currentUser = null;
      this.isAuthenticated = false;
    },

    async updateDisplayName(name: string) {
      if (!this.currentUser) return;

      const updatedUser: UserData = { ...this.currentUser, name };
      const users = await this.getUsersRegistry();
      const storedUser = users[updatedUser.email];

      if (storedUser) {
        users[updatedUser.email] = { ...storedUser, name };
        await this.saveUsersRegistry(users);
      }

      await storage.set(storageKeys.USER_PROFILE, updatedUser);
      this.currentUser = updatedUser;
    },
  },
});
