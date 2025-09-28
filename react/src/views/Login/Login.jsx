import "./Login.css";
import axiosClient from "../../axios-client";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { useStateContext } from "../../context/ContextProvider";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();

  const [errors, setErrors] = useState(null);
  const [message, setMessage] = useState(null);
  // Importação dos set's do contexto
  const { setUser, setToken, setExpiresAt, setWelcome } = useStateContext();

  const onSubmit = (e) => {
    e.preventDefault();
    setErrors(null);
    setMessage(null);

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    // Post para o backend usando o axiosClient criado em "../../axiosClient.js"
    axiosClient
      .post("/login", payload)
      .then(({ data }) => {
        setUser(data.user);
        setToken(data.token.plainTextToken);
        setExpiresAt(data.expiresAt);
        setWelcome(true);
        // console.log(data);
      })
      .catch((error) => {
        const response = error.response;
        if (response && response.status == 422) {
          setErrors(response.data.errors);
        } else {
          setMessage(response.data.message);
        }
      });
  };

  return (
    <div className="login-container">
      <div className="login-form-container">
        <form onSubmit={onSubmit}>
          <div className="img-login-form">
            <img src="logo.png" alt="" />
          </div>
          <h1 className="title">Login into your account</h1>
          {message && (
            <div className="alert">
              <p>{message}</p>
            </div>
          )}

          {errors && (
            <div className="alert">
              {Object.keys(errors).map((key) => (
                <p key={key}>{errors[key][0]}</p>
              ))}
            </div>
          )}

          <input ref={emailRef} type="email" placeholder="Email" />
          <input ref={passwordRef} type="password" placeholder="Password" />

          <button className="btn btn-block">Login</button>
          <p className="message">
            Not registered? <Link to="/signup">Create an account</Link>
          </p>
        </form>
      </div>
      <div className="login-logo-container">
        <img src="login.png" alt="" />
      </div>
    </div>
  );
};

export default Login;
