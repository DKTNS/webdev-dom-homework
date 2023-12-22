
// Поиск в именах id 
  const buttonElement = document.getElementById("add-form-button");
  const listElement = document.getElementById("comments");
  const textAreaElement = document.getElementById("add-text");
  const inputElement = document.getElementById("add-name");
  const outerFormElement = document.getElementById("add-form");
  const buttonDeleteElement = document.getElementById("delete-form-button")
  const addFormElement = document.querySelector(".add-form");
  const formatDateTime = (date) => {
    let dateTime = new Date(date);
    const day = String(dateTime.getDate()).padStart(2, '0');
    const month = String(dateTime.getMonth()).padStart(2, '0');
    const year = String(dateTime.getFullYear() - 2000);
    const minutes = String(dateTime.getMinutes()).padStart(2, '0');
    const hours = String(dateTime.getHours()).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };
  let urlApi = "https://wedev-api.sky.pro/api/v1/zenin-dmitry/comments";
  //Прелоадер страницы


  // запрос коммента с api
  const getComments = () => {


    let fetchPromise = fetch(urlApi,
      {
        method: 'GET',
      })
      .then((response) => {
        return response.json();
      }).then((responseData) => {
        commentList = responseData.comments.map((comment) => {
          return {
            name: comment.author.name,
            date: formatDateTime(comment.date),
            id: comment.id,
            isLiked: comment.isLiked,
            likes: comment.likes,
            text: comment.text,
          };
        });
        let hidePreload = document.querySelector(".preload").style.display = "none";
        console.log(commentList);
        hideSeeAddComment();
        renderComments();
        buttonElement.disabled = false;
      });
  };

  const hideSeeAddComment = () => {
    buttonElement.addEventListener("click", () => {
      buttonElement.disabled = true;
      listElement.textContent = "Добавление комментария";
    });
    buttonElement.disabled = false;
    listElement.textContent = "";
  }

  //1.commentList необходимо получать из хранилища коммент через API (метод GET). Строки 47-62
  getComments();

  //Сохранение данных форм комментов из html в js
  let commentList = [];


  //Активность кнопки удаления
  const initDeleteButtonsListeners = () => {
    const deleteButtonsElements = document.querySelectorAll(".delete-form-button");
    for (const deleteButtonsElement of deleteButtonsElements) {
      deleteButtonsElement.addEventListener("click", (event) => {
        event.stopPropagation();
        const index = deleteButtonsElement.dataset.index;
        commentList.splice(index, 1);
        renderComments();
      });
    }

  };

  //Отрисовка формы существующих комментов
  const renderComments = () => {
    const commentsHtml = commentList.map((comment, index) => {
      return `<li class="comment" data-index="${index}">
          <div class="comment-header">
            <div id="add-name">${comment.name}</div>
            <div>${comment.date}</div>
          </div>
          <div class="comment-body">
            <div id="add-text" class="comment-text" >
              ${comment.text}
            </div>
          </div>
          <div class="comment-footer">
            <button id="delete-form-button" class="delete-form-button" data-index="${index}">Удалить</button>
            <div class="likes">
              <span class="likes-counter">${comment.likes}</span>
              <button class="like-button ${comment.isLiked ? "-active-like" : ""}" data-index="${index}"></button>
            </div>
          </div>
        </li>`;
    }).join("");
    listElement.innerHTML = commentsHtml;
    initLikeListener();
    initDeleteButtonsListeners();
    quoteCommets();
  };
  //Активность кнопки лайк
  const initLikeListener = () => {
    const buttonLike = document.querySelectorAll(".like-button");
    for (const iteratorLike of buttonLike) {
      iteratorLike.addEventListener("click", (event) => {
        event.stopPropagation();
        const index = iteratorLike.dataset.index;
        commentList[index].likes += commentList[index].isLiked ? -1 : +1;
        commentList[index].isLiked = !commentList[index].isLiked;
        renderComments(); //перерисовываем форму для лайков с счетчиком
      });
    }
  };

  //Цитата коммента
  const quoteCommets = () => {
    const commentElements = document.querySelectorAll(".comment");
    for (const commentElement of commentElements) {
      commentElement.addEventListener("click", () => {
        const index = commentElement.dataset.index;
        const commentText = commentList[index].text;
        const commentAuthor = commentList[index].name;
        textAreaElement.value = `${commentText} > ${commentAuthor}`;
      })
    }
  }
  //Кнопка с добавлением коммента

  buttonElement.addEventListener("click", () => {
    inputElement.classList.remove("error");
    if (inputElement.value === "") {
      inputElement.classList.add("error");
    }
    if (textAreaElement.value === "") {
      textAreaElement.classList.add("error");
      return;
    };
    const sanitizeHtml = (htmlString) => {
      return htmlString
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
    };
    //2.13. надпись о загрузке коммента и блокировка кнопки "добавить".

    const fetchPromise = () => {
      fetch(urlApi,
        {
          method: 'POST',
          body: JSON.stringify({
            name: sanitizeHtml(inputElement.value),
            text: sanitizeHtml(textAreaElement.value),
            date: formatDateTime(new Date),
            isLiked: false,
            likes: 0,
            forceError: true,
          })
        }).then((response) => {
          if (response.status === 400) {
            throw new Error("Некорректный запрос error 400");
          } else if (response.status === 500) {
            throw new Error("Ошибка сервера error 500");
          } else { response.json(); }
        })
        .then(() => {
          inputElement.value = "";
          textAreaElement.value = "";
          return getComments();
        })
        .catch((error) => {
          buttonElement.disabled = true;
          if (error.message === "Некорректный запрос error 400") {
            alert("Длина имени не может быть меньше 3 символов");
          } else if (error.message === "Ошибка сервера error 500") {
            alert("Ошибка сервера");
          } else if (error.message === "Failed to fetch") {
            alert("Отуствует соединение к интеренету");
          };
          buttonElement.disabled = false;
          renderComments();
        });
        
    };
    fetchPromise();

    renderComments();
  })
