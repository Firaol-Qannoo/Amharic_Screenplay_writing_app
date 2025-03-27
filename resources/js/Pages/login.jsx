
import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import "./login.css";

const Login = ({ success }) =>{
    const { data, setData, post, errors } = useForm({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/login");
    };

    const handleGoogleLogin = () => {
        window.location.href = "/auth/google"; // Redirect to Laravel Google login
    };

    const [isVisible, setIsVisible] = useState(false);
        const [isHidden, setIsHidden] = useState(false);
    
        useEffect(() => {
            if (success) {
                setIsVisible(true); // Show the success message
                setTimeout(() => {
                    setIsVisible(false); // After 3 seconds, start hiding it
                    setTimeout(() => setIsHidden(true), 500); // After another 0.5s, hide it completely
                }, 3000); // Hide the message after 3 seconds
            }
        }, [success]);

    return (     
        <div className="login-container">
             {/* Display the success message if it exists */}
             {success && !isHidden && (
                <div className={`success-message ${isVisible ? 'show' : ''} ${isHidden ? 'hide' : ''}`}>
                    {success}
                </div>
            )}
            <h2 className="login-heading">Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
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
                    <button type="submit" className="login-button">Login</button>
                </div>
            </form>

            {/* Google Login Button */}
            <GoogleOAuthProvider clientId="304333585377-5llja3fa2fdhkkm02sgo5u4ng0je7su1.apps.googleusercontent.com">
                <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => console.log("Google Login Failed")}
                />
            </GoogleOAuthProvider>

            <p className="redirect-link">
                Don't have an account? <a href="/signup" className="link">Sign Up</a>
            </p>
        </div>
    );
};

export default Login;