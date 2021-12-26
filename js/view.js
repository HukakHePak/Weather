//import { WEATHER_STORAGE } from "./storage.js";

const WEATHER_BLOCK = document.querySelector('#weather');
const WEATHER_TABS = WEATHER_BLOCK.querySelectorAll('.presents .description > *');
const WEATHER_BUTTONS = WEATHER_BLOCK.querySelectorAll('.presents .selects button');

const WEATHER_FORM =  document.forms.weather;
const WEATHER_LIKE = WEATHER_TABS[0].querySelector('.like');
const WEATHER_TEMPLATE = WEATHER_BLOCK.querySelector('.favourite .locations .city').cloneNode(true);

const NOW = WEATHER_TABS[0].querySelectorAll('.value');
const DETAILS = WEATHER_TABS[1].querySelectorAll('.value');
const FORECAST = WEATHER_TABS[2];
const FORECAST_TEMPLATE = WEATHER_TABS[2].querySelector('.details li');

const WEATHER_LIST = WEATHER_BLOCK.querySelector('.favourite .locations');

export const UI = {
    WEATHER: {
        NODE: WEATHER_BLOCK,
        SEARCH: {
            FORM: WEATHER_FORM,
            getCity() {
                return WEATHER_FORM.city.value;
            }   
        },
        DISPLAY: {
            BUTTONS: WEATHER_BUTTONS,
            clear() {
                WEATHER_TABS.forEach( tab => {
                    tab.classList.remove('active');
                });
                WEATHER_BUTTONS.forEach( button => {
                    button.classList.remove('active');
                });
            },
            select(index) {
                WEATHER_TABS[index].classList.add('active');
                WEATHER_BUTTONS[index].classList.add('active');
            },
            update(weather, forecast) {
                weather.like ? UI.WEATHER.FAVORITE.like() : UI.WEATHER.FAVORITE.dislike();

                NOW[0].src = weather.icon;
                NOW[1].textContent = DETAILS[1].textContent = weather.temp;
                NOW[2].textContent = DETAILS[0].textContent = weather.city;
                DETAILS[2].textContent = weather.feels;
                DETAILS[3].textContent = weather.main;
                DETAILS[4].textContent = weather.sunrise;
                DETAILS[5].textContent = weather.sunset;

                FORECAST.children[0].textContent = weather.city;
                
                this.clearForecast()
                this.fillForecast(forecast);
            },
            fillForecast(list) {
                list.forEach( item => {
                    const NODE = FORECAST_TEMPLATE.cloneNode(true);
                    const FIELDS = NODE.querySelectorAll('.value');
                    
                    FIELDS[0].textContent = item.date;
                    FIELDS[1].textContent = item.time;
                    FIELDS[2].textContent = item.temp;
                    FIELDS[3].textContent = item.feels;
                    FIELDS[4].textContent = item.main;
                    FIELDS[5].src = item.icon;

                    FORECAST.lastElementChild.append(NODE);
                })
            },
            clearForecast() {
                const collection = FORECAST.lastElementChild.children;

                while(collection.length) {
                    collection[0].remove();
                }
            }
        },
        FAVORITE: {
            LIKE: WEATHER_TABS[0].querySelector('.like'),
            LIST: WEATHER_LIST,
            add(cityName, selectCallback, removeCallback) {
                const NODE = WEATHER_TEMPLATE.cloneNode(true);

                NODE.firstElementChild.textContent = cityName;

                NODE.firstElementChild.addEventListener('click', () => {
                    selectCallback(cityName);
                    this.like();
                });      

                NODE.lastElementChild.addEventListener('click', () => {
                    removeCallback(cityName);
                    NODE.remove();
                    this.dislike();
                });

                WEATHER_LIST.prepend(NODE);
            },
            remove(cityName) {
                Array.from(WEATHER_LIST.children).forEach(node => { 
                    if(node.firstElementChild.textContent == cityName) {
                        node.remove();
                    }
                })
            },
            like() {
                WEATHER_LIKE.classList.add('active')   
            }, 
            dislike() {
                WEATHER_LIKE.classList.remove('active');
            },
            update(arr, selectCallback, removeCallback) {
                while(WEATHER_LIST.children.length) {
                    WEATHER_LIST.children[0].remove();                }

                arr.forEach( item => {
                    this.add(item, selectCallback, removeCallback);
                });
            }
        },
    }
};