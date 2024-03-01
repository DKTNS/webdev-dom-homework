import { setToken, token, register} from "./api";
import { renderComments } from "./render";
import {setUser} from "./main.js"


export const renderRegisterForm = () => {
    const registerAppHtml = document.getElementById("app");
    const registerHtml = `
    <div class="container">
    <div class="add-form">
    <p class="heading">Форма регистрации</p>
      <div class="input">
        <input type="text" id="name-input" class="add-form-input" placeholder="Имя" />
        <input type="text" id="login-input" class="add-form-input" placeholder="Логин" />
        <input type="text" id="password-input" class="add-form-input" placeholder="Пароль" />
      </div>
      <br />
      <button class="add-form-login-button" id="register-button">Зарегистрироваться</button>
      <br />
      <a href="index.html" class="link">Войти</a>
    </div>
    </div>`;
    registerAppHtml.innerHTML = registerHtml;
    const registerButtonElement = document.getElementById("register-button");
    const nameInnputElement = document.getElementById("name-input");
    const loginInputElement = document.getElementById("login-input");
    const passwordInputElement = document.getElementById("password-input");

    registerButtonElement.addEventListener("click", () => {
        if (!loginInputElement.value || !passwordInputElement.value || !nameInputElement.value) {
            alert("Проверьте оба поля  на заполненность");
            return
          }
        register({
            name: nameInnputElement.value,
            login: loginInputElement.value,
            password: passwordInputElement.value,
        }).then((responseData) => {
            setUser(responseData.user.name);
            setToken(responseData.user.setToken)ж
            console.log(responseData.user.name);
            console.log(setToken);
        });
    });
    renderRegisterForm();
}
    