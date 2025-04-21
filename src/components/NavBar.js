import React from "react";
import GoogleSignin from "../img/google-login.png";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import kikico from "../img/kikico-cropped.svg"

const NavBar = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const signOut = () => {
    auth.signOut();
  };


  const goToGames = () => {
    navigate('/games'); 
  };
  const goToChat = () => {
    navigate('/chat'); 
  };

  return (
    <nav className="nav-bar">
      {/* <h1>React Chat</h1> */}
      <img src={kikico} className="kikicoLogo" />
      <button className="navBtn" onClick={goToGames}>Go to Game</button>
      <button className="navBtn" onClick={goToChat}>Go to Chat</button>
      {user ? (
        <button onClick={signOut} className="sign-out navBtn"  type="button">
          Sign Out
        </button>
      ) : (
        <button className="sign-in welcome-signIn">
          <img
            onClick={googleSignIn}
            src={GoogleSignin}
            alt="sign in with google" style={{ height: "35px", width: "30px", paddingBottom: "30%" }}
            type="button"
          />
        </button>
      )}
    </nav>
  );
};

export default NavBar;