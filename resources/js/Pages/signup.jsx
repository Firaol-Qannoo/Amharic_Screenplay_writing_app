import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import "./signup.css";

const Signup = () => {
    const { data, setData, post, errors } = useForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/register"); // Send data to Laravel backend
    };

    return (
        <div className="signup-container">
            <h2 className="signup-heading">Signup</h2>
            <form className="signup-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                        type="text"
                        name="firstName"
                        value={data.firstName}
                        onChange={handleChange}
                        className="form-input"
                    />
                    {errors.firstName && <p className="error">{errors.firstName}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                        type="text"
                        name="lastName"
                        value={data.lastName}
                        onChange={handleChange}
                        className="form-input"
                    />
                    {errors.lastName && <p className="error">{errors.lastName}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                        className="form-input"
                    />
                    {errors.email && <p className="error">{errors.email}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={data.password}
                        onChange={handleChange}
                        className="form-input"
                    />
                    {errors.password && <p className="error">{errors.password}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="password_confirmation">Confirm Password</label>
                    <input
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        onChange={handleChange}
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <button type="submit" className="signup-button">Sign Up</button>
                </div>
            </form>

            <p className="redirect-link">
                Already have an account? <a href="/login" className="link">Login</a>
            </p>
        </div>
    );
};

export default Signup;