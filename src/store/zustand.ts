
import axios from "axios";
import { create } from "zustand";
import type { NewUser, User } from "../component/types";
import { api } from "../utilit/app";

interface DataState {
  data: User[];
  loading: boolean;
  error: string | null;
  get: () => Promise<void>;
  postUser: (newUser: NewUser) => Promise<void>;
  updateUser: (id: User["id"], user: NewUser) => Promise<void>;
  deleteUser: (id: User["id"]) => Promise<void>;
  clearError: () => void;
}

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback;

export const useData = create<DataState>((set) => ({
  data: [],
  loading: false,
  error: null,
  clearError: () => set({ error: null }),
  get: async () => {
    set({ loading: true, error: null });

    try {
      const response = await axios.get<User[]>(api);
      set({
        data: response.data,
        loading: false,
      });
    } catch (error) {
      set({
        error: getErrorMessage(error, "Failed to fetch users"),
        loading: false,
      });
    }
  },

  postUser: async (newUser) => {
    set({ error: null });

    try {
      const response = await axios.post<User>(api, newUser);
      set((state) => ({ data: [...state.data, response.data] }));
    } catch (error) {
      set({
        error: getErrorMessage(error, "Failed to add user"),
      });
      throw error;
    }
  },
  updateUser: async (id, user) => {
    set({ error: null });

    try {
      const response = await axios.put<User>(`${api}/${id}`, user);
      set((state) => ({
        data: state.data.map((currentUser) =>
          currentUser.id === id ? response.data : currentUser
        ),
      }));
    } catch (error) {
      set({
        error: getErrorMessage(error, "Failed to update user"),
      });
      throw error;
    }
  },
  deleteUser: async (id) => {
    set({ error: null });

    try {
      await axios.delete(`${api}/${id}`);
      set((state) => ({
        data: state.data.filter((user) => user.id !== id),
      }));
    } catch (error) {
      set({
        error: getErrorMessage(error, "Failed to delete user"),
      });
      throw error;
    }
  },
}));
