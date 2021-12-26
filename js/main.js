import { UI } from './view.js'
import { WEATHER_STORAGE } from './storage.js';

const WEATHER_URL = {
    CURRENT: 'https://api.openweathermap.org/data/2.5/weather',
    FORECAST: 'https://api.openweathermap.org/data/2.5/forecast',
    ICON: 'https://openweathermap.org/img/wn',
    API_KEY: 'f660a2fb1e4bad108d6160b7f58c555f',
}

function requestURL(cityName, url, callback) {
    if(!cityName)  return;
    fetch(`${url}?q=${cityName}&appid=${WEATHER_URL.API_KEY}`)
        .then( response => response.text() )
        .then( response => { 
            if(JSON.parse(response).cod == '404') {
                throw new Error();
            }   
            callback(response);             
        })
        .then (updateDisplay) /////////// remake this 
        .catch( () => {
            alert('not found');
        }); 
        
}

function getWeather(cityName) {
    requestURL(cityName, WEATHER_URL.CURRENT, response => {
        WEATHER_STORAGE.LAST.WEATHER.set(response);      
    });

    requestURL(cityName, WEATHER_URL.FORECAST, response => {
        WEATHER_STORAGE.LAST.FORECAST.set(response); 
    })
    
    ///////// add await for updater
}

function toCelcius(temperature) {
    return Math.round(temperature - 273);
}

function toTimeHM(time) {
    const date = new Date(time * 1000);
    return date.getHours() + ':' + date.getMinutes();
}

function updateDisplay() {
    const WEATHER = WEATHER_STORAGE.LAST.WEATHER.get();
    const FORECAST = WEATHER_STORAGE.LAST.FORECAST.get();

    

    const weather = {
        city: WEATHER.name,
        temp: toCelcius(WEATHER.main.temp),
        feels: toCelcius(WEATHER.main.feels_like),
        main: WEATHER.weather[0].main,
        icon: `${WEATHER_URL.ICON}/${WEATHER.weather[0].icon.slice(0, 2)}n@2x.png`,
        sunrise: toTimeHM(WEATHER.sys.sunrise),
        sunset: toTimeHM(WEATHER.sys.sunset),
        forecast: undefined,
    }



    UI.WEATHER.DISPLAY.update(weather);

    const FAVORITES = UI.WEATHER.FAVORITE;
    
    WEATHER_STORAGE.CITIES.includes(WEATHER.name) ? FAVORITES.like() : FAVORITES.dislike();
};

{
    const DISPLAY = UI.WEATHER.DISPLAY;

    DISPLAY.BUTTONS.forEach( (button, index) => {
        button.addEventListener('click', () => {
            DISPLAY.clear();
            DISPLAY.select(index);
            WEATHER_STORAGE.LAST.TAB.set(index);
        });});
}

{
    const ACTIVE_TAB = WEATHER_STORAGE.LAST.TAB.get();

    if(ACTIVE_TAB) {
        UI.WEATHER.DISPLAY.BUTTONS[ACTIVE_TAB].click();
    } 
}

{
    const SEARCH = UI.WEATHER.SEARCH;
    
    SEARCH.FORM.addEventListener('submit', event => {  
        getWeather( SEARCH.getCity() );
        SEARCH.FORM.reset(); 
        event.preventDefault(); 
    });
}

{
    const FAVORITES = UI.WEATHER.FAVORITE;

    FAVORITES.LIKE.addEventListener('click', () => {
        const STORAGE = WEATHER_STORAGE.CITIES;
        const CITY = WEATHER_STORAGE.LAST.WEATHER.get().name;

        if(!CITY) return;  

        if(STORAGE.includes(CITY)) {
            STORAGE.remove(CITY);
            FAVORITES.remove(CITY);
            FAVORITES.dislike();
            return;      
        } 

        STORAGE.add(CITY);
        FAVORITES.add(CITY, getWeather, STORAGE.remove);
        FAVORITES.like();    
    });
}

if(WEATHER_STORAGE.LAST.WEATHER.get() == {}) {
    getWeather("City");
 }

updateDisplay();

UI.WEATHER.FAVORITE.update(WEATHER_STORAGE.CITIES.get(), getWeather, WEATHER_STORAGE.CITIES.remove);

/*  TODO:
remake: 
    localstorage using ------------ done
    fetch catch (add small window with notification under search)
    modules

add: 
    forecast filler
    hovers and clickers

optimize:
    updaters



*/