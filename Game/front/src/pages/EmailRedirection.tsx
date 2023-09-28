import { Link, useNavigate } from 'react-router-dom';
import '../css/login.css';
import client from "../components/Client";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useToast } from '@chakra-ui/react';


function EmailRedirection() {
    let navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();
    const Email = async () => {
    const token = location.search.split('=')[1];
        try {

        const response = await client.get("/auth/confirm-email?token=" + token);                 
        if (response.status === 200) {
            toast({
                title: 'Email Confirmed.',
                description: "Your email address has been successfully verified.",
                status: 'success',
                duration: 9000,
                isClosable: true,
                position: "bottom-right",
              })
            // navigate('/login');
            navigate('/complete-profile');
        }
        }
        catch (error : any) {
            const errorMessage = error.response.data.message;
            const errorStatus = error.response.status;
            if (errorMessage === 'email already confirmed' && errorStatus === 403)
            {
                // navigate('/home');
                toast({
                    title: 'Email already Confirmed.',
                    description: "Your email address has been already verified.",
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                    position: "bottom-right",
                  })
                navigate('/login');
            }
            else
            {
                toast({
                    title: 'Resend Email.',
                    description: "An error occured during verification get an other email.",
                    status: 'success',
                    duration: 9000,
                    isClosable: true,
                    position: "bottom-right",
                  })
                navigate('/confirm-email');
            }
        }
    };
    useEffect(() => {
const timer = setTimeout(() => {
    Email();
  }, 500);

  return () => {
    clearTimeout(timer);
  };
}, [navigate]);
    return (
        <></>
    );
}

export default EmailRedirection;