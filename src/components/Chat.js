import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Messages from "../components/Messages";
import Input from "../components/Input";
import { ChatContext } from "../context/ChatContext";
import { useContext } from "react";

const Chat = () => {
  const { data } = useContext(ChatContext);

  return (
    <>
      <div className="chat"> 
        <div className="chatInfo">
          <span> {data.user?.displayName} </span>
          <div className="chatIcons">
            <FontAwesomeIcon icon="fa-solid fa-video" />
            <FontAwesomeIcon icon="fa-solid fa-user" />
            <FontAwesomeIcon icon="fa-solid fa-ellipsis" />
          </div>
        </div>
        <Messages />
        <Input />
      </div>
    </>
  );
};

export default Chat;
