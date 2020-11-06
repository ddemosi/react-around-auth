import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import Header from './Header.js';
import Main from './Main.js';
import Footer from './Footer.js';
import ImagePopup from './ImagePopup.js';
import { CurrentUserContext } from '../contexts/CurrentUserContext.js';
import { api } from '../utils/Api.js';
import { authApi } from '../utils/Auth';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ConfirmDeletePopup from './ConfirmDeletePopup';
import Auth from './Auth';
import ProtectedRoute from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';

function App () {
    const [currentUser, setCurrentInfo] = useState({})
    // Popup states
    const [editAvatarIsOpen, toggleEditAvatar] = useState(false);
    const [editProfileIsOpen, toggleEditProfile] = useState(false);
    const [addCardIsOpen, toggleAddCard] = useState(false);
    const [confirmDeleteIsOpen, toggleConfirmDelete] = useState(false);
    const [infoTooltipIsOpen, toggleInfoTooltip] = useState(false);

    const [confirmDeleteId, setConfirmDeleteId] = useState("")
    const [selectedCard, setSelectedCard] = useState({
        link: "",
        name: "",
        isOpen: false
    });
    const [isSaving, toggleSaveText] = useState(false);
    const [cards, setCards] = useState([]);

    //Project 14 new States
    const [isLoggedIn, toggleLoggedIn] = useState(false);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [email, setEmail] = useState("");
    const [hamburger, toggleHamburgerState] = useState(false);

    // Project 14 new functions
    // API request for login

    function loginRequest(email, password) {
        authApi.signIn(email, password)
            .then((res) => {
                if (res.status === 400) {
                    return Promise.reject(new Error('The username or password was not provided'))
                } else if (res.status === 401) {
                    return Promise.reject(new Error('Could not find a user with that email'))
                } else {
                    toggleLoggedIn(true);
                    return res;
                }
            })
            .then((data) => {
                setEmail(email);
                localStorage.setItem('email', email);
                localStorage.setItem('token', data.token);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    // API request for register

    function registerRequest(email, password) {
        authApi.signUp(email, password)
            .then((res) => {
                if (res.status === 400) {
                    return Promise.reject(new Error('The username or password is not in the proper format'))
                } else {
                    setRegistrationSuccess(true);
                    toggleInfoTooltip(true);
                    toggleLoggedIn(true);
                    return res.data;
                }
            })
            .then((data) => {
                setEmail(data.email);
            })
            .catch((err) => {
                console.log(err);
                setRegistrationSuccess(false);
                toggleInfoTooltip(true);
            })
    }

    //functions for Edit Profile

    function handleEditProfileClick (e) {
        toggleEditProfile(true);
    }
    function onUpdateUser (name, description) {
        toggleSaveText(true);
        api.changeProfileInfo({ name: name, about: description }).then(() => {
            setCurrentUserInfo();
        })
            .then(() => {
                toggleSaveText(false);
                toggleEditProfile(false);
            })
            .catch(err => console.log(err));

    }


    //functions for Edit Avatar
    function handleEditAvatarClick (e) {
        toggleEditAvatar(true);
    }
    function onUpdateAvatar (link) {
        toggleSaveText(true)
        api.updateAvatar(link).then(() => {
            setCurrentUserInfo();
        })
            .then(() => {
                toggleSaveText(false)
                toggleEditAvatar(false);
            })
            .catch(err => console.log(err));

    }


    //functions for Add place
    function handleAddCardClick (e) {
        toggleAddCard(true);
    }
    function onAddPlace (name, link) {
        toggleSaveText(true);
        api.addCard({ name: name, link: link }).then((card) => {
            const newCard = {
                name: card.name,
                link: card.link,
                likes: card.likes,
                id: card._id,
                ownerId: card.owner._id
            }
            setCards([...cards, newCard]);
        }).then(() => {
            toggleSaveText(false);
            toggleAddCard(false);
        })
            .catch(err => console.log(err));
    }


    //functions for Cards
    function onCardDelete (cardId) {
        toggleSaveText(true);
        //delete card from server
        api.deleteCard(cardId).then(() => {
            //filter cards on page and remove the card with matching id from the array
            const filteredCards = cards.filter(card => card.id !== cardId)
            //set new card array state
            setCards(filteredCards);
        })
            .then(() => {
                toggleSaveText(false);
                toggleConfirmDelete(false);
            })
            .catch(err => console.log(err));

    }
    function handleDeleteClick (cardId) {
        setConfirmDeleteId(cardId);
        toggleConfirmDelete(true);

    }
    function handleCardClick (link, name) {
        setSelectedCard({ link: link, name: name, isOpen: true });
    }
    function handleCardLike (cardLikes, cardId) {
        // Check one more time if this card was already liked
        const isLiked = cardLikes.some(i => i._id === currentUser._id);
        // Send a request to the API and getting the updated card data
        api.changeLikeCardStatus(cardId, !isLiked).then((card) => {
            const newCard = {
                name: card.name,
                link: card.link,
                likes: card.likes,
                id: card._id,
                ownerId: card.owner._id
            }
            // Create a new array based on the existing one and putting a new card into it
            const newCards = cards.map((c) => c.id === cardId ? newCard : c);
            // Update the state
            setCards(newCards);
        })
            .catch(err => console.log(err));
    }

    //function to assign context data

    function setCurrentUserInfo () {
        api.getUserInfo().then((res) => {
            setCurrentInfo({
                name: res.name,
                about: res.about,
                avatar: res.avatar,
                _id: res._id
            });
        })
            .catch(err => console.log(err));
    }


    //global functions

    function closeAllPopups (e) {
        if (e.target === e.currentTarget) {
            toggleEditAvatar(false);
            toggleEditProfile(false);
            toggleAddCard(false);
            toggleConfirmDelete(false);
            toggleInfoTooltip(false);
            setSelectedCard({ link: "", name: "", isOpen: false })
        }
    }

    function isOpen () {
        if (selectedCard.isOpen || editAvatarIsOpen || editProfileIsOpen || addCardIsOpen || confirmDeleteIsOpen || infoTooltipIsOpen) {
            return true;
        } else {
            return false
        }
    }

    // API request to verify JWT
    useEffect(() => {
        if (localStorage.getItem('token')) {
            authApi.checkToken(localStorage.getItem('token'))
                .then((res) => {
                    if (res.status === 400) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('email');
                        return Promise.reject(new Error('No token or improper format'));
                    } else if (res.status === 401) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('email');
                        return Promise.reject(new Error('Invalid token'));
                    } else {
                        toggleLoggedIn(true);
                        setEmail(localStorage.getItem('email'));
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            return
        }
    }, []);

    //API request for User Info
    useEffect(() => {
        api.getUserInfo().then((res) => {
            const currentInfo = {
                name: res.name,
                about: res.about,
                avatar: res.avatar,
                _id: res._id
            }
            setCurrentInfo(currentInfo);
            return currentInfo
        }).then((info) => {

            api.getCardList().then((res) => {
                setCards(res.map((card) => {
                    return {
                        name: card.name,
                        link: card.link,
                        likes: card.likes,
                        id: card._id,
                        ownerId: card.owner._id,
                        myId: info._id
                    }
                }))
            })
                .catch(err => console.log(err))
        })
            .catch(err => console.log(err))

    }, [])

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <div className="App">
                <div className="page">

                    <Router>
                        <Switch>
                            <Route exact path="/">
                                <Header
                                    email={email}
                                    setEmail={setEmail}
                                    hamburger={hamburger}
                                    toggleHamburgerState={toggleHamburgerState} />
                                <ProtectedRoute
                                    component={Main}
                                    isLoggedIn={isLoggedIn}
                                    selectedCard={selectedCard}
                                    handleEditAvatarClick={handleEditAvatarClick}
                                    handleEditProfileClick={handleEditProfileClick}
                                    handleAddCardClick={handleAddCardClick}
                                    handleCardClick={handleCardClick}
                                    setCards={setCards}
                                    cards={cards}
                                    handleDeleteClick={handleDeleteClick}
                                    handleCardLike={handleCardLike}
                                />
                            </Route>
                            <Route exact path="/login">
                                <Header name="Sign Up" link="/register" />
                                {isLoggedIn ? <Redirect to="/" /> : <Auth
                                    name="Log in"
                                    link="/register"
                                    linkName="Sign up"
                                    loginRequest={loginRequest}
                                    buttonDescription="Not a member yet?" />}
                            </Route>
                            <Route exact path="/register">
                                <Header name="Log in" link="/login" />
                                {isLoggedIn ? <Redirect to="/" /> : <Auth
                                    name="Sign Up"
                                    link="/login"
                                    linkName="Log in"
                                    registerRequest={registerRequest}
                                    buttonDescription="Already a member?" />}
                            </Route>
                            <Redirect from="*" to="/" />
                        </Switch>
                    </Router>
                    {/* Popup forms */}
                    <section className={`modal ${isOpen() ? "modal_display_visible" : ""}`} onClick={closeAllPopups}>

                        {/* Update Avatar form */}

                        <EditAvatarPopup onUpdateAvatar={onUpdateAvatar} isOpen={editAvatarIsOpen} onClose={closeAllPopups} isSaving={isSaving} />

                        {/* Edit profile form */}
                        <EditProfilePopup onUpdateUser={onUpdateUser}
                            isOpen={editProfileIsOpen} onClose={closeAllPopups} isSaving={isSaving} />

                        {/* Add Card form */}
                        <AddPlacePopup onUpdateUser={onUpdateUser}
                            isOpen={addCardIsOpen} onClose={closeAllPopups} onAddPlace={onAddPlace} isSaving={isSaving} />

                        {/* Confirm delete popup */}
                        <ConfirmDeletePopup isOpen={confirmDeleteIsOpen} onClose={closeAllPopups} onCardDelete={onCardDelete} confirmDeleteId={confirmDeleteId} isSaving={isSaving} />
                        {/* Image Popup form */}
                        <ImagePopup isOpen={selectedCard.isOpen} onClose={closeAllPopups} name={selectedCard.name} link={selectedCard.link} />
                        {/* Confirm registration popup */}
                        <InfoTooltip isOpen={infoTooltipIsOpen} onClose={closeAllPopups} registrationSuccess={registrationSuccess} ></InfoTooltip>
                    </section>



                    <Footer />

                </div>
            </div>
        </CurrentUserContext.Provider>
    );
}

export default App;
