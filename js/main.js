import { UI } from './view.js'
import { WEATHER_STORAGE } from './storage.js';

const URL = {
    WEATHER: 'https://api.openweathermap.org/data/2.5/weather',
    ICON:  'https://openweathermap.org/img/wn',
    API_KEY: 'f660a2fb1e4bad108d6160b7f58c555f',
}

function requestWeather(cityName) {
    if(cityName) {
        fetch(`${URL.WEATHER}?q=${cityName}&appid=${URL.API_KEY}`)
        .then( response => response.text() )
        .then( response => { 
            if(JSON.parse(response).cod == '404') {
                throw new Error();
            }

            WEATHER_STORAGE.LAST.WEATHER.set(response);
            updateTABS();         
        })
        .catch( () => {
            alert('not found');
        });
    }   
}

function toCelcius(temperature) {
    return Math.round(temperature - 273);
}

function toTimeHM(time) {
    const date = new Date(time * 1000);
    return date.getHours() + ':' + date.getMinutes();
}

function updateTABS() {
    const WEATHER = WEATHER_STORAGE.LAST.WEATHER.get();

    const NOW_TAB = UI.WEATHER.DISPLAY.VALUES.NOW;
    const DETAILS_TAB = UI.WEATHER.DISPLAY.VALUES.DETAILS;
    const FORECAST_TAB = UI.WEATHER.DISPLAY.VALUES.FORECAST;

    const TEMPERATURE = toCelcius(WEATHER.main.temp);
    const CITY = WEATHER.name;
    const ICON_NAME = WEATHER.weather[0].icon.slice(0, 2);

    NOW_TAB[0].src = `${URL.ICON}/${ICON_NAME}n@2x.png`;
    NOW_TAB[1].textContent = TEMPERATURE; 
    NOW_TAB[2].textContent = CITY;

    if(WEATHER_STORAGE.CITIES.includes(WEATHER.name)) {
        NOW_TAB[3].classList.add('active');
    } else {
        NOW_TAB[3].classList.remove('active');
    }

    DETAILS_TAB[0].textContent = CITY;
    DETAILS_TAB[1].textContent = TEMPERATURE;
    DETAILS_TAB[2].textContent = toCelcius(WEATHER.main.feels_like);
    DETAILS_TAB[3].textContent = WEATHER.weather[0].main;
    DETAILS_TAB[4].textContent = toTimeHM(WEATHER.sys.sunrise);
    DETAILS_TAB[5].textContent = toTimeHM(WEATHER.sys.sunset);
    
    //FORECAST_TAB[0].

};

function updateFavors() {
    const FAVORITES_NODE = UI.WEATHER.FAVORITE.LIST;

    while(FAVORITES_NODE.children.length) {
        FAVORITES_NODE.children[0].remove();
    }

    WEATHER_STORAGE.CITIES.get().forEach( cityName => {
        const NEW_FAVORITE = UI.WEATHER.FAVORITE.TEMPLATE.cloneNode(true);     
        NEW_FAVORITE.firstElementChild.textContent = cityName;
        NEW_FAVORITE.firstElementChild.addEventListener('click', event => {
            requestWeather(event.target.textContent);
        });

        NEW_FAVORITE.lastElementChild.addEventListener('click', event => {
            const PARENT_NODE = event.target.parentElement;
            WEATHER_STORAGE.CITIES.remove(PARENT_NODE.firstElementChild.textContent);

            PARENT_NODE.remove();
            UI.WEATHER.FAVORITE.LIKE.classList.remove('active');
        });

        FAVORITES_NODE.prepend(NEW_FAVORITE); 
    });
}

UI.WEATHER.DISPLAY.BUTTONS.forEach( (node, index) => {
    node.addEventListener('click', () => {
        const TABS = UI.WEATHER.DISPLAY.TABS;

        UI.WEATHER.DISPLAY.BUTTONS.forEach( (node, index) => {
            node.classList.remove('active');
            TABS[index].classList.remove('active');
        });

        node.classList.add('active');
        TABS[index].classList.add('active');

        WEATHER_STORAGE.LAST.TAB.set(index);
    });
});

UI.WEATHER.SEARCH.FORM.addEventListener('submit', event => {
    requestWeather(UI.WEATHER.SEARCH.CITY.value);

    event.preventDefault();
    event.target.reset();
});

UI.WEATHER.FAVORITE.LIKE.addEventListener('click', event => {
    const STORAGE = WEATHER_STORAGE.CITIES;
    const CITY = WEATHER_STORAGE.LAST.WEATHER.get().name;

    if(CITY) {
        event.target.classList.toggle('active');
        
        if(STORAGE.includes(CITY)) {
            STORAGE.remove(CITY);
        } else {
            STORAGE.add(CITY);
        } 

        updateFavors();
    }
});

//localStorage.removeItem(WEATHER_STORAGE_KEY.BUFFER);

if(WEATHER_STORAGE.LAST.WEATHER.get() == {}) {
    requestWeather("City");
} else {
    updateTABS();
}

updateFavors();
//localStorage.removeItem(WEATHER_STORAGE_KEY.LASTAB);

const ACTIVE_TAB = WEATHER_STORAGE.LAST.TAB.get();

if(ACTIVE_TAB) {
    UI.WEATHER.DISPLAY.BUTTONS[ACTIVE_TAB].click();
} 

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