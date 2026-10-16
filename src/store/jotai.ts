import { atom } from "jotai";
import type { User } from "../component/types";

export const dataAtom = atom<User[]>([
    {
        fullname: "Ali",
        age: 12,
        id: "13",
        avatar: "",
        status: true,
    },
    {
        fullname: "Vali",
        age: 105,
        id: "-2",
        avatar: "",
        status: true,
    }
]);

export const deleteUserAtom = atom(null, (get, set, id: User["id"]) => {
    set(dataAtom, get(dataAtom).filter((user) => user.id !== id));
});

export const addUserAtom = atom(null, (get, set, user: User) => {
    set(dataAtom, [...get(dataAtom), user]);
});