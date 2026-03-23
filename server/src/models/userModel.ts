import { User } from "../types";

const users: User[] = [];

export const findAll = (): User[] => users;

export const findById = (id: string): User | undefined =>
  users.find((u) => u.id === id);

export const findByEmail = (email: string): User | undefined =>
  users.find((u) => u.email === email);

export const create = (user: User): User => {
  users.push(user);
  return user;
};

export const deleteById = (id: string): boolean => {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return false;
  users.splice(index, 1);
  return true;
};
