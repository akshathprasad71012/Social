import { useContext, useEffect, useState } from "react";
import "./messageLeftbar.css";
import { AuthContext } from "../../context/AuthContext";
import CloseFriend from "../closeFriend/CloseFriend";
import { Users } from "../../dummyData";
import axios from "axios";
import GetCloseFriend from "../getcloseFriend/GetCloseFriend";

export default function MessageLeftbar({ user }) {
  //const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const convs = async () => {
      const res = await axios.get(`/users/conversations/${user._id}`);

      setConversations(
        res.data.map((cons) => {
          const ou = cons.users[0] === user._id ? cons.users[1] : cons.users[0];
          const ud = cons.updatedAt;
          return { user: ou, updatedAt: ud };
        })
      );
    };
    convs();
  }, [user]);

  console.log(conversations);
  return (
    <>
      <div className="messageLeftbar">
        {conversations.map((c) => {
          return <GetCloseFriend userId={c.user} updatedAt={c.updatedAt} />;
        })}
      </div>
    </>
  );
}
