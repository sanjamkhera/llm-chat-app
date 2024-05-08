import "./addUser.css";
import { collection, query, serverTimestamp, where, getDocs, setDoc, doc, arrayUnion, updateDoc } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { useState } from "react";
import { useUserStore } from "../../../../lib/userStore";



const AddUser = () => {

  const [user, setUser] = useState(null);
  const {currentUser} = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault(); // Since we are using a form, Prevents the page from refreshing
    const formData = new FormData(e.target);
    const username = formData.get("username");

    // Need a condition to do this
    // To do this we are going to need a query method
    try {
      const userRef = collection(db, "users");

      // Create a query against the collection and returns us an array
      const q = query(userRef, where("username", "==", username));
      const querySnapshot = await getDocs(q);

      // If query snapshot is not empty
      if (!querySnapshot.empty) {
        setUser(querySnapshot.docs[0].data());
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleAdd = async () => {

    // First we need to create a new chat
    // For that we can pass our collection
    // It's going to include created at and all the messages of the chat
    // Take the chat id from user chats and search for our chats
    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");

    try {

      // Create a new reference and pass the collection reference 
      // After adding the following document, we can reach it's id
      const newChatRef = doc(chatRef);

      // We add a new chat first
      // We will need this document id
      // We will need a document reference and use that to get chat id
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: []
      });

      // Now we will update the user chats
      await updateDoc(doc(userChatsRef, user.id), {
        // After finding that chat we can update the chat array
        // It allows us to push any item outside of the array
        // This is going to update their user chat, but it should update our user chat as well
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });

      // This time we are going to update our user chat
      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });

    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className='addUser'>

      {/* Using the "username" we can search for the input in data base "onSubmit" */}
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Username" name="username" />
        <button>Search</button>
      </form>

      {/* If there is a user show this div */}
      {user && <div className="user">
        <div className="detail">
          <img src={user.avatar || "./avatar.png"} alt="" />
          <span>{user.username}</span>
        </div>
        <button onClick={handleAdd}>Add User</button>
      </div>}
    </div>
  );
};

export default AddUser;