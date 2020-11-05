import React from 'react';
import { authApi } from '../utils/Auth';

const Register = (props) => {

    const emailRef = React.createRef();
    const passwordRef = React.createRef();

    function handleRegisterSubmit(e) {
        e.preventDefault();
        authApi.signUp(emailRef.current.value, passwordRef.current.value)
            .then((res) => {
                if (res.status === 400) {
                    return Promise.reject(new Error('The username or password is not in the proper format'))
                } else {
                    props.setRegistrationSuccess(true);
                    props.toggleInfoTooltip(true);
                    props.toggleLoggedIn(true);
                    return res.data;
                }
            })
            .then((data) => {
                props.setEmail(data.email);
            })
            .catch((err) => {
                console.log(err);
                props.setRegistrationSuccess(false);
                props.toggleInfoTooltip(true);
            })
    }

    return ( 
        <form>
            <input ref={emailRef} className="auth__input" type="text" placeholder="Email" />
            <input ref={passwordRef} className="auth__input" type="text" placeholder="Password"/>
            <button onClick={handleRegisterSubmit} type="submit" className="auth__submit">{props.name}</button>
        </form>
     );
}
 
export default Register;