import React from 'react';

const Register = (props) => {

    const emailRef = React.createRef();
    const passwordRef = React.createRef();

    function handleRegisterSubmit(e) {
        e.preventDefault();
        props.registerRequest(emailRef.current.value, passwordRef.current.value);
    }

    return ( 
        <form>
            <input ref={emailRef} className="auth__input" type="email" placeholder="Email" />
            <input ref={passwordRef} className="auth__input" type="password" placeholder="Password"/>
            <button onClick={handleRegisterSubmit} type="submit" className="auth__submit">{props.name}</button>
        </form>
     );
}
 
export default Register;