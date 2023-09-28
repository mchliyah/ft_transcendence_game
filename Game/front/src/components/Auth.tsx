import React from 'react';
import { Outlet, Link } from "react-router-dom";

const Auth = () => {
    return (
        <div className="auth">
              <Link to="/login">Sign In</Link>
              <Link to="/register">Sign Up</Link>
        </div>
    );
}
export default Auth;