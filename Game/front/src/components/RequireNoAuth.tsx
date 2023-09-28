import client from "./Client";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RequireNoAuth = (props : any) => {
    const navigate = useNavigate();
    const [isLoggedOut, setIsLoggedOut] = useState(false);
    useEffect(() => {
        const checkAuthentication = () => {
            if (localStorage.getItem('token') == null)
            {
                setIsLoggedOut(true);
            }
            else
            {
                navigate('/home');
            }
        }
        checkAuthentication();
    }, [navigate])
    if (isLoggedOut)
    {
        return (
        <React.Fragment>{props.children}</React.Fragment>
    )
    }
    else
    {
        return null;
    }
    
}

export default RequireNoAuth;