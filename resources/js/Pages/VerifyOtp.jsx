import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import "./VerifyOtp.css";
import { Link } from "@inertiajs/react"; // Changed from react-router-dom

const VerifyOtp = () => {
    const queryParams = new URLSearchParams(window.location.search);
    const email = queryParams.get("email"); // Get email from URL

    const { data, setData, post, errors } = useForm({ email: email, otp: "" });
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/verify-otp", {
            onSuccess: () => {
                setMessage("OTP verified successfully!");
                setTimeout(() => {
                    window.location.href = `/reset-password?email=${email}`; // Redirect to reset password
                }, 2000);
            },
        });
    };


    const handleResend = (e) => {
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
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                     Verify OTP</h1>
                               <p className="text-sm text-gray-600">Enter the OTP sent to your email: <strong>{email}</strong></p>
            {message && <p className="success">{message}</p>}
            <form onSubmit={handleSubmit}>
                <label>OTP</label>
                <input
                    type="text"
                    name="otp"
                    value={data.otp}
                    onChange={(e) => setData("otp", e.target.value)}
                />
                {errors.otp && <p className="error">{errors.otp}</p>}
                <button type="submit">Verify OTP</button>
            </form>
            <div className="text-center text-sm">
            Didn&apos;t receive a code?{" "}
            <button  onClick={handleResend}
            type="button" className="font-medium text-primary hover:text-primary/90">
              Resend
            </button>
          </div>
          <div className="text-center text-sm">
            <Link to={'/login'} className="font-medium text-primary hover:text-primary/90">
              Back to login
            </Link>
          </div>
        </div>
       </div>
    );
};

export default VerifyOtp;
