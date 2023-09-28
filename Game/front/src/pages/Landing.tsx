import React from 'react';
import '../css/landing.css';
import NavbarAuth from '../components/NavbarAuth';
import Main  from '../components/Main';

function Landing() {
    return (
        <div>
            <NavbarAuth />
            <Main/>
        </div>
    );
}

export default Landing;