
const MAIN = {
    WEATHER: document.querySelector('#weather'),
    TABS: document.querySelectorAll('#weather .presents .description > *'),  
}

const WEATHER = {
    FORM: document.forms.weather,
    BUTTONS: MAIN.WEATHER.querySelectorAll('.presents .selects button'),
    LIKE: MAIN.TABS[0].querySelector('.like'),
    FAVORITES: MAIN.WEATHER.querySelector('.favourite .locations .city'),
    TEMPLATES: {
        CITY: MAIN.WEATHER.querySelector('.favourite .locations .city'),
        FORECAST: MAIN.TABS[2].querySelector('.details li'),
    },
    LIST: MAIN.WEATHER.querySelector('.favourite .locations'),
    NOW: MAIN.TABS[0].querySelectorAll('.value'),
    DETAILS: MAIN.TABS[1].querySelectorAll('.value'),
    FORECAST: MAIN.TABS[2].querySelectorAll('.value'),
    FULLCAST: MAIN.WEATHER.querySelector('.full_forecast'),
};

export const UI = {
    WEATHER: {
        NODE: MAIN.WEATHER,
        SEARCH: {
            FORM: WEATHER.FORM,
            getCity() {
                return WEATHER.FORM.city.value;
            }   
        },
        DISPLAY: {
            BUTTONS: WEATHER.BUTTONS,
            clear() {
                MAIN.TABS.forEach( tab => {
                    tab.classList.remove('active');
                });
                WEATHER.BUTTONS.forEach( button => {
                    button.classList.remove('active');
                });
            },
            select(index) {
                MAIN.TABS[index].classList.add('active');
                WEATHER.BUTTONS[index].classList.add('active');
            },
            update(weather, forecast) {
                weather.like ? UI.WEATHER.FAVORITE.like() : UI.WEATHER.FAVORITE.dislike();
                
                WEATHER.NOW[0].src = weather.icon;
                WEATHER.NOW[1].textContent = WEATHER.DETAILS[1].textContent = weather.temp;
                WEATHER.NOW[2].textContent = WEATHER.DETAILS[0].textContent = weather.city;
                WEATHER.DETAILS[2].textContent = weather.feels;
                WEATHER.DETAILS[3].textContent = weather.main;
                WEATHER.DETAILS[4].textContent = weather.sunrise;
                WEATHER.DETAILS[5].textContent = weather.sunset;

                MAIN.TABS[2].children[0].textContent = weather.city;
                
                UI.WEATHER.DISPLAY.FORECAST.clear()
                UI.WEATHER.DISPLAY.FORECAST.fill(forecast);
            },
            FORECAST: {
                NODE: MAIN.TABS[2],
                fill(list) {
                    list.forEach( item => {
                        const NODE = WEATHER.TEMPLATES.FORECAST.cloneNode(true);
                        const FIELDS = NODE.querySelectorAll('.value');
                        
                        FIELDS[0].textContent = item.date;
                        FIELDS[1].textContent = item.time;
                        FIELDS[2].textContent = item.temp;
                        FIELDS[3].textContent = item.feels;
                        FIELDS[4].textContent = item.main;
                        FIELDS[5].src = item.icon;
    
                        MAIN.TABS[2].lastElementChild.append(NODE);
                    })
                },
                clear() {
                    const collection = MAIN.TABS[2].lastElementChild.children;

                    while(collection.length) {
                        collection[0].remove();
                    }
                },
                expand() {
                    const LIST = MAIN.TABS[2].querySelector('.details').cloneNode(true);

                    LIST.classList.add('full__forecast');
                    LIST.classList.add('border');

                    LIST.addEventListener('mouseout', event => {
                        LIST.remove();
                        console.log(event.target);
                    });

                    MAIN.WEATHER.firstElementChild.prepend(LIST);
                }
            },
        },
        FAVORITE: {
            LIKE: WEATHER.LIKE,
            LIST: WEATHER.LIST,
            add(cityName, selectCallback, removeCallback) {
                const NODE = WEATHER.TEMPLATES.CITY.cloneNode(true);

                NODE.firstElementChild.textContent = cityName;

                NODE.firstElementChild.addEventListener('click', () => {
                    selectCallback(cityName);
                    UI.WEATHER.FAVORITE.like();
                });      

                NODE.lastElementChild.addEventListener('click', () => {
                    removeCallback(cityName);
                    NODE.remove();
                });

                WEATHER.LIST.prepend(NODE);
            },
            remove(cityName) {
                Array.from(WEATHER.LIST.children).forEach(node => { 
                    if(node.firstElementChild.textContent == cityName) {
                        node.remove();
                    }
                })
            },
            like() {
                WEATHER.LIKE.classList.add('active')   
            }, 
            dislike() {
                WEATHER.LIKE.classList.remove('active');
            },
            update(arr, selectCallback, removeCallback) {
                while(WEATHER.LIST.children.length) {
                    WEATHER.LIST.children[0].remove();                }

                arr.forEach( item => {
                    UI.WEATHER.FAVORITE.add(item, selectCallback, removeCallback);
                });
            }
        }
    }
};

{
    const FORECAST = UI.WEATHER.DISPLAY.FORECAST;

    FORECAST.NODE.addEventListener('mouseover', () => {
        FORECAST.expand();
    });
}