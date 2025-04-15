import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./App.css";
import NavBar from "./components/NavBar";
import { Games } from "./Pages/games";
import ChatBox from "./components/ChatBox";
import { Welcome } from "./Pages/Welcome";
import { HashRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
function App() {
  return(
         
  <Router>
    <Routes>
      <Route path="/" element={<Welcome/>}/>
      <Route path="/games" element={<Games/>}/>
      <Route path="/chat" element={<ChatBox/>}/>
    </Routes>
  </Router>
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