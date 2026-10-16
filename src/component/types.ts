export interface InitialState {
    data: User[];
    loading: boolean;
    error: string | null;
}

export interface User {
    id: string | number;
    fullname: string;
    age: number;
    avatar: string;
    status: boolean;
}

export type NewUser = Omit<User, "id">;