import { useEffect } from "react";
import { useNavigate } from "react-router";
import axios from 'axios'

const Logout = () => {

    const BE_URL = process.env.REACT_APP_BACKEND_URL;
    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem("access-token")){
            axios
            .post(`${BE_URL}/auth/logout`, JSON.stringify({
                accessToken : localStorage.getItem("access-token")
            }))
                .then(() => {
                console.log("로그아웃 성공");
            })

            localStorage.removeItem("access-token");
            navigate("/");
        }
    }, []);

  return (
    <div>
    </div>
  );
};

export default Logout;