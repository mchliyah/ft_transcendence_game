import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import User from './User';
import Protection from './Protection';

// const ProtectPassword = (props: any) => {
//   const navigate = useNavigate();
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isPasswordRequired, setIsPasswordRequired] = useState(false);

//   useEffect(() => {
//     const checkAuthentication = async () => {
//       try {
//         const response = await User();
//         if (response !== null) {
//           setIsLoggedIn(true);
//           setIsPasswordRequired(response.isPasswordRequired);
//           console.log("Password", response.isPasswordRequired);
//         } else {
//           navigate('/');
//         }
//       } catch (error) {
//         navigate('/');
//       }
//     };

//     checkAuthentication();
//   },[navigate]);

//   if (isLoggedIn)
//   {
//     if (isPasswordRequired)
//     {
//       return <React.Fragment>{props.children}</React.Fragment>;
//     }
//     else
//     {
//       navigate('/home');
//     }
//     return null;
//   }
//   else
//   {
//     return null;
//   }
// };

// export default ProtectPassword;


const ProtectPassword = (props: any) =>
{
  return (
  <Protection name="password" />);
}
      
export default ProtectPassword;