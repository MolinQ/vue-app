export type UserCredentials = {
  login: string;
  password: string;
};

export type RegisterData = {
  login: string;
  password: string;
  name: string;
};

export interface UserData {
  login: string;
  name: string;
}

export interface StoredUser extends UserData {
  password: string;
}

export type UsersRegistry = Record<string, StoredUser>;
