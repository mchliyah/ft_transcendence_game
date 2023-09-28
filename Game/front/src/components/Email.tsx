import client from "./Client";
import { useLocation } from "react-router-dom";

const Email = async () => {
    const location = useLocation();
    console.log(location);
    const token = location.search.split('=')[1];
    console.log(token);
    const response = await client.get("/auth/confirm-email?token=" + token);
    console.log("STATUS", response.status);
    // if (response.status === 200) {
    //     console.log("Email confirmed");
    // } else {
    //     console.log("Email not confirmed");
    // }
    return null;
};

export default Email;