import { useContext, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { doc, setDoc, getDoc } from "firebase/firestore";

const Searchbar = () => {
  const [userName, setUserName] = useState("");
  const [user, setUser] = useState(null);

  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", userName)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (error) {}
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSearch();
  };

  const handleSelect = async () => {
    // check wether the group exists in (chats firestore) and if it doesn't, create group.

    const combineId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      const response = await getDoc(doc(db, "chats", combineId));

      if (!response.exists()) {
        // create a chat in chats collection :
        await setDoc(doc(db, "chats", combineId), { messages: [] });
      }

      // create user chats :

      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [combineId + ".userInfo"]: {
          uid: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        },
        [combineId + ".date"]: serverTimestamp(),
      });

      await updateDoc(doc(db, "userChats", user.uid), {
        [combineId + ".userInfo"]: {
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        },
        [combineId + ".date"]: serverTimestamp(),
      });
    } catch (error) {}
    setUser(null);
    setUserName("");
  };

  return (
    <>
      <div className="searchbar">
        <div className="searchForm">
          <input
            type="text"
            placeholder="Find a user"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            onKeyDown={handleKey}
          />
          {/* {error && <span> User not found ! </span>} */}
          {user && (
            <div className="userChat" onClick={handleSelect}>
              <img src={user.photoURL} alt="" />
              <div className="userChatInfo">
                <span>{user.displayName} </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Searchbar;
