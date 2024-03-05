import "./chatArea.css";
import MessageBox from "../messageBox/MessageBox";
import CloseFriend from "../closeFriend/CloseFriend";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import GetCloseFriend from "../getcloseFriend/GetCloseFriend";
import axios from "axios";

export default function ChatArea({ conversation, socket }) {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [typedMessage, setTypedMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const messagesEndref = useRef(null);

  useEffect(() => {
    if (conversation.id || 1) {
      socket.current.on("getMessage", (message) => {
        console.log("omom");
        setArrivalMessage({
          sender: message.senderId,
          text: message.text,
          createdAt: Date.now(),
        });
      });
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndref.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    arrivalMessage &&
      (conversation.user === arrivalMessage.sender ||
        user._id === arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [conversation, arrivalMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!conversation.id) {
      console.log(conversation);
      return;
    }
    const getMessages = async () => {
      const res = await axios.get(`/conversations/${conversation.id}`);
      console.log(conversation.id);
      setMessages(res.data);
    };
    getMessages();
  }, [conversation]);

  const handletype = (event) => {
    setTypedMessage(event.target.value);
    console.log(typedMessage);
  };

  const sendMessage = async () => {
    console.log("Dnenvio3wrmgo");
    if (typedMessage.length !== 0) {
      await axios.post("/messages", {
        senderId: user._id,
        text: typedMessage,
        conversationId: conversation.id,
      });
      console.log(socket);
      socket.current.emit("sendMessage", {
        senderId: user._id,
        text: typedMessage,
        receiverId: conversation.user,
      });

      setMessages([
        ...messages,
        {
          sender: user._id,
          text: typedMessage,
          conversationId: conversation.id,
        },
      ]);
    }
    setTypedMessage("");
  };

  return (
    <>
      <div className="chatAreaContainer">
        <div className="chatProfile">
          {
            <GetCloseFriend
              userId={conversation.user}
              updatedAt={conversation.updatedAt}
            />
          }
        </div>
        <div className="chatArea">
          {messages.map((mess) => (
            <MessageBox user={user._id} message={mess} />
          ))}
          <div ref={messagesEndref} />
        </div>
        <div className="chatAreaTextbox">
          <textarea
            name="message"
            id=""
            rows={1}
            onChange={handletype}
            value={typedMessage}
          ></textarea>
          <button
            onClick={() => {
              sendMessage();
            }}
          >
            <span>Send</span>
          </button>
        </div>
      </div>
    </>
  );
}
