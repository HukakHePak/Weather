import { UI } from './view.js'
import { STORAGE } from './storage.js';

const URL = {
    CURRENT: 'https://api.openweathermap.org/data/2.5/weather',
    FORECAST: 'https://api.openweathermap.org/data/2.5/forecast',
    ICON: 'https://openweathermap.org/img/wn',
    API_KEY: 'f660a2fb1e4bad108d6160b7f58c555f',
}

async function requestURL(cityName, url) {
    const response = await fetch(`${url}?q=${cityName}&appid=${URL.API_KEY}`);

    if(response.ok) return await response.text(); 

    throw new Error(response);     
}

async function getWeather(cityName) {
    if(!cityName) return;

    try {
        STORAGE.LAST.WEATHER.set( await requestURL(cityName, URL.CURRENT) );
        STORAGE.LAST.FORECAST.set( await requestURL(cityName, URL.FORECAST) );

        updateDisplay();
    } catch(error) { 
        console.error(error);
        UI.WEATHER.SEARCH_FORM.notify('Unknown city');
    } 
}

function toCelcius(temperature) {
    return Math.round(temperature - 273);
}

function toTimeHM(time) {
    const date = new Date(time * 1000);
    return date.getHours() + ':' + date.getMinutes();
}

function toDateDM(time) {
    const date = new Date(time * 1000);
    return  date.getDate()  + ' ' + date.toLocaleString('en', { month: 'short' });;
}

function toWeatherObj(obj) {
    return {
        date: toDateDM(obj.dt),
        time: obj.dt_txt ? obj.dt_txt.slice(-8, -3) : undefined,
        temp: toCelcius(obj.main.temp),
        feels: toCelcius(obj.main.feels_like),
        main: obj.weather[0].main,
        icon: `${URL.ICON}/${obj.weather[0].icon.slice(0, 2)}n@2x.png`,
        like: STORAGE.CITIES.includes(obj.name),
        city: obj.name,
        sunrise: toTimeHM(obj.sys.sunrise),
        sunset: toTimeHM(obj.sys.sunset),
    };
}

function updateDisplay() {
    const List = [];

    const lastForecast = STORAGE.LAST.FORECAST.get();

    if(!lastForecast) return;

    lastForecast.forEach( weather => {
        List.push( toWeatherObj(weather) );
    });

    UI.WEATHER.DISPLAY.TABS.update( toWeatherObj( STORAGE.LAST.WEATHER.get() ), List);
};

{
    const display = UI.WEATHER.DISPLAY;

    display.BUTTONS.forEach( (button, index) => {
        button.addEventListener('click', () => {
            display.TABS.clear();
            display.TABS.select(index);

            STORAGE.LAST.TAB.set(index);
        });
    });
}

{
    const activeTab = STORAGE.LAST.TAB.get();

    if(activeTab) {
        UI.WEATHER.DISPLAY.BUTTONS[activeTab].click();
    } 
} 

function removeCity(cityName) {
    if(STORAGE.LAST.WEATHER.get().name == cityName) {
        UI.WEATHER.FAVORITE.dislike();
    }

    STORAGE.CITIES.remove(cityName);       
}

{
    const favorite = UI.WEATHER.FAVORITE;

    favorite.LIKE.addEventListener('click', () => {
        const CITY = STORAGE.LAST.WEATHER.get().name;

        if(!CITY) return;  

        if(STORAGE.CITIES.includes(CITY)) {
            removeCity(CITY);
            favorite.LIST.remove(CITY);

            return;      
        } 

        STORAGE.CITIES.add(CITY);
        favorite.LIST.add(CITY, getWeather, removeCity);
        favorite.like();
    });
}

{
    const search = UI.WEATHER.SEARCH_FORM;
    
    search.NODE.addEventListener('submit', event => {  
        getWeather( search.getCity() );
        
        search.NODE.reset();
        event.preventDefault();
    });

    const lastCity = STORAGE.LAST.WEATHER.get();

    !lastCity ? getWeather("City") : getWeather(lastCity.name);

    UI.WEATHER.FAVORITE.LIST.update(STORAGE.CITIES.get(), getWeather,removeCity);
}

// let set = new Set();
// set.add('first city');
// set.add('second city');
// console.log(...set);

// localStorage.setItem('test', JSON.stringify([...set]));
// let get = new Set(JSON.parse(localStorage.getItem('test')));
// get.delete('first city');
// console.log(get);