import './sass/main.scss';

// +1. Список параметров строки запроса которые тебе обязательно необходимо указать:
// key - твой уникальный ключ доступа к API.
// q - термин для поиска. То, что будет вводить пользователь.
// image_type - тип изображения. Мы хотим только фотографии, поэтому задай значение photo.
// orientation - ориентация фотографии. Задай значение horizontal.
// safesearch - фильтр по возрасту. Задай значение true.

// +2. В ответе будет массив изображений удовлетворивших критериям параметров запроса.
// Каждое изображение описывается объектом, из которого тебе интересны только следующие свойства:
// webformatURL - ссылка на маленькое изображение для списка карточек.
// largeImageURL - ссылка на большое изображение.
// tags - строка с описанием изображения. Подойдет для атрибута alt.
// likes - количество лайков.
// views - количество просмотров.
// comments - количество комментариев.
// downloads - количество загрузок.
// +3. Если бэкенд возвращает пустой массив, значит ничего подходящего найдено небыло.
// В таком случае показывай уведомление с текстом "Sorry, there are no images matching your search query. Please try again."
// Для уведомлений используй библиотеку notiflix.

// +4. Элемент div.gallery изначально есть в HTML документе, и в него необходимо рендерить разметку карточек изображений.
// При поиске по новому ключевому слову необходимо полностью очищать содержимое галереи, чтобы не смешивать результаты.

//  Пагинация
// Pixabay API поддерживает пагинацию и предоставляет параметры page и per_page.
// +5. Сделай так, чтобы в каждом ответе приходило 40 объектов(по умолчанию 20).

// +6. Изначально значение параметра page должно быть 1.
// При каждом последующем запросе, его необходимо увеличить на 1.
// +7. При поиске по новому ключевому слову значение page надо вернуть в исходное,
// так как будет пагинация по новой коллекции изображений.

// +8. В HTML документе уже есть разметка кнопки при клике по которой 
// необходимо выполнять запрос за следующей группой изображений и добавлять разметку к уже существующим элементам галереи.
{/* <button type="button" class="load-more">Load more</button>
Изначально кнопка должна быть скрыта. */}
// После первого запроса кнопка появляется в интерфейсе под галереей.
// При повторном сабмите формы кнопка сначала прячется, а после запроса опять отображается.
// +9. В ответе бэкенд возвращает свойство totalHits - общее количество изображений
// которые подошли под критерий поиска(для бесплатного аккаунта).Если пользователь дошел до конца коллекции,
//  пряч кнопку и выводи уведомление с текстом "We're sorry, but you've reached the end of search results.".
// +10. Уведомление
// После первого запроса при каждом новом поиске выводить уведомление в котором будет написано сколько всего нашли изображений(свойство totalHits).
// Текст уведомления "Hooray! We found totalHits images."

// +11. Библиотека SimpleLightbox
// Добавить отображение большой версии изображения с библиотекой SimpleLightbox для полноценной галереи.

// +В разметке необходимо будет обернуть каждую карточку изображения в ссылку, как указано в документации.
// У библиотеки есть метод refresh() который обязательно нужно вызывать каждый раз после добавления
//  новой группы карточек изображений.
// Для того чтобы подключить CSS код библиотеки в проект,
//  необходимо добавить еще один импорт, кроме того который описан в документации.
// // Описан в документации
// import SimpleLightbox from 'simplelightbox';
// // Дополнительный импорт стилей
// import 'simplelightbox/dist/simple-lightbox.min.css';

// 12. Прокрутка страницы
// Сделать плавную прокрутку страницы после запроса и отрисовки каждой следующей группы изображений. 
// Вот тебе код подсказка, а разберись в нём самостоятельно.

// const { height: cardHeight } = document
//   .querySelector('.gallery')
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: 'smooth',
// });

const Handlebars = require("handlebars");
import imageCardsTpl from "./templates/image-cards.hbs";
import Notiflix from 'notiflix';
import ApiService from './api-service';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
// import InfiniteScroll from "infinite-scroll";

const refs = {
    form: document.querySelector(".search-form"),
    input: document.querySelector("input"),
    gallery: document.querySelector(".gallery"),
    loadMoreBtn: document.querySelector(".load-more"),
};
// let timerID;
// let isPaused = false;

const apiService = new ApiService();
let gallery = new SimpleLightbox('.gallery a');
// const throttle = require('lodash.throttle');
// let infScroll = new InfiniteScroll( '.container', {
//     path: function() {
//         let pageNumber = ( this.loadCount + 1 ) * 10;
//         return `/articles/P${pageNumber}`;
//     },
//     append: '.post',
//     history: false,
// });

refs.form.addEventListener("submit", onFormSubmit);
refs.loadMoreBtn.addEventListener("click", onLoadMoreBtnClick);

// это бесконечный скролл
window.addEventListener("scroll", () => {
    // document.documentElement - Это весь html,а getBoundingClientRect() - выводит координаты, 
    // bottom показывает нижние координаты 
    const documentRect = document.documentElement.getBoundingClientRect();
    // document.documentElement.clientHeight - высота окна + 150px? что бы не ждать самого конца
    if (documentRect.bottom < document.documentElement.clientHeight + 150) {
        onLoadMoreBtnClick();
    }
});

function onFormSubmit(event) {
    event.preventDefault();
    clearMarkup();
    apiService.querySearch = event.currentTarget.elements.searchQuery.value.trim();
    if (apiService.querySearch === "") {
        return Notiflix.Notify.warning ("Insert query word, please");
    }
    apiService.resetPage();
    apiService.fetchImages().then(value => {
        if (value.hits.length === 0) {
            Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        } else {
            Notiflix.Notify.info(`Hooray! We found ${value.totalHits} images.`);
            renderImageCards(value.hits);
            // setTimeout(() => {
            //     const scrollInt = setInterval(scrollBy, 100)
            // isPaused = false;
            // window.addEventListener("scroll", () => {
            //     isPaused = true;
            //     // clearTimeout(timer);
            //     timer = window.setTimeout(() => {
            //         isPaused = false;
            //     }, 1000);   
            // });
            // }, 3000); 
    
            setTimeout(() =>
                setInterval(() =>  smoothScroll(), 100), 2000);
            
            gallery.refresh();
            refs.loadMoreBtn.classList.remove("hidden");
        }
    })
    .catch(onFetchError);
}

function renderImageCards(images) {
    refs.gallery.insertAdjacentHTML("beforeend", imageCardsTpl(images))
}

function onFetchError(error) {
    console.log(error.message);
}

function clearMarkup() { 
    refs.gallery.innerHTML = "";
    refs.loadMoreBtn.classList.add("hidden");
}

function onLoadMoreBtnClick() {
    apiService.fetchImages().then(value => {
        renderImageCards(value.hits);

        setTimeout(() =>
            setInterval(() =>  smoothScroll(), 100), 2000);

        gallery.refresh();
        refs.loadMoreBtn.classList.add("hidden");
        if (value.hits.length < 40) {
            return  Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
        }
        refs.loadMoreBtn.classList.remove("hidden");
    }).catch(onFetchError);
}

function smoothScroll() {
    const { height: cardHeight } = document
                .querySelector('.gallery')
                .firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
    });    

        // const { height: cardHeight } = refs.gallery.firstElementChild.getBoundingClientRect();
        // window.scrollBy({
        //     top: cardHeight * 2,
        //     behavior: 'smooth',
        // })
    
    
    
    // window.addEventListener("click", clearInterval(intervalID));
    // setInterval(() => {
    //     if (!isPaused) {
    //         window.scrollBy({
    //             top: cardHeight * 2,
    //             behavior: 'smooth',
    //         })
    //     }
    // }, 1000)
}