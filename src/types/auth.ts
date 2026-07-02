export type UserCredentials = {
  email: string;
  password: string;
};

export type RegisterData = {
  email: string;
  password: string;
  name: string;
};

export interface UserData {
  email: string;
  name: string;
}

export interface StoredUser extends UserData {
  password: string;
}

export type UsersRegistry = Record<string, StoredUser>;
