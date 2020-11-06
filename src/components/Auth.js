import React from 'react';
import { Link } from 'react-router-dom';
import Register from './Register';
import Login from './Login';


const Auth = (props) => {

  function loginOrRegister() {
    if (props.name === 'Sign Up') {
      return <Register 
        name={props.name} 
        registerRequest={props.registerRequest}  />
    } else if (props.name === 'Log in'){
      return <Login 
        name={props.name} 
        loginRequest={props.loginRequest}  />
    } else {
      console.log("Component doesn't exist");
      return null
    }
  }

    return (
      <div className="auth width">
        <h2 className="auth__title">{props.name}</h2>
        {loginOrRegister()}
        <p className="auth__button-description">{props.buttonDescription} <Link className="auth__link" to={props.link}>{props.linkName} here!</Link></p>
      </div>
      );
}
 
export default Auth;