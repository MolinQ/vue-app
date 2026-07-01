import type { UserCrenentials } from "@/types/auth";
import { HttpService } from "./HttpService";
import { LocalStorageService } from "./StorageService";
import { localStorageVariables } from "@/constants/storageVariables";

export class AuthService extends HttpService {
  private storage: LocalStorageService;

  constructor() {
    super();
    this.storage = new LocalStorageService();
  }

  async logIn(data: UserCrenentials) {
    if (!data.email && !data.password) return;
    const key = crypto.randomUUID();
    this.storage.set(localStorageVariables.KEY, key);
    this.storage.set(localStorageVariables.USER_DATA, {
      name: "admmin",
      email: "admin@gmail.com",
    });
  }
}
