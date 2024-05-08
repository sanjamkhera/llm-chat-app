import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useState } from 'react';
import { db } from "../../lib/firebase";
import { onSnapshot, doc, arrayUnion, getDoc } from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore";
import { useUserStore } from "../../lib/userStore";
import { updateDoc } from "firebase/firestore";

const Chat = () => {
  const [chat, setChat] = useState();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const endRef = React.useRef(null);
  const { currentUser } = useUserStore();
  const { chatId, user } = useChatStore();

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
  }, [chatId]);

  console.log(chat);

  const handleEmoji = (event) => {
    setText(prev => prev + event.emoji);
    setOpen(false);
  }

  const handleSend = async () => {
    if (text === "") return;

    try {
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
        }),
      });
      // Using this array we can run exactly the same thing and update the other user.
      const userIDs = [currentUser.id, user.id];
      userIDs.forEach(async (id) => {
        const userChatRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatRef);
        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();
          // We find the last index of the chat.
          // This will tell us which index number to update.
          const chatIndex = userChatsData.chats.findIndex((c) => c.chatId === chatId);
          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();
          await updateDoc(userChatRef, { chats: userChatsData.chats, });
        }
      });
    } catch (err) {
      console.log(err);
    }
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
        {chat?.messages?.map(message => (
          <div className="message own" key={message?.createAt}>
            <div className="texts">
              {message.img && <img src={message.img} alt="" />}
              <p>
                {message.text}
              </p>
              <span>1 min ago</span>
            </div>
          </div>
        ))}
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
        <button className="sendButton" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chat;