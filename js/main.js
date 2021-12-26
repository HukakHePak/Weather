import { UI } from './view.js'
import { WEATHER_STORAGE } from './storage.js';

const WEATHER_URL = {
    CURRENT: 'https://api.openweathermap.org/data/2.5/weather',
    FORECAST: 'https://api.openweathermap.org/data/2.5/forecast',
    ICON: 'https://openweathermap.org/img/wn',
    API_KEY: 'f660a2fb1e4bad108d6160b7f58c555f',
}

async function requestURL(cityName, url) {
    const RESPONSE = await fetch(`${url}?q=${cityName}&appid=${WEATHER_URL.API_KEY}`);

    const WEATHER = await RESPONSE.text()

    if(JSON.parse(WEATHER).cod == '404') {
        throw new Error(WEATHER);
    } 

    return WEATHER;        
}

async function getWeather(cityName) {
    if(!cityName)  {
        return;
    }
    try {

        WEATHER_STORAGE.LAST.WEATHER.set(await requestURL(cityName, WEATHER_URL.CURRENT));

        WEATHER_STORAGE.LAST.FORECAST.set((await requestURL(cityName, WEATHER_URL.FORECAST)));

        updateDisplay();
    } catch(error) { 
        console.error(error);
        alert('not found');
    } 
    
}

function toCelcius(temperature) {
    return Math.round(temperature - 273);
}

function toTimeHM(time) {
    const DATE = new Date(time * 1000);
    return DATE.getHours() + ':' + DATE.getMinutes();
}

function toDateDM(time) {
    if(!time) return;

    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 
    'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return time.slice(8, 10) + ' ' + MONTHS[time.slice(5, 7) - 1];
}

function toWeatherObj(obj) {
    return {
        date: toDateDM(obj.dt_txt),
        time: obj.dt_txt ? obj.dt_txt.slice(-8, -3) : undefined,
        temp: toCelcius(obj.main.temp),
        feels:  toCelcius(obj.main.feels_like),
        main: obj.weather[0].main,
        icon:  `${WEATHER_URL.ICON}/${obj.weather[0].icon.slice(0, 2)}n@2x.png`,
        like: WEATHER_STORAGE.CITIES.includes(obj.name),
        city: obj.name,
        sunrise: toTimeHM(obj.sys.sunrise),
        sunset: toTimeHM(obj.sys.sunset),
    };
}

function updateDisplay() {
    const LIST = [];

    const FORECAST = WEATHER_STORAGE.LAST.FORECAST.get();
    if(!FORECAST) return;

    FORECAST.forEach( item => {
        LIST.push( toWeatherObj(item) );
    });

    UI.WEATHER.DISPLAY.update(toWeatherObj(WEATHER_STORAGE.LAST.WEATHER.get()), LIST);
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


//localStorage.clear();


if(!WEATHER_STORAGE.LAST.WEATHER.get()) {
    getWeather("City");
} else {
    updateDisplay();
}

UI.WEATHER.FAVORITE.update(WEATHER_STORAGE.CITIES.get(), getWeather, city => {
    WEATHER_STORAGE.CITIES.remove(city);
});

/*  TODO:
remake: 
    localstorage using ------------ done
    fetch catch (add small window with notification under search)
    modules ----------------- done

add: 
    forecast filler ----------------- done
    hovers and clickers

optimize:
    updaters ------------- done



*/