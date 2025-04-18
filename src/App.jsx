import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./App.css";
import NavBar from "./components/NavBar";
import { Games } from "./Pages/games";
import ChatBox from "./components/ChatBox";
import { Welcome } from "./Pages/Welcome";
import { Routes, Route } from "react-router-dom";
// import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CheckLogin from "./components/CheckLogin";
import { useLocation } from "react-router-dom";

function App() {
  const [user, loading] = useAuthState(auth);  
  // const [authChecked, setAuthChecked] = useState(false); 
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user && location.pathname === "/") {
      navigate("/chat");
    }
  }, [user, location.pathname, navigate]);


  if (loading) {
    return  <div>Loading...</div>;
  }
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, () => {
  //     setAuthChecked(true);  // 
  //   });

  //   return () => unsubscribe();  
  // }, []);

  // if (loading || !authChecked) {
  //   return <div>Loading...</div>; d
  // }
  

  return (
    
      <div className="app-container">
        
        <NavBar />
        <Routes>
        
          <Route path="/" element={<Welcome />} />
          <Route path="/games" element={<CheckLogin user={user}><Games user={user} /></CheckLogin>}/>
          {/* <Route path="/games" element={user ? <Games user={user} /> :  <Welcome />} /> */}
          <Route path="/chat" element={<CheckLogin user={user}><ChatBox user={user} /></CheckLogin>}/>
          {/* <Route path="/chat" element={user ? <ChatBox /> : <Welcome />} /> */}
        </Routes>
      </div>
  );
  
}




export default App;

