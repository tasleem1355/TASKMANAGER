import { UserType } from "../types/user";

export const saveUser = (user: UserType) => {
  localStorage.setItem(
    "studentUser",
    JSON.stringify(user)
  );
};

export const getUser = () => {
  const user = localStorage.getItem("studentUser");

  return user ? JSON.parse(user) : null;
};

export const logoutUser = () => {
  localStorage.removeItem("studentUser");
};