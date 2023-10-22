import React, { useEffect } from "react";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
import userImg from "../../assets/user.svg";

const Header = () => {

    const [user, loading] = useAuthState(auth);
    const navigate = useNavigate();

    useEffect(() => {
        if(user) {
            navigate("/dashboard");
        }

    }, [user, loading])

    function logoutFun() {
        try {
            signOut(auth)
            .then(() => {
                // Sign-out successful.
                navigate("/");
                toast.success("Logged Out Successfully!");
            }).catch((error) => {
                // An error happened.
                toast.error(error.message);
            });
        }
        catch(e) {
            toast.error(e.message);
        }
    }

    return (
        <div className="navbar">
            <p className="logo">Financly.</p>
            {
                user && (
                    <div style={{display:"flex", alignItems:"center", gap:"0.85rem"}}>
                        <img src={user.photoURL ? user.photoURL : userImg} style={{height:"1.5rem", width:"1.5rem"}} />
                        <p className="logo link" onClick={logoutFun}>Logout</p>
                    </div>
                )
            }
        </div>
    );
}

export default Header;