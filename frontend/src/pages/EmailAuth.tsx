import Header from "../components/common/Header";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const EmailAuth = () => {
  const BE_URL = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const sch = location.search;
    const params = new URLSearchParams(sch);
    const id = params.get("id");
    const code = params.get("code");
    //axios
    axios
      .post(`${BE_URL}/users/email-auth`, {
        id: id,
        code: code,
      })
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: res.data.message,
          showConfirmButton: false,
          timer: 1000,
        });
        navigate("/");
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          showConfirmButton: false,
          timer: 1000,
        });
        navigate("/");
      });
  }, []);

  return (
    <div>
      <h4>SYNERGY의 회원이 되신 것을 환영합니다 :) !!</h4>
    </div>
  );
};

export default EmailAuth;
