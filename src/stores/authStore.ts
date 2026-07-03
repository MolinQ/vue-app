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

const DEFAULT_ADMIN: StoredUser = {
  login: "admin",
  name: "Admin",
  password: "admin123",
};

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
    normalizeLogin(login: string) {
      return login.trim().toLowerCase();
    },

    async getUsersRegistry(): Promise<UsersRegistry> {
      return (await storage.get<UsersRegistry>(storageKeys.USERS)) ?? {};
    },

    async saveUsersRegistry(users: UsersRegistry) {
      await storage.set(storageKeys.USERS, users);
    },

    async ensureDefaultAdmin() {
      const users = await this.getUsersRegistry();
      const adminLogin = this.normalizeLogin(DEFAULT_ADMIN.login);

      if (!users[adminLogin]) {
        users[adminLogin] = DEFAULT_ADMIN;
        await this.saveUsersRegistry(users);
      }
    },

    isValidUserData(user: UserData | null | undefined): user is UserData {
      return Boolean(user?.login && user?.name);
    },

    async resolveUserProfile(
      profile: Partial<UserData>,
    ): Promise<UserData | null> {
      if (this.isValidUserData(profile as UserData)) {
        return profile as UserData;
      }

      const users = await this.getUsersRegistry();
      const registryUsers = Object.values(users);

      if (profile.name) {
        const matches = registryUsers.filter((user) => user.name === profile.name);
        const matchedUser = matches[0];

        if (matches.length === 1 && matchedUser) {
          return { login: matchedUser.login, name: matchedUser.name };
        }
      }

      if (registryUsers.length === 1) {
        const user = registryUsers[0];

        if (user) {
          return { login: user.login, name: user.name };
        }
      }

      return null;
    },

    async init() {
      await this.ensureDefaultAdmin();

      const sessionKey = await storage.get<string>(storageKeys.SESSION_KEY);
      const storedProfile = await storage.get<Partial<UserData>>(
        storageKeys.USER_PROFILE,
      );

      if (sessionKey && storedProfile) {
        const user = await this.resolveUserProfile(storedProfile);

        if (user) {
          if (
            storedProfile.login !== user.login ||
            storedProfile.name !== user.name
          ) {
            await storage.set(storageKeys.USER_PROFILE, user);
          }

          this.currentUser = user;
          this.isAuthenticated = true;
        } else {
          await this.logout();
        }
      }

      this.isInitialized = true;
    },

    async register(data: RegisterData) {
      const login = this.normalizeLogin(data.login);
      const users = await this.getUsersRegistry();

      if (users[login]) {
        throw new AuthError("User with this login already exists");
      }

      const newUser: StoredUser = {
        login,
        name: data.name.trim(),
        password: data.password,
      };

      users[login] = newUser;
      await this.saveUsersRegistry(users);
      await this.createSession(newUser);
    },

    async login(credentials: UserCredentials) {
      const login = this.normalizeLogin(credentials.login);
      const users = await this.getUsersRegistry();
      const user = users[login];

      if (!user) {
        throw new AuthError("User with this login is not registered");
      }

      if (user.password !== credentials.password) {
        throw new AuthError("Invalid password");
      }

      await this.createSession(user);
    },

    async createSession(user: UserData) {
      const sessionKey = crypto.randomUUID();
      const profile: UserData = {
        login: user.login,
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
      if (!this.isValidUserData(this.currentUser)) return;

      const updatedUser: UserData = { ...this.currentUser, name };
      const users = await this.getUsersRegistry();
      const storedUser = users[updatedUser.login];

      if (storedUser) {
        users[updatedUser.login] = { ...storedUser, name };
        await this.saveUsersRegistry(users);
      }

      await storage.set(storageKeys.USER_PROFILE, updatedUser);
      this.currentUser = updatedUser;
    },
  },
});
