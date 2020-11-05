import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo.svg';

function Header(props){

    function removeJWT() {
        localStorage.removeItem('token');
        props.setEmail("");
        window.location.reload();
        return
    }

    function handleHamburgerClick() {
        props.toggleHamburgerState(!props.hamburger);
    }

    function loginOrRegister() { 
        if (props.link) {
            return <Link className="header__link" to={props.link}>{props.name}</Link> 
        } else if (props.email) {
            return (
                <>
                    <p className={`header__email ${props.hamburger ? "header__email_hamburger_active" : ""}`}>{props.email}</p>
                    <button onClick={removeJWT} className={`header__logout ${props.hamburger ? "header__logout_hamburger_active" : ""}`}>Log Out</button>
                    <button onClick={handleHamburgerClick} className={`header__hamburger ${props.hamburger ? "header__hamburger_active" : ""}`}></button>
                </>
            )
        } else {
            return null;
        }
    }

    return(
        <header className={`header width ${props.hamburger ? "header_hamburger_active" : ""}`}>
            <img className="logo" src={logo} alt="Around the US Logo"/>
            {loginOrRegister()}
            
        </header>
    )
}

export default Header;