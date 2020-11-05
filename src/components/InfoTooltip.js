import React, { useState, useEffect } from 'react';

const InfoTooltip = (props) => {
    const [message, setMessage] = useState('');
    
    useEffect(() => {
        function isRegisterSuccess () {
        if (props.registrationSuccess === true) {
            setMessage('Success! You have now been registered.')

            return true
        } else if (props.registrationSuccess === false) {
            setMessage('Oops, something went wrong! Please try again.')
            return false
        } else {
            return null
        }
    }
        isRegisterSuccess();
    }, [props.registrationSuccess])
    
    return (
        <section className={`form info-tooltip ${props.isOpen ? "info-tooltip_visible" : ""}`}>
            <div className="form-width ">
                <button className="modal__exit image-modal__exit" onClick={props.onClose}></button>
                <div className={`info-tooltip__image ${props.registrationSuccess ? 'info-tooltip__image_success' : 'info-tooltip__image_fail'}`}/>
                <p className="info-tooltip__message">{message}</p>
            </div>
        </section>
    )
}

export default InfoTooltip;