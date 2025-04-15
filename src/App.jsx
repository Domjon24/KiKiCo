import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./App.css";
import NavBar from "./components/NavBar";
import { Games } from "./Pages/games";
import ChatBox from "./components/ChatBox";
import { Welcome } from "./Pages/Welcome";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [user, loading] = useAuthState(auth);  // Use the auth hook to get the user state
  const [authChecked, setAuthChecked] = useState(false);  // To track when auth state is checked

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthChecked(true);  // Mark that auth has been checked
    });

    return () => unsubscribe();  // Cleanup the listener on unmount
  }, []);

  if (loading || !authChecked) {
    return <div>Loading...</div>; // Wait until auth state is fully checked
  }

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Welcome />} />
        {/* Only render the games page if the user is logged in */}
        <Route path="/games" element={user ? <Games /> : <Welcome />} />
        {/* Only render the chat page if the user is logged in */}
        <Route path="/chat" element={user ? <ChatBox /> : <Welcome />} />
      </Routes>
      </>
  );
}

export default App;



//   gsutil cors set C:\Users\DomTh\Documents\coding\fb-chatApp\fb-chatapp\cors.json cors.json gs://fb-chat-app-81ea0.firebasestorage.app
// gsutil cors set "C:\Users\DomTh\Documents\coding\fb-chatApp\fb-chatapp\cors.json" gs://fb-chat-app-81ea0.appspot.com
// gsutil cors set "C:\Users\DomTh\Documents\coding\fb-chatApp\fb-chatapp\cors.json" gs://fb-chat-app-81ea0.firebasestorage.app


// const [user] = useAuthState(auth);
// return (
//   <div className="App">
//     <NavBar />
//     {!user ? <Welcome /> : <chat />}
//   </div>
// );

// goes inside app function