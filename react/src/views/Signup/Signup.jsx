import "./Signup.css";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../context/ContextProvider";
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";

const Signup = () => {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();

  const [errors, setErrors] = useState(null);

  // Como aqui será feito o a criação de conta e login automatico temos que atualizar o contexto que faz a autenticação se o usuario está logado ou não
  // Importação dos set's do contexto
  const { setUser, setToken, setExpiresAt, setWelcome } = useStateContext();

  const onSubmit = (e) => {
    e.preventDefault();
    // Criamos o payload(o que será enviado para o backend) com os valores que estarão nos inputs
    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
    };
    // Post para o backend usando o axiosClient criado em "../../axiosClient.js"
    axiosClient
      .post("/signup", payload)
      .then(({ data }) => {
        setUser(data.user);
        setToken(data.token.plainTextToken);
        setExpiresAt(data.expiresAt);
        setWelcome(true);
      })
      .catch((error) => {
        const response = error.response;
        if (response && response.status == 422) {
          setErrors(response.data.errors);
        }
      });
  };

  return (
    <div className="login-container signup-container">
      <div className="login-form-container">
        <form onSubmit={onSubmit}>
          <div className="img-login-form">
            <img src="logo.png" alt="" />
          </div>
          <h1 className="title">Signup for free</h1>
          {errors && (
            <div className="alert">
              {Object.keys(errors).map((key) => (
                <p key={key}>{errors[key][0]}</p>
              ))}
            </div>
          )}
          <input ref={nameRef} type="text" placeholder="Full Name" />
          <input ref={emailRef} type="email" placeholder="Email Adress" />
          <input ref={passwordRef} type="password" placeholder="Password" />
          <input
            ref={passwordConfirmationRef}
            type="password"
            placeholder="Password Confirmation"
          />
          <button className="btn btn-block">Login</button>
          <p className="message">
            Already registered? <Link to="/login">Sing in</Link>
          </p>
        </form>
      </div>
      <div className="login-logo-container">
        <img src="signup.png" alt="" />
      </div>
    </div>
  );
};

export default Signup;
