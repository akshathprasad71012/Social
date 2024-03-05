import { useContext, useEffect, useRef, useState } from "react";
import CloseFriend from "../../components/closeFriend/CloseFriend";
import Topbar from "../../components/topbar/Topbar";
import "./messagePage.css";
import { AuthContext } from "../../context/AuthContext";
import Rightbar from "../../components/rightbar/Rightbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import MessageLeftbar from "../../components/messageLeftbar/MessageLeftbar";
import ChatArea from "../../components/chatArea/ChatArea";
import GetCloseFriend from "../../components/getcloseFriend/GetCloseFriend";
import axios from "axios";
import { io } from "socket.io-client";
import MessageBox from "../../components/messageBox/MessageBox";

export default function Messages() {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [conversations, setConversations] = useState([]); //left bar conversations
  const [conversation, setConversation] = useState({}); //current conversation id
  const socket = useRef();
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const messagesEndref = useRef(null);
  const [typedMessage, setTypedMessage] = useState("");
  let otherUser = null;

  const scrollToBottom = () => {
    messagesEndref.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    socket.current = io("ws://localhost:8900");

    socket.current.on("getMessage", (message) => {
      setArrivalMessage({
        sender: message.senderId,
        text: message.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      (conversation.user === arrivalMessage.sender ||
        user._id === arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [conversation, arrivalMessage]);

  useEffect(() => {
    socket.current.emit("addUser", user._id);
    socket.current.on("getUsers", (users) => {
      console.log("fuoefmowm");
      console.log(users);
    });
  }, [user]);

  useEffect(() => {
    const convs = async () => {
      const res = await axios.get(`/users/conversations/${user._id}`);

      setConversations(
        res.data.map((cons) => {
          const ou = cons.users[0] === user._id ? cons.users[1] : cons.users[0];
          const ud = cons.updatedAt;
          return { id: cons._id, user: ou, updatedAt: ud };
        })
      );
    };
    convs();
  }, [user]);

  function handleClick(c) {
    otherUser = c.user;
    setConversation(c);
  }

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
      <Topbar />
      <div className="messagePageContainer">
        <div className="messageLeftbar">
          {conversations.map((c) => {
            return (
              <div
                onClick={() => {
                  handleClick(c);
                }}
              >
                <GetCloseFriend userId={c.user} updatedAt={c.updatedAt} />
              </div>
            );
          })}
        </div>
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
      </div>
    </>
  );
}
