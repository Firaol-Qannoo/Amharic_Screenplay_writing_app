import React, { useState } from "react";
import { useForm as useReactHookForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "@inertiajs/react"; 
import { Button } from "@/components/ui/button"; // Assuming Button component is used for styling
import { Input } from "@/components/ui/input"; // Assuming Input component is used for styling
import { Label } from "@/components/ui/label"; // Assuming Label component is used for styling
import { Link } from "@inertiajs/react"; // Inertia hooks

// Zod validation schema for Reset Password
const resetPasswordSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters").max(20, "Password can't be more than 20 characters"),
    password_confirmation: z.string().min(6, "Confirm Password must be at least 6 characters").max(20, "Confirm Password can't be more than 20 characters"),
}).superRefine((data, ctx) => {
    if (data.password !== data.password_confirmation) {
        ctx.addIssue({
            path: ['password_confirmation'],
            message: 'Passwords do not match',
            code: z.ZodIssueCode.custom,
        });
    }
});

const ResetPassword = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const email = queryParams.get("email"); // Get email from URL

    const { data, setData, post, errors } = useForm({
        email: email,
        password: "",
        password_confirmation: "",
    });

    const [message, setMessage] = useState("");

    // React Hook Form setup with Zod validation schema
    const { handleSubmit, register, formState: { errors: validationErrors }, setValue } = useReactHookForm({
        resolver: zodResolver(resetPasswordSchema),
        mode: "onChange",
        defaultValues: {
            email: data.email,
            password: data.password,
            password_confirmation: data.password_confirmation,
        },
    });

    const handleFormSubmit = (formData) => {
        setData("password", formData.password);
        setData("password_confirmation", formData.password_confirmation);
        post("/reset-password", {
            onSuccess: () => {
                setMessage("Password reset successfully! Redirecting to login...");
                setTimeout(() => {
                    window.location.href = "/login"; // Redirect to login
                }, 2000);
            },
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center w-full bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Reset your password</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter your new password below to reset your account password.
                    </p>
                </div>
                {message && <p className="text-green-600 text-center">{message}</p>}
                <form onSubmit={handleSubmit(handleFormSubmit)} className="mt-8 space-y-6">
                    <div className="space-y-4 p-8 rounded-md shadow-sm bg-white">
                        {/* New Password */}
                        <div>
                            <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                New Password
                            </Label>
                            <Input
                                {...register("password")}
                                id="password"
                                name="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                                required
                                className="mt-1"
                                placeholder="New password"
                            />
                            <p className="text-red-600 text-sm">
                                {validationErrors.password?.message || errors.password}
                            </p>
                        </div>

                        {/* Confirm New Password */}
                        <div>
                            <Label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                                Confirm New Password
                            </Label>
                            <Input
                                {...register("password_confirmation")}
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData("password_confirmation", e.target.value)}
                                required
                                className="mt-1"
                                placeholder="Confirm new password"
                            />
                            <p className="text-red-600 text-sm">
                                {validationErrors.password_confirmation?.message || errors.password_confirmation}
                            </p>
                        </div>
                    </div>

                    <div>
                        <Button type="submit" className="w-full" disabled={false}>
                            Reset Password
                        </Button>
                    </div>

                    <div className="text-center text-sm">
                        <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
                            Back to login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;