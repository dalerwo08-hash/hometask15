import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { InitialState, User } from "../component/types";
import axios from "axios";
import { api } from "../utilit/app";

const getErrorMessage = (error: unknown) =>
    error instanceof Error ? error.message : "Something went wrong";

export const getUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
    "data/getUsers",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get<User[]>(api);
            return data;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

export const deleteUser = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>("data/deleteUser", async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`${api}/${id}`);
        return id;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error));
    }
});

const initialState: InitialState = {
    data: [],
    loading: false,
    error: null,
};

export const dataSlice = createSlice({
    name: "data",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(getUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })

            .addCase(getUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? action.error.message ?? "Error";
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.data = state.data.filter(
                    (user) => String(user.id) !== action.payload
                );
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.error = action.payload ?? action.error.message ?? "Error";
            });
    },
});

export default dataSlice.reducer;