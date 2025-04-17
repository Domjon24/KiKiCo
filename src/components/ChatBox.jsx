import React, { useEffect, useRef, useState } from "react";
import { query, collection, orderBy, onSnapshot, limit } from "firebase/firestore";
import { db } from "../firebase";
import Message from "./Message";
import SendMessage from "./SendMessage";
// import { useNavigate } from "react-router-dom";

export function ChatBox() {
  const [messages, setMessages] = useState([]);
  const scroll = useRef();
  // const navigate = useNavigate();  // 

  useEffect(() => {
    const q = query(
      collection(db, "messages"), //sorts messages from server
      orderBy("createdAt", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      const fetchedMessages = [];
      QuerySnapshot.forEach((doc) => {
        fetchedMessages.push({ ...doc.data(), id: doc.id });
      });
      const sortedMessages = fetchedMessages.sort(
        (a, b) => a.createdAt - b.createdAt
      );
      setMessages(sortedMessages);
    });
    
    return () => unsubscribe();  // idk...
  }, []);


  return (
    <main className="chat-box">
      <div className="messages-wrapper">
      
        {messages?.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>

      <span ref={scroll}></span>
      <SendMessage scroll={scroll} />
    </main>
  );
}

export default ChatBox;
