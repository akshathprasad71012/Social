import axios from "axios";
import "./getcloseFriend.css";
import { useEffect, useState } from "react";

export default function GetCloseFriend(props) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [User, setUser] = useState({});

  useEffect(() => {
    const getUser = async () => {
      if (!props.userId) {
        return;
      }
      const res = await axios.get(`/users/${props.userId}`);
      setUser(res.data);
    };
    getUser();
  }, [props]);

  return (
    <li className="sidebarFriend">
      <img
        className="sidebarFriendImg"
        src={
          props.userId ? PF + User.profilePicture : PF + "person/noAvatar.png"
        }
        alt=""
      />
      <span className="sidebarFriendName">
        {props.userId ? User.username : "Username"}
      </span>
    </li>
  );
}
