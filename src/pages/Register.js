import addImage from "../images/addImage.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../firebase";
import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from "../components/Loader";

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(storage, displayName);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        (error) => {
          setError(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });
            await setDoc(doc(db, "userChats", res.user.uid), {});

            navigate("/");
          });
        }
      );
    } catch (error) {
      setError(true);
    }
  };

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <>
        <div className="form-container">
          <div className="form-wrapper">
            <span className="logo">Chat Application</span>
            <span className="title">Register</span>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="pseudo" />
              <input type="email" placeholder="email" />
              <input
                type={visible ? "text" : "password"}
                placeholder="password"
              />
              {visible ? (
                <FontAwesomeIcon
                  className="eye-register"
                  icon="fa-solid fa-eye"
                  onClick={() => {
                    setVisible(false);
                  }}
                />
              ) : (
                <FontAwesomeIcon
                  className="eye-register"
                  icon="fa-solid fa-eye-slash"
                  onClick={() => {
                    setVisible(true);
                  }}
                />
              )}
              <input type="file" id="file" style={{ display: "none" }} />
              <label htmlFor="file">
                <div className="image">
                  <img src={addImage} alt="" />
                </div>

                <span>Add an avatar</span>
              </label>
              <button type="submit">Sign up</button>
              {error && <span>Something went wrong !</span>}
            </form>
            <p>
              You do have an account ? <Link to={"/login"}>Login</Link>
            </p>
          </div>
        </div>
      </>
    );
  }
};

export default Register;
