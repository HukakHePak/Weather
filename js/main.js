const SERVER_URL = 'http://api.openweathermap.org/data/2.5/weather';
const API_KEY = 'f660a2fb1e4bad108d6160b7f58c555f';

import {UI} from './view.js'

const WEATHER_STORAGE_KEY = {
    COLLECTION: 'weather_favorite_collection',
    BUFFER:'weather_buffer',
    TAB: 'weather_opened_tab'
}

function requestWeather(cityName) {
    fetch(`${SERVER_URL}?q=${cityName}&appid=${API_KEY}`)
    .then(response => response.text())
    .then(response => {
        localStorage.setItem(WEATHER_STORAGE_KEY.BUFFER, response);
        updateTabs();
    });
}

function isCollected(cityName) {
    let collection = localStorage.getItem(WEATHER_STORAGE_KEY.COLLECTION);
        collection = collection ? collection.split(', ') : [];     
    return collection.length && collection.includes(cityName);
}


function updateTabs() {
    const weather = JSON.parse(localStorage.getItem(WEATHER_STORAGE_KEY.BUFFER));
    const NOW = UI.WEATHER.DISPLAY.VALUES.NOW;
    const DETAILS = UI.WEATHER.DISPLAY.VALUES.DETAILS;
    {
        
        NOW[0];
    }
    NOW[1].textContent = DETAILS[1].textContent = Math.round(weather.main.temp - 273);
    NOW[2].textContent = DETAILS[0].textContent = weather.name;
    if(isCollected(weather.name)) NOW[3].classList.add('active');
    else NOW[3].classList.remove('active');
    DETAILS[2].textContent = Math.round(weather.main.feels_like - 273);
    DETAILS[3].textContent = weather.weather[0].main;
    DETAILS[4].textContent = weather.sys.sunrise;
    DETAILS[5].textContent = weather.sys.sunset;
};

function updateFavors() {
    const favorites = UI.WEATHER.FAVORITE.LIST.children;
    while(favorites.length) favorites[0].remove();

    let collection = localStorage.getItem(WEATHER_STORAGE_KEY.COLLECTION);
    collection = collection ? collection.split(', ') : [];

    collection.forEach(city => {
        const newFavorite = UI.WEATHER.FAVORITE.TEMPLATE.cloneNode(true);  
        newFavorite.textContent = city;
        UI.WEATHER.FAVORITE.LIST.prepend(newFavorite); 
    })
}

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

UI.WEATHER.SEARCH.FORM.addEventListener('submit', (event) => {
    requestWeather(UI.WEATHER.SEARCH.CITY.value);
    event.preventDefault();
    event.target.reset();
});

UI.WEATHER.FAVORITE.LIKE.addEventListener('click', (event) => {
    const city = JSON.parse(localStorage.getItem(WEATHER_STORAGE_KEY.BUFFER));
    if(city) {
        event.target.classList.toggle('active');
        let collection = localStorage.getItem(WEATHER_STORAGE_KEY.COLLECTION);
        collection = collection ? collection.split(', ') : [];
        
        if(isCollected(city.name)) 
            collection = collection.filter(item => item != city.name);
        else collection.push(city.name);
        localStorage.setItem(WEATHER_STORAGE_KEY.COLLECTION, collection.join(", "));
        updateFavors();
    }
});

updateTabs();
updateFavors();
