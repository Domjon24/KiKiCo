import React from "react";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup, signInAnonymously } from "firebase/auth";
import GoogleSignin from "../img/google-login.png";
import EmailSignin from "../img/anon-icon.png";
import loginPic from "../img/welcom-model-edit.jpg";
import kikico from "../img/kikico.svg";

export function Welcome() {
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const anonymousSignIn = () => {
    signInAnonymously(auth)
      .then((userCredential) => {
        console.log("Signed in anonymously:", userCredential.user.uid);
      })
      .catch((error) => {
        console.error("Anonymous sign-in failed:", error.code, error.message);
      });
  };

  return (
    <main className="welcome">
      <div className="main-content-left">
        <div className="titleTextDiv">
          <img src={kikico} id="kikicoMainWelcome" alt="KiKiCo logo" />
        </div>

        <div className="sign-in-welcome">
          <p>Sign in with Google, or go anonymous, to join the chatroom. Don't forget to check out the game room!</p>
        </div>

        <div className="loginIconDiv">
          <button className="btn-primary googleLoginIconBtn" onClick={googleSignIn}>
            <img src={GoogleSignin} alt="Google Sign-In" style={{ height: "30px", marginRight: "10px" }} />
            Sign in with Google
          </button>

          <button className="btn-primary anonLoginBtn" onClick={anonymousSignIn}>
            <img src={EmailSignin} alt="Anonymous Sign-In" style={{ height: "30px", marginRight: "10px" }} />
            Sign in Anonymously
          </button>
        </div>
      </div>

      <div className="main-content-right">
        <div className="imgBx">
          <img id="girl" src={loginPic} alt="Login Illustration" />
        </div>
      </div>
    </main>
  );
}

export default Welcome;
