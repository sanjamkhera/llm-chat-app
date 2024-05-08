import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useState } from 'react';
import { db } from "../../lib/firebase";
import { onSnapshot, doc } from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore";

const Chat = () => {
  const [chat, setChat] = useState();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const endRef = React.useRef(null);
  const { chatId } = useChatStore();

  // Takes us to the latest message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Listening to realtime data
  // for now we are going to copy a dummy id from data base
  // then we will use the chatStore to get the chat id
  useEffect(() => {
    // Using the response we can set our chat
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    // Clean up function 
    return () => { unSub() };
  }, [ chatId ]);

  console.log(chat);

  const handleEmoji = (event) => {
    setText(prev => prev + event.emoji);
    setOpen(false);
  }

  console.log(text);
  return (
    <div className='chat'>
      <div className="top">
        <div className="user">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <span>John Doe</span>
            <p>Lorem, ipsum dolor sit.</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>
      <div className="center">
        <div className="message own">
          <div className="texts">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus, non.
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className="message">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus, non.
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className="message own">
          <div className="texts">
            <img src="./avatar.png" alt="" />
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus, non.
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div className="message">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus, non.
            </p>
            <span>1 min ago</span>
          </div>
        </div>
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <img src="./img.png" alt="" />
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <input type="text" placeholder="Type a message..."
          value={text}
          onChange={e => setText(e.target.value)} />
        <div className="emoji">
          <img
            src="./emoji.png" alt=""
            onClick={() => setOpen(prev => !prev)} />
          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button className="sendButton">Send</button>
      </div>
    </div>
  );
};

export default Chat;