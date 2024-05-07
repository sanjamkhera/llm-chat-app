import { useEffect, useState } from "react";
import AddUser from "./addUser/AddUser";
import "./chatList.css";
import { useUserStore } from "../../../lib/userStore";
import { db } from "../../../lib/firebase";
import { onSnapshot, doc, getDoc } from "firebase/firestore";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);


  const { currentUser } = useUserStore();

  // Whenever we run this page, this component it's going to automatically fetch this data.
  // After fetching we are going to store it somewhere.
  useEffect(() => {
    const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
      const items = res.data().chats;

      // Since we have a list here we can use promise all to fetch all the data at once.
      const promises = items.map(async (item) => {
        const userDocRef = doc(db, "users", item.receiverId);
        const userDocSnap = await getDoc(userDocRef);

        // Finally it's going to return us the user
        const user = userDocSnap.data();
        return { ...item, user };
      });

      const chatData = await Promise.all(promises);
      setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
    });

    return () => { unSub() };
  }, [currentUser.id]);

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
        <div className="item">
          <img src="./avatar.png" alt="" />
          <div className="texts">
            <span>User Name</span>
            <p>Hello</p>
          </div>
        </div>
      ))}

      {addMode && <AddUser />}
    </div>
  );
};

export default ChatList;