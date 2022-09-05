import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import { useContext, useState } from "react";
import {
  arrayUnion,
  updateDoc,
  doc,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);


  const handleSend = async () => {
    if (img) {
    
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);


      uploadTask.on(
        (error) => {},
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      setText("");
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleSend();
  };

  return (
    <>
      <div className="input">
        <input
          type="text"
          placeholder="Type something..."
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
          onKeyDown={handleKey}
        />
        <div className="send">
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={(e) => {
              setImg(e.target.files[0]);
            }}
          />
          <label htmlFor="file">
            <FontAwesomeIcon className="icon" icon="fa-solid fa-paperclip" />
          </label>
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </>
  );
};

export default Input;
