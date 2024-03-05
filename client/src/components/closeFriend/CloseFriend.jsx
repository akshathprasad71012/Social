import { Link } from "react-router-dom";
import "./closeFriend.css";

export default function CloseFriend({user}) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <li className="sidebarFriend">
      <Link to={`/profile/${user.username}`} style={{ textDecoration: 'none', display: 'flex'}}>
        <img className="sidebarFriendImg" src={PF+user.profilePicture} alt="" />
        <span className="sidebarFriendName">{user.username}</span>
      </Link>
    </li>
  );
}
