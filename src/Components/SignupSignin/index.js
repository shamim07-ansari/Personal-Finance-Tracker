import React, { useState } from "react";
import "./styles.css";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db, provider } from "../../firebase";
import { toast } from "react-toastify";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Button from "../Button";
import Input from "../Input";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const SignupSignin = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loginForm, setLoginForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function signupWithEmail() {
        setLoading(true);
        console.log(name);
        console.log(email);
        console.log(password);
        console.log(confirmPassword);

        if(name != "" && email != "" && password != "" && confirmPassword != "") {
            if(password == confirmPassword) {
                createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed up
                    const user = userCredential.user;
                    console.log("User -> ", user);
                    toast.success("User Created!");
                    setLoading(false);
                    setName("");
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
                    createDoc(user);
                    navigate("/dashboard");
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    toast.error(errorMessage);
                    setLoading(false);
                });
            }
            else {
                toast.error("Password and Confirm Password don't match!");
                setLoading(false);
            }
        }
        else {
            toast.error("All fields are mandatory!");
            setLoading(false);
        }
    }

    function loginUsingEmail() {
        console.log(email);
        console.log(password);
        setLoading(true);

        if(email != "" && password != "") {
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log("User Logged In", user);
                toast.success("User Logged In!");
                setLoading(false);

                navigate("/dashboard");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setLoading(false);
                toast.error(errorMessage);
            });
        }
        else {
            toast.error("All fields are mandatory!");
            setLoading(false);
        }
    }

    async function createDoc(user) {
        setLoading(true);
        if(!user) return;

        const useRef = doc(db, "users", user.uid);
        const userData = await getDoc(useRef);

        if(!userData.exists()) {
            try {
                await setDoc(doc(db, "users", user.uid), {
                    name: user.displayName ? user.displayName : name,
                    email: user.email,
                    photoURL: user.photoURL ? user.photoURL : "",
                    createdAt: new Date(),
                });
                toast.success("Doc created!");
                setLoading(false);
            }
            catch(e) {
                toast.error(e.message);
                setLoading(false);
            }
        }
        else {
            // toast.error("Doc already exists!");
            setLoading(false);
        }
    }

    function googleAuth() {
        setLoading(true);
        try {
            signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                console.log("users -> ", user);
                createDoc(user);
                navigate("/dashboard");
                toast.success("User Authenticated!");
                setLoading(false);
                // IdP data available using getAdditionalUserInfo(result)
                // ...
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;        
                toast.error(errorMessage);
                setLoading(false);
                // ...
            });
        }
        catch(e) {
            toast.error(e.message);
            setLoading(false);
        }
    }

    return (
        <>
            {loginForm ? (
                <div className='signup-wrapper'>
                <h2 className='title'>
                    Login on <span style={{color: "var(--theme)"}}>Financly.</span>
                </h2>
                <form>
                    <Input
                        type={"email"}
                        label={"Email"}
                        state={email}
                        setState={setEmail}
                        placeholder={"JohnDoe@gmail.com"}
                    />
                    <Input
                        type={"password"}
                        label={"Password"}
                        state={password}
                        setState={setPassword}
                        placeholder={"Example@123"}
                    />
                    <Button
                        disabled={loading}
                        text={loading ? "Loading..." : "Login Using Email and Password"} 
                        onClick={loginUsingEmail}
                    />
                    <p className='p-login'>or</p>
                    <Button 
                        onClick={googleAuth}
                        text={loading ? "Loading..." : "Login Using Google"} 
                        blue={true} 
                    />
                    <p className='p-login'>
                        Or Don't Have An Account? <span className='span-login' onClick={() => setLoginForm(!loginForm)}>Click Here</span>
                    </p>
                </form>
            </div>
            ) 
            : (
                <div className='signup-wrapper'>
                <h2 className='title'>
                    Sign Up on <span style={{color: "var(--theme)"}}>Financly.</span>
                </h2>
                <form>
                    <Input
                        type={"text"}
                        label={"Full Name"}
                        state={name}
                        setState={setName}
                        placeholder={"John Doe"}
                    />
                    <Input
                        type={"email"}
                        label={"Email"}
                        state={email}
                        setState={setEmail}
                        placeholder={"JohnDoe@gmail.com"}
                    />
                    <Input
                        type={"password"}
                        label={"Password"}
                        state={password}
                        setState={setPassword}
                        placeholder={"Example@123"}
                    />
                    <Input
                        type={"password"}
                        label={"Confirm Password"}
                        state={confirmPassword}
                        setState={setConfirmPassword}
                        placeholder={"Example@123"}
                    />

                    <Button
                        disabled={loading}
                        text={loading ? "Loading..." : "Signup Using Email and Password"} 
                        onClick={signupWithEmail}
                    />
                    <p className='p-login'>or</p>
                    <Button 
                        onClick={googleAuth}
                        text={loading ? "Loading..." : "Signup Using Google"} 
                        blue={true} 
                    />
                    <p className='p-login'>
                        Or Have An Account Already? <span className='span-login' onClick={() => setLoginForm(!loginForm)}>Click Here</span>
                    </p>
                </form>
            </div>
            )}
        </>
    );
}

export default SignupSignin;