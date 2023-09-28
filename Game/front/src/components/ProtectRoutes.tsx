import client from "./Client";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectRoutes = (props: any) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await client.get('/auth/me', {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        });
        if (response.status === 200) {
          setIsLoggedIn(true);
        } else {
          navigate('/login');
        }
      } catch (error) {
        // console.log("Erroe",error);
        navigate('/login');
      }
    };

    checkAuthentication();
  },[navigate]);

  if (isLoggedIn) {
    return <React.Fragment>{props.children}</React.Fragment>;
  } else {
    return null;
  }
};

export default ProtectRoutes;
