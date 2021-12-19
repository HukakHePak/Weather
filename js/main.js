const SERVER_URL = 'http://api.openweathermap.org/data/2.5/weather';
const API_KEY = 'f660a2fb1e4bad108d6160b7f58c555f';

import {UI} from './view.js'

//const FAVORITE_STORAGE = sessionStorage.favourite;
const WEATHER_BUFFER = undefined;

function updateTabs(weather) {
    const NOW = UI.WEATHER.DISPLAY.VALUES.NOW;
    const DETAILS = UI.WEATHER.DISPLAY.VALUES.DETAILS;
    NOW[0];
    NOW[1].textContent = DETAILS[1].textContent = Math.round(weather.main.temp - 273);
    NOW[2].textContent = DETAILS[0].textContent = weather.name;
    DETAILS[2].textContent = Math.round(weather.main.feels_like - 273);
    DETAILS[3].textContent = weather.weather[0].main;
    DETAILS[4].textContent = weather.sys.sunrise;
    DETAILS[5].textContent = weather.sys.sunset;
};

UI.WEATHER.DISPLAY.BUTTONS.forEach((node, index) => {
    node.addEventListener('click', () => {
        const tabs = UI.WEATHER.DISPLAY.TABS;
        UI.WEATHER.DISPLAY.BUTTONS.forEach((node, index) => {
            node.classList.remove('active');
            tabs[index].classList.remove('active');
        });
        node.classList.add('active');
        tabs[index].classList.add('active');
    });
});

UI.WEATHER.FAVORITE.BUTTON.addEventListener('click', () => {
    const newFavorite = UI.WEATHER.FAVORITE.TEMPLATE.cloneNode(true);
    newFavorite.textContent = weather.name;
    UI.WEATHER.FAVORITE.LIST.append(newFavorite);
});

UI.WEATHER.SEARCH.FORM.addEventListener('submit', (event) => {
    fetch(`${SERVER_URL}?q=${UI.WEATHER.SEARCH.CITY.value}&appid=${API_KEY}`)
    .then(response => response.json())
    .then(response => updateTabs(response))
    event.preventDefault();
    event.target.reset();
});


