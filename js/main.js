const URL = {
    WEATHER: 'https://api.openweathermap.org/data/2.5/weather',
    ICON:  'https://openweathermap.org/img/wn'
}

const API_KEY = 'f660a2fb1e4bad108d6160b7f58c555f';

import {UI} from './view.js'

const WEATHER_STORAGE_KEY = {
    COLLECTION: 'weather_favorite_collection',
    BUFFER:'weather_buffer',
    LASTAB: 'weather_opened_tab'
}

function requestWeather(cityName) {
    if(cityName) {
        fetch(`${URL.WEATHER}?q=${cityName}&appid=${API_KEY}`)
        .then(response => response.text())
        .then(response => { 
            if(JSON.parse(response).cod != '404') 
            {
                localStorage.setItem(WEATHER_STORAGE_KEY.BUFFER, response);
                updateTabs();
            }           
        })
    }   
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

    NOW[1].textContent = DETAILS[1].textContent = Math.round(weather.main.temp - 273);
    NOW[2].textContent = DETAILS[0].textContent = weather.name;

    if(isCollected(weather.name)) NOW[3].classList.add('active');
    else NOW[3].classList.remove('active');

    DETAILS[2].textContent = Math.round(weather.main.feels_like - 273);
    DETAILS[3].textContent = weather.weather[0].main;

    let sunrise = new Date(weather.sys.sunrise * 1000);
    DETAILS[4].textContent = sunrise.getHours() + ':' + sunrise.getMinutes();
    let sunset = new Date(weather.sys.sunset * 1000);
    DETAILS[5].textContent = sunset.getHours() + ':' + sunset.getMinutes();

    const icon = weather.weather[0].icon.slice(0, 2);
    NOW[0].src = `${URL.ICON}/${icon}n@2x.png`;
};

function updateFavors() {
    const favorites = UI.WEATHER.FAVORITE.LIST.children;
    while(favorites.length) favorites[0].remove();

    let collection = localStorage.getItem(WEATHER_STORAGE_KEY.COLLECTION);
    collection = collection ? collection.split(', ') : [];

    collection.forEach(city => {
        const newFavorite = UI.WEATHER.FAVORITE.TEMPLATE.cloneNode(true);  
        newFavorite.firstElementChild.textContent = city;
        newFavorite.firstElementChild.addEventListener('click', event => requestWeather(event.target.textContent));
        newFavorite.lastElementChild.addEventListener('click', (event) => {
            const parent = event.target.parentElement;
            let collection = localStorage.getItem(WEATHER_STORAGE_KEY.COLLECTION);
            collection = collection ? collection.split(', ') : [];
            const newCollection = collection.filter(item => item != parent.firstElementChild.textContent).join(', ');
            localStorage.setItem(WEATHER_STORAGE_KEY.COLLECTION, newCollection);
            parent.remove();
            UI.WEATHER.DISPLAY.VALUES.NOW[3].classList.remove('active');
        }); 
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
        localStorage.setItem(WEATHER_STORAGE_KEY.LASTAB, index);
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

//localStorage.removeItem(WEATHER_STORAGE_KEY.BUFFER);

if(!JSON.parse(localStorage.getItem(WEATHER_STORAGE_KEY.BUFFER))) 
    requestWeather("City");
else updateTabs();

updateFavors();
//localStorage.removeItem(WEATHER_STORAGE_KEY.LASTAB);

const activeTab = localStorage.getItem(WEATHER_STORAGE_KEY.LASTAB);
if(activeTab != undefined) UI.WEATHER.DISPLAY.BUTTONS[activeTab].click();
else UI.WEATHER.DISPLAY.BUTTONS[0].click()
