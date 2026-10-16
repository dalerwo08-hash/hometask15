
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useData } from "../store/zustand";
import AddDialog from "./AddDialog";
import type { User } from "./types";

const Catalog = () => {
    const data = useData((state) => state.data);
    const loading = useData((state) => state.loading);
    const error = useData((state) => state.error);
    const get = useData((state) => state.get);
    const removeUser = useData((state) => state.deleteUser);

    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [detailsUser, setDetailsUser] = useState<User | null>(null);
    const [deletingId, setDeletingId] = useState<User["id"] | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    useEffect(() => {
        get();
    }, [get]);

    const handleDelete = async (user: User) => {
        setDeletingId(user.id);
        setActionError(null);
        try {
            await removeUser(user.id);
        } catch (deleteError) {
            setActionError(
                deleteError instanceof Error
                    ? deleteError.message
                    : "Failed to delete user"
            );
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 md:p-10">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Users
                    </h1>

                    <Button
                        variant="contained"
                        onClick={() => {
                            setSelectedUser(null);
                            setOpen(true);
                        }}
                    >
                        Add User
                    </Button>
                </div>

                {actionError && (
                    <Alert className="mb-4" severity="error">
                        {actionError}
                    </Alert>
                )}

                {loading ? (
                    <div className="flex justify-center py-16">
                        <CircularProgress />
                    </div>
                ) : error && data.length === 0 ? (
                    <Alert severity="error" action={
                        <Button color="inherit" size="small" onClick={() => void get()}>
                            Retry
                        </Button>
                    }>
                        {error}
                    </Alert>
                ) : data.length === 0 ? (
                    <p className="text-center text-gray-500">
                        Ҳоло корбар нест. Add User-ро пахш кун.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {data.map((el) => (
                            <div
                                key={el.id}
                                className="rounded-2xl bg-white p-5 shadow-md transition hover:shadow-lg"
                            >
                                <img
                                    className="mb-4 h-32 w-32 rounded-full object-cover"
                                    src={el.avatar || "https://placehold.co/128"}
                                    alt={el.fullname}
                                />

                                <h2 className="text-xl font-semibold text-gray-800">
                                    {el.fullname}
                                </h2>

                                <p className="mt-2 text-gray-600">
                                    Age: {el.age}
                                </p>

                                <span
                                    className={`mt-3 inline-block rounded-full px-3 py-1 text-sm ${el.status
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {el.status ? "Active" : "Inactive"}
                                </span>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() => setDetailsUser(el)}
                                    >
                                        Info
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        onClick={() => {
                                            setSelectedUser(el);
                                            setOpen(true);
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="small"
                                        color="error"
                                        variant="outlined"
                                        disabled={deletingId === el.id}
                                        onClick={() => void handleDelete(el)}
                                    >
                                        {deletingId === el.id ? "Deleting..." : "Delete"}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <AddDialog
                    open={open}
                    setOpen={setOpen}
                    user={selectedUser}
                />
                <Dialog
                    open={detailsUser !== null}
                    onClose={() => setDetailsUser(null)}
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle>User Information</DialogTitle>
                    <DialogContent className="flex flex-col gap-3">
                        {detailsUser && (
                            <>
                                <img
                                    className="h-32 w-32 rounded-full object-cover"
                                    src={detailsUser.avatar || "https://placehold.co/128"}
                                    alt={detailsUser.fullname}
                                />
                                <p><strong>Name:</strong> {detailsUser.fullname}</p>
                                <p><strong>Age:</strong> {detailsUser.age}</p>
                                <p><strong>Status:</strong> {detailsUser.status ? "Active" : "Inactive"}</p>
                                <p><strong>ID:</strong> {detailsUser.id}</p>
                                <p><strong>Avatar URL:</strong> {detailsUser.avatar || "Not provided"}</p>
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDetailsUser(null)}>Close</Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
};

export default Catalog;
