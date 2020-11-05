import { apiEndpointsRegister } from './utils';

class Auth {
    constructor(endpoint) {
        this._apiEndpoint = endpoint.url;
        this._headers = endpoint.headers;
    }

    _checkResponse (res) {
        return (res.ok ? res.json() : Promise.reject(`Error: ${res.status}`));
    }
    getUserInfo () {
        return fetch(`${this._apiEndpoint}/users/me`, {
            headers: this._headers,
        })
            .then((res) => {
                return this._checkResponse(res)
            })
    }

    signUp(email, password) {
        return fetch(`${this._apiEndpoint}/signup`, {
            method: "POST",
            headers: this._headers,
            body: JSON.stringify({email, password})
        })
        .then((res) => {
            return this._checkResponse(res);
        })
    }

    signIn(email, password) {
        return fetch(`${this._apiEndpoint}/signin`, {
            method: "POST",
            headers: this._headers,
            body: JSON.stringify({email, password})
        })
            .then((res) => {
                return this._checkResponse(res);
            })
    }
    
    checkToken(jwt) {
        return fetch(`${this._apiEndpoint}/users/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwt}`
            }
        })
    }
    
}

const authApi = new Auth(apiEndpointsRegister);

export { authApi };
