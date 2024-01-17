import { formatDateTime } from "./datetime.js";
let urlApi = "https://wedev-api.sky.pro/api/v1/zenin-dmitry/comments";
let urlApiLogin = "https://wedev-api.sky.pro/api/user/login";
export let token = null;
export const setToken = (newToken) => {
    token = newToken;
};

export const getToken = () => {
    return token;
};

export let user = null;
export const setUser = (newUser) => {
    user = newUser;
};


export function getComments() {
    return fetch(urlApiLogin, {
        method: "GET",
        headers: {
            Authorization: setToken(),
        },
    }).then((response) => {
        return response.json();
    });
};

export function get() {
    return fetch(urlApi,
        {
            method: 'GET',
            headers: {
                Autorization: `Bearer ${token}`,
            },
        })
        .then((response) => {
            if (response.status === 401) {
                throw new Error("Вы не авторизованы");
            }
            return response.json();
        })
}

export const post = (name, text) => {
    console.log("conslole", name, text);
    return fetch(urlApi,
        {
            method: 'POST',
            headers: {
                Autorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: name,
                text: text,
                /*       date: formatDateTime(new Date),
                      isLiked: false,
                      likes: 0, */
                /* forceError: true, */
            }),
        })
};

export function loginPost({ login, password }) {
    return fetch(urlApiLogin,
        {
            method: 'POST',
            body: JSON.stringify({
                login,
                password,
            }),
        }).then((response) => {
            if (response.status === 400) {
                throw new Error("Некорректные логин\пароль 400");
            }
            return response.json();

        })
};