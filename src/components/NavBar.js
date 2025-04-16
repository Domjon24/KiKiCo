import React from "react";
import GoogleSignin from "../img/btn_google_signin_dark_pressed_web.png";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

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
  // const goToGames = () => {
  //   Navigate('/games'); 
  // };

  const goToGames = () => {
    navigate('/games'); 
  };
  const goToChat = () => {
    navigate('/chat'); 
  };

  return (
    <nav className="nav-bar">
      <h1>React Chat</h1>
      <button className="navBtn" onClick={goToGames}>Go to Games</button>
      <button className="navBtn" onClick={goToChat}>Go to Chat</button>
      {user ? (
        <button onClick={signOut} className="sign-out navBtn"  type="button">
          Sign Out
        </button>
      ) : (
        <button className="sign-in">
          <img
            onClick={googleSignIn}
            src={GoogleSignin}
            alt="sign in with google"
            type="button"
          />
        </button>
      )}
    </nav>
  );
};

export default NavBar;