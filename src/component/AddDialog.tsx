
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useData } from "../store/zustand";
import type { NewUser, User } from "./types";

interface AddDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    user: User | null;
}

interface UserForm {
    fullname: string;
    age: number;
    avatar: string;
    status: string;
}

const AddDialog = ({ open, setOpen, user }: AddDialogProps) => {
    const postUser = useData((state) => state.postUser);
    const updateUser = useData((state) => state.updateUser);
    const storeError = useData((state) => state.error);
    const clearError = useData((state) => state.clearError);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UserForm>({
        defaultValues: { fullname: "", avatar: "", status: "true" },
    });

    useEffect(() => {
        if (!open) return;

        clearError();
        setSubmitError(null);
        reset({
            fullname: user?.fullname ?? "",
            age: user?.age,
            avatar: user?.avatar ?? "",
            status: user?.status === false ? "false" : "true",
        });
    }, [clearError, open, reset, user]);

    const saveUser = async (data: UserForm) => {
        const newUser: NewUser = {
            fullname: data.fullname.trim(),
            age: data.age,
            avatar: data.avatar,
            status: data.status === "true",
        };

        try {
            if (user) {
                await updateUser(user.id, newUser);
            } else {
                await postUser(newUser);
            }
            reset();
            setOpen(false);
        } catch (error) {
            setSubmitError(
                error instanceof Error ? error.message : "Failed to save user"
            );
        }
    };

    const error = submitError ?? storeError;

    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>{user ? "Edit User" : "Add User"}</DialogTitle>

            <form onSubmit={handleSubmit(saveUser)}>
                <DialogContent className="flex flex-col gap-4">
                    {error && <Alert severity="error">{error}</Alert>}
                    <TextField
                        label="Full Name"
                        fullWidth
                        {...register("fullname", {
                            required: "Name is required",
                            validate: (value) =>
                                value.trim() !== "" || "Name is required",
                        })}
                        error={!!errors.fullname}
                        helperText={errors.fullname?.message}
                    />

                    <TextField
                        label="Age"
                        type="number"
                        fullWidth
                        {...register("age", {
                            required: "Age is required",
                            valueAsNumber: true,
                            validate: (value) =>
                                Number.isFinite(value) || "Enter a valid age",
                            min: {
                                value: 1,
                                message: "Age must be at least 1",
                            },
                        })}
                        error={!!errors.age}
                        helperText={errors.age?.message}
                    />

                    <TextField
                        label="Avatar URL"
                        fullWidth
                        {...register("avatar", {
                            required: "Image URL is required",
                        })}
                        error={!!errors.avatar}
                        helperText={errors.avatar?.message}
                    />

                    <select
                        className="border rounded-lg p-3"
                        {...register("status")}
                    >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </DialogContent>

                <DialogActions className="p-4">
                    <Button onClick={() => setOpen(false)} color="inherit">
                        Cancel
                    </Button>
                    <Button type="submit" variant="contained">
                        {user ? "Save Changes" : "Add User"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default AddDialog;