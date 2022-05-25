import './sass/main.scss';

// Список параметров строки запроса которые тебе обязательно необходимо указать:
// key - твой уникальный ключ доступа к API.
// q - термин для поиска. То, что будет вводить пользователь.
// image_type - тип изображения. Мы хотим только фотографии, поэтому задай значение photo.
// orientation - ориентация фотографии. Задай значение horizontal.
// safesearch - фильтр по возрасту. Задай значение true.

// В ответе будет массив изображений удовлетворивших критериям параметров запроса.
// Каждое изображение описывается объектом, из которого тебе интересны только следующие свойства:
// webformatURL - ссылка на маленькое изображение для списка карточек.
// largeImageURL - ссылка на большое изображение.
// tags - строка с описанием изображения. Подойдет для атрибута alt.
// likes - количество лайков.
// views - количество просмотров.
// comments - количество комментариев.
// downloads - количество загрузок.
// Если бэкенд возвращает пустой массив, значит ничего подходящего найдено небыло.
// В таком случае показывай уведомление с текстом "Sorry, there are no images matching your search query. Please try again."
// Для уведомлений используй библиотеку notiflix.

const Handlebars = require("handlebars");
import imageCardsTpl from "./templates/image-cards.hbs";
import { fetchImages } from './fetchImages';
import Notiflix from 'notiflix';

const refs = {
    form: document.querySelector(".search-form"),
    input: document.querySelector("input"),
    btn: document.querySelector("button"),
    gallery: document.querySelector(".gallery"),
};

refs.form.addEventListener("submit", onFormSubmit);


function onFormSubmit(event) {
    event.preventDefault();
    clearMarkup();
    let querySearch = event.currentTarget.elements.searchQuery.value.trim();

    fetchImages(querySearch).then(value => {
        if (value.hits.length === 0) {
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
            console.log(value)
        } else {
            renderImageCards(value);
            console.log(value.hits)
            console.log(value.hits.lenght)
        }
    }).catch(onFetchError);
}

function renderImageCards(images) {
    const markup = imageCardsTpl(images);
    refs.gallery.innerHTML = markup;
}

function onFetchError(error) {
    console.log(error.message);
}

function clearMarkup() { 
    refs.gallery.innerHTML = "";
}