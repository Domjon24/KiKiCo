import React from "react";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithRedirect, signInAnonymously } from "firebase/auth";
import GoogleSignin from "../img/btn_google_signin_dark_pressed_web.png";
import EmailSignin from "../img/mail-with-star.svg";

export function Welcome() {
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };

  const anonymousSignIn = () => {
    signInAnonymously(auth)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Signed in anonymously:", user.uid);
        // You can save this UID for later use if needed
      })
      .catch((error) => {
        console.error("Anonymous sign-in failed:", error.code, error.message);
      });
  };

  return (
    <main className="welcome">
      <h2>Welcome to React Chat.</h2>
      <img src="/logo512.png" alt="ReactJs logo" width={50} height={50} />
      <p>Sign in with Google or anonymously to chat with your fellow React Developers.</p>

      <button className="sign-in" onClick={googleSignIn}>
        <img src={GoogleSignin} alt="Sign in with Google" type="button" />
      </button>

      <button className="sign-in" onClick={anonymousSignIn}>
        <img src={EmailSignin} alt="Sign in anonymously" width={50} height={50} type="button" />
      </button>
    </main>
  );
}

export default Welcome;
