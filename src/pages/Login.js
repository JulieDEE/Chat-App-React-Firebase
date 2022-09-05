import { auth } from "../firebase";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from "../components/Loader";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      console.log(error.message);
      setError(error.message);
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
            <span className="title">Login</span>
            <form onSubmit={handleSubmit}>
              <input type="email" placeholder="email" />
              <input
                type={visible ? "text" : "password"}
                placeholder="password"
              />
              {visible ? (
                <FontAwesomeIcon
                  className="eye"
                  icon="fa-solid fa-eye"
                  onClick={() => {
                    setVisible(false);
                  }}
                />
              ) : (
                <FontAwesomeIcon
                  className="eye"
                  icon="fa-solid fa-eye-slash"
                  onClick={() => {
                    setVisible(true);
                  }}
                />
              )}

              {error && <span> Something went wrong : {error.message} </span>}

              <button type="submit">Sign in</button>
            </form>
            <p>
              You don't have an account ? <Link to={"/register"}>Register</Link>
            </p>
          </div>
        </div>
      </>
    );
  }
};

export default Login;
