import React from 'react';
import { authApi } from '../utils/Auth';

const Login = (props) => {

    const emailRef = React.createRef();
    const passwordRef = React.createRef();

    function handleLoginSubmit (e) {
        e.preventDefault();
        const email = emailRef.current.value;
        authApi.signIn(emailRef.current.value, passwordRef.current.value)
            .then((res) => {
                if (res.status === 400) {
                    return Promise.reject(new Error('The username or password was not provided'))
                } else if (res.status === 401) {
                    return Promise.reject(new Error('Could not find a user with that email'))
                } else {
                    props.toggleLoggedIn(true);
                    return res;
                }
            })
            .then((data) => {
                props.setEmail(email);
                localStorage.setItem('email', email);
                localStorage.setItem('token', data.token);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return ( 
        <>
            <input ref={emailRef} className="auth__input" type="text" placeholder="Email" />
            <input ref={passwordRef} className="auth__input" type="text" placeholder="Password" />
            <button onClick={handleLoginSubmit} className="auth__submit" type="submit">{props.name}</button>
        </>
     );
}
 
export default Login;