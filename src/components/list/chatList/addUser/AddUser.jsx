import "./addUser.css";
import { collection, query, where } from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { useState } from "react";
import { getDocs } from "firebase/firestore";

const AddUser = () => {

  const [user, setUser] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault(); // Since we are using a form, Prevents the page from refreshing
    const formData = new FormData(e.target);
    const username = formData.get("username");



    // Need a condition to do this
    // To do this we are going to need a query method
    try {

      const userRef = collection(db, "users");

      // Create a query against the collection and returns us an array.
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
        <button>Add User</button>
      </div>}
    </div>
  );
};

export default AddUser;