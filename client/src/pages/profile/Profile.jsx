import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Button } from "@material-ui/core";

export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const username = useParams().username;
  const [coverfile, setCoverFile] = useState(null);
  const [profilefile, setProfileFile] = useState(null);

  console.log(user);
  

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users/username/${username}`);
      setUser(res.data);
    };
    fetchUser();
  }, [username, currentUser]);


  const submitHandlerforCover = async (e)=>{
    e.preventDefault();
    console.log("COver to be updated");
    if (coverfile) {
      const data = new FormData();
      const fileName = Date.now() + coverfile.name;
      data.append("name", fileName);
      data.append("file", coverfile);
      //newPost.img = fileName;
      currentUser.coverPicture = fileName;
      //console.log(newPost);
      try {
        await axios.post("/upload", data);
      } catch (err) {}
    }else{
      console.log("file is null");
    }
    try {
      console.log(currentUser);
      
      await axios.put(`/users/${currentUser._id}`, {
        userId: currentUser._id,
        coverPicture: currentUser.coverPicture
      });
      dispatch({ type: "COVERUPDATE", payload: currentUser.coverPicture });

      window.location.reload();

    } catch (err) {}
  }

  const submitHandlerforProfile = async (e)=>{
    e.preventDefault();
    console.log("profile to be updated")
    
    if (profilefile) {
      const data = new FormData();
      const fileName = Date.now() + profilefile.name;
      data.append("name", fileName);
      data.append("file", profilefile);
      //newPost.img = fileName;
      currentUser.profilePicture = fileName;
      //console.log(newPost);
      try {
        await axios.post("/upload", data);
      } catch (err) {}
    }else{
      console.log("file is null");
    }
    try {
      console.log(currentUser);
      
      await axios.put(`/users/${currentUser._id}`, {
        userId: currentUser._id,
        profilePicture: currentUser.profilePicture
      });

      dispatch({ type: "PROFILEUPDATE", payload: currentUser.profilePicture });

      // setCoverFile(null);
      // setProfileFile(null);
      window.location.reload();
    } catch (err) {}
  }


  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              {user._id !== currentUser._id ?
                  (<>
                  <img className="profileCoverImg" src={user.coverPicture? PF + user.coverPicture: PF + "person/noCover.png"}/>
                  </>
                  ):
                  (
                    <form id="cover" onSubmit={submitHandlerforCover}>
                      <label htmlFor="coverfile" className="shareOption">
                      <img className="profileCoverImg" src={user.coverPicture? PF + user.coverPicture: PF + "person/noCover.png"}/>
                        <input
                        style={{ display: "none" }}
                        type="file"
                        id="coverfile"
                        accept=".png,.jpeg,.jpg"
                        onChange={(e) => setCoverFile(e.target.files[0])}
                      />
                      </label>

                      {(coverfile) && <Button id="coversubmit" type="submit">Confirm</Button>}
                      {(coverfile) && <Button id="covercancel" onClick={() => {setCoverFile(null)}}>Cancel</Button>}
                    </form>
                  )

                }

                  {user._id !== currentUser._id ?
                  (<>
                  <img className="profileUserImg" src={user.profilePicture? PF + user.profilePicture : PF + "person/noAvatar.png"}/>
                  </>
                  ):
                  (
                    <form id="profile" onSubmit={submitHandlerforProfile}>
                      <label htmlFor="profilefile" className="shareOption">
                      <img className="profileUserImg" src={user.profilePicture? PF + user.profilePicture : PF + "person/noAvatar.png"}/>
                        <input
                        style={{ display: "none" }}
                        type="file"
                        id="profilefile"
                        accept=".png,.jpeg,.jpg"
                        onChange={(e) => setProfileFile(e.target.files[0])}
                      />
                      </label>

                      {(profilefile) && <Button id="profilesubmit" type="submit">Confirm</Button>}
                      {(profilefile) && <Button id="profilecancel" onClick={() => {setProfileFile(null)}}>Cancel</Button>}
                    </form>
                  )

                }
               
              
              
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={user.username} />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  );
}
