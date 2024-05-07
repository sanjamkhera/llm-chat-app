import { toast } from "react-toastify";
import "./login.css";
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import upload from '../../lib/upload.js';

const Login = () => {
  const [avatar, setAvatar] = useState({
    file: null,
    url: ""
  });

  const [loading, setLoading] = useState(false);

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0])
      });
    }
  }

  // This function is an event handler for the register form submission.
  const handleRegister = async (e) => {
    // Prevent the default form submission behavior.
    e.preventDefault();
    setLoading(true);

    // Create a FormData object from the form that triggered the event.
    const formData = new FormData(e.target);

    // Extract the username, email, and password from the form data.
    const { username, email, password } = Object.fromEntries(formData);

    try {
      // Attempt to create a new user with the provided email and password.
      // This function is asynchronous, so we use await to pause execution until it completes.
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const imgURL = await upload(avatar.file);

      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        avatar: imgURL,
        id: res.user.uid,
        blocked: [],
      });
      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });
      toast.success("Account created! You can login now!");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // This function is an event handler for the login form submission.
  const handleLogin = async (e) => {
    // Prevent the default form submission behavior.
    e.preventDefault();
    setLoading(true);

    // Create a FormData object from the form that triggered the event.
    const formData = new FormData(e.target);

    // Extract the username, email, and password from the form data.
    const { email, password } = Object.fromEntries(formData);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className='login'>
      <div className="item">
        <h2>Welcome back</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <button disabled={loading} className="loginButton">{loading ? "Loading" : "Log In"}</button>
        </form>
      </div>
      <div className="separator"></div>
      <div className="item">
        <h2>Create Account</h2>
        <form onSubmit={handleRegister}>
          <label htmlFor="file">
            <img src={avatar.url || "./avatar.png"} alt="" />
            Upload an Image
          </label>
          <input type="file" id="file" style={{ display: "none" }} onChange={handleAvatar} />
          <input type="text" placeholder="Username" name="username" />
          <input type="text" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <button disabled={loading} className="loginButton">{loading ? "Loading" : "Sign Up"}</button>
        </form>
      </div>
    </div>
  );
};

export default Login;