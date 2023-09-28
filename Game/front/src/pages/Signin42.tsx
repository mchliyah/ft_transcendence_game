import { error } from "console";
import User from "../components/User";
import { useLocation, useNavigate } from "react-router-dom";

const Signin42 = () => {
    const navigate = useNavigate();
    const location = useLocation();
    console.log(location);
    const token = location.search.split('=')[1];
    console.log(token);
    localStorage.setItem('token', token);
    User()
    .then((res) => {
        console.log("User", res);
        console.log("Password", res.isPasswordRequired);
        if (res.isPasswordRequired === true)
        {
            navigate('/set-password');
        }
        else
        {
            navigate('/home');
        }
    })
    .catch((error) => {
        console.log("Error", error);
        navigate('/');
    })
    return (
        <div>
            
        </div>
    );
};

export default Signin42;