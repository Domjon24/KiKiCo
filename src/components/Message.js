import React from "react";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import defaultAvatar from "../img/default.jpg";
import { Games } from "../Pages/games";

const Message = ({ message }) => {
  const [user] = useAuthState(auth);
  

  const isCurrentUser = message.uid === user?.uid;
  const avatarSrc = message.avatar || defaultAvatar;

  return (
    
    <div className={`chat-bubble ${isCurrentUser ? "right" : ""}`}>
      <img
        className="chat-bubble__left"
        src={avatarSrc}
        alt="user avatar"
      />
      <div className="chat-bubble__right">
        <p className="user-name">{message.name}</p>
        <p className="user-message">{message.text}</p>
      </div>
    </div>
  );
};

export default Message;
