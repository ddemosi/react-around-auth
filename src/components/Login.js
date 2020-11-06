import React from 'react';

const Login = (props) => {

    const emailRef = React.createRef();
    const passwordRef = React.createRef();

    function handleLoginSubmit (e) {
        e.preventDefault();
        props.loginRequest(emailRef.current.value, passwordRef.current.value);
    }

    return ( 
        <>
            <input ref={emailRef} className="auth__input" type="email" placeholder="Email" />
            <input ref={passwordRef} className="auth__input" type="password" placeholder="Password" />
            <button onClick={handleLoginSubmit} className="auth__submit" type="submit">{props.name}</button>
        </>
     );
}
 
export default Login;