import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
// import "./forgetpassword.css";
import { Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";

const ForgotPassword = ({ success }) => {
    const { data, setData, post, processing, errors } = useForm({ email: "" });
    const [message, setMessage] = useState(success || "");

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/forgot-password", {
            onSuccess: () => {
                setMessage("OTP has been sent to your email.");
                setTimeout(() => {
                    window.location.href = `/verify-otp?email=${data.email}`;
                }, 2000);
            },
        });
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        Forgot your password?
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter your email address and we&apos;ll send you an OTP to reset your password.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4 rounded-md p-8 shadow-sm bg-white">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Email address"
                                required
                            />
                            {errors.email && <p className="text-red-600 self-start text-sm">{errors.email}</p>}
                        </div>
                    </div>

                    <div>
                       <Button type="submit" className="w-full" disabled={processing}>
                                     {processing ? "Sending..." : "Send Reset Link"}
                                   </Button>
                    </div>

                    {message && <p className="text-green-600 text-center">{message}</p>}

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

export default ForgotPassword;
