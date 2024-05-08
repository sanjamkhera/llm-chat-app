import { useEffect, useState } from "react";
import AddUser from "./addUser/AddUser";
import "./chatList.css";
import { useUserStore } from "../../../lib/userStore";
import { useChatStore } from "../../../lib/chatStore";
import { db } from "../../../lib/firebase";
import { onSnapshot, doc, getDoc } from "firebase/firestore";

const ChatList = () => {

  // Initially chats is going to be an empty array.
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);

  const { currentUser } = useUserStore();
  const { chatId, changeChat } = useChatStore();

  // Whenever we run this page, this component it's going to automatically fetch this data.
  // After fetching we are going to store it somewhere.
  useEffect(() => {
    const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
      const items = res.data().chats;

      // Using each chat we are going to pull up the user.
      // Since we have a list here we can use promise all to fetch all the data at once.
      const promises = items.map(async (item) => {

        // We use the receiverId to get the user
        const userDocRef = doc(db, "users", item.receiverId);

        // We use getDoc to get the user
        const userDocSnap = await getDoc(userDocRef);

        // Finally it's going to return us the user
        const user = userDocSnap.data();
        return { ...item, user };
      });

      // We fulfill all the promises.
      const chatData = await Promise.all(promises);

      // use setChats from useState hook to update the chats array.
      setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
    });

    return () => { unSub() };
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    changeChat(chat.chatId, chat.user);
  }

  return (
    <div className='chatList'>
      <div className="search">
        <div className="searchBar">
          <img src="./search.png" alt="" />
          <input type="text" placeholder="Search" />
        </div>
        <img src={addMode ? "./minus.png" : "./plus.png"} alt="" className="add" onClick={() => setAddMode(prev => !prev)} />
      </div>
      {/* We import our chats here */}
      {chats.map((chat) => (
        <div className="item" key ={chat.chatId} onClick={()=>handleSelect(chat)}>
          <img src={chat.user.avatar || "./avatar.png"} alt="" />
          <div className="texts">
            <span>{chat.user.username}</span>
            <p>{chat.lastMessage}</p>
          </div>
        </div>
      ))}
      {addMode && <AddUser />}
    </div>
  );
};

export default ChatList;