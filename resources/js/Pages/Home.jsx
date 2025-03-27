import React from "react";
import { Link } from '@inertiajs/react';

export default function Home({ name }) {
    return (
        <div>
            <h1>Welcome!</h1>
            {/* Render the Signup form below the welcome message */}
            <Link href="/login">Get Started</Link>
        </div>
    );
}
