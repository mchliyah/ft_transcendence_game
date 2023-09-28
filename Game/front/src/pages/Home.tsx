import '../css/landing.css';
import '../css/sidebar.css';
import React from 'react';
import Sidebar from '../components/Sidebar';
import NavbarSearch from '../components/NavbarSearch';

function Home() {
    return (
        <div>
            <NavbarSearch />
            <Sidebar />
        </div>
    );
}

export default Home;