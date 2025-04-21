import React from "react";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithRedirect, signInAnonymously, signInWithPopup } from "firebase/auth";
import GoogleSignin from "../img/google-login.png";
import EmailSignin from "../img/anon-icon.png";
import loginPic from "../img/welcom-model-edit.jpg"
import kikico from "../img/kikico.svg"


export function Welcome() {
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };



  const anonymousSignIn = () => {

    
    signInAnonymously(auth)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Signed in anonymously:", user.uid);
      })
      .catch((error) => {
        console.error("Anonymous sign-in failed:", error.code, error.message);
      });
  };

  
  return (

    <main className="welcome">
      <div className="main-content-left">
        <div className="titleTextDiv">
          {/* <h2>KiKiCo</h2> */}
          <img src={kikico} id="kikicoMainWelcome" />
        </div>
        
        {/* </div> */}
      <div className="subtitleDiv">
          <p>Sign in with Google, or go anonymous, to chat with your fellow React Developers.</p>
      </div>
      <div className="loginIconDiv">
          <div className="googleLoginIconBtn">
        <button className="sign-in" onClick={googleSignIn}>
          <img src={GoogleSignin} alt="Sign in with Google" type="button" />
        </button>
      </div>
      

        <button className="sign-in" onClick={anonymousSignIn}>
          <img src={EmailSignin} alt="Sign in anonymously" type="button" />
        </button>
      </div>
      </div>

      <div className="main-content-right ">
          <div className="imgBx">
              <img id="girl" src={loginPic} />
            </div>
          </div>

    </main>
  );
}

export default Welcome;
