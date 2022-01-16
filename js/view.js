const WEATHER = document.querySelector('#weather');

const NODES = {

};

export const UI = {
    WEATHER: {
        NODE: WEATHER,
        SEARCH_FORM: {
            NODE: document.forms.weather,
            NOTIFICATION: WEATHER.querySelector('.form__notification'),
            getCity() {
                return UI.WEATHER.SEARCH_FORM.NODE.city.value;
            },
            notify(msg) {
                const notifyNode = UI.WEATHER.SEARCH_FORM.NOTIFICATION;
                
                notifyNode.textContent = msg;
                notifyNode.classList.add('active');

                setTimeout( () => {
                    notifyNode.classList.remove('active');
                }, 2000);
            }
        },
        DISPLAY: {
            BUTTONS: WEATHER.querySelectorAll('.presents .selects button'),
            TABS: {
                NODES: WEATHER.querySelectorAll('.presents .description > *'),
                NOW: {
                    NODE: WEATHER.querySelector('.presents .description > .now'),
                    VALUES: WEATHER.querySelectorAll('.presents .description > .now .value'),
                },
                DETAILS: {
                    NODE: WEATHER.querySelector('.presents .description > .details'),
                    VALUES: WEATHER.querySelectorAll('.presents .description > .details .value'),
                }, 
                FORECAST: {
                    NODE: WEATHER.querySelector('.presents .description > .forecast'),
                    VALUES: WEATHER.querySelectorAll('.presents .description > .forecast .value'),       
                    LIST: {
                        NODE: WEATHER.querySelector('.presents .description > .forecast .details'),
                        TEMPLATE:  WEATHER.querySelector('.presents .description > .forecast .details li'),
                        fill(list) {
                            list.forEach( item => {
                                const weatherNode = UI.WEATHER.DISPLAY.TABS.FORECAST.LIST.TEMPLATE.cloneNode(true);
                                const weatherNodeFields = weatherNode.querySelectorAll('.value');
                                
                                weatherNodeFields[0].textContent = item.date;
                                weatherNodeFields[1].textContent = item.time;
                                weatherNodeFields[2].textContent = item.temp;
                                weatherNodeFields[3].textContent = item.feels;
                                weatherNodeFields[4].textContent = item.main;
                                weatherNodeFields[5].src = item.icon;
                                
                                UI.WEATHER.DISPLAY.TABS.FORECAST.LIST.NODE.append(weatherNode);
                            });
                        },
                        clear() {
                            const collection = UI.WEATHER.DISPLAY.TABS.FORECAST.LIST.NODE.children;
        
                            while(collection.length) {
                                collection[0].remove();
                            }
                        },
                    },    
                },
                clear() {
                    UI.WEATHER.DISPLAY.TABS.NODES.forEach( tab => {
                        tab.classList.remove('active');
                    });
                    UI.WEATHER.DISPLAY.BUTTONS.forEach( button => {
                        button.classList.remove('active');
                    });
                },
                select(index) {
                    UI.WEATHER.DISPLAY.TABS.NODES[index].classList.add('active');
                    UI.WEATHER.DISPLAY.BUTTONS[index].classList.add('active');
                },
                update(weather) {
                    weather.like ? UI.WEATHER.FAVORITE.like() : UI.WEATHER.FAVORITE.dislike();

                    const nowTab = UI.WEATHER.DISPLAY.TABS.NOW.VALUES;
                    const detailsTab = UI.WEATHER.DISPLAY.TABS.DETAILS.VALUES;
                    const forecastTab = UI.WEATHER.DISPLAY.TABS.FORECAST;
                    
                    nowTab[0].src = weather.icon;
                    nowTab[1].textContent = detailsTab[1].textContent = weather.temp;
                    nowTab[2].textContent = detailsTab[0].textContent = weather.city;
                    detailsTab[2].textContent = weather.feels;
                    detailsTab[3].textContent = weather.main;
                    detailsTab[4].textContent = weather.sunrise;
                    detailsTab[5].textContent = weather.sunset;

                    forecastTab.NODE.firstElementChild.textContent = weather.city;
                    
                    forecastTab.LIST.clear();
                    forecastTab.LIST.fill(weather.forecast);
                },
            },
        },
        FAVORITE: {
            NODE: WEATHER.querySelector('.favourite .locations .city'),
            LIKE: WEATHER.querySelector('.like'),
            LIST:  {
                NODE: WEATHER.querySelector('.favourite .locations'),
                TEMPLATE: WEATHER.querySelector('.favourite .locations .city'),
                add(cityName, selectCallback, removeCallback) {
                    const cityNode = UI.WEATHER.FAVORITE.LIST.TEMPLATE.cloneNode(true);
    
                    cityNode.firstElementChild.textContent = cityName;
    
                    cityNode.firstElementChild.addEventListener('click', () => {
                        selectCallback(cityName);
                        UI.WEATHER.FAVORITE.like();
                    });      
    
                    cityNode.lastElementChild.addEventListener('click', () => {
                        removeCallback(cityName);
                        cityNode.remove();
                    });
    
                    UI.WEATHER.FAVORITE.LIST.NODE.prepend(cityNode);
                },
                remove(cityName) {
                    Array.from(UI.WEATHER.FAVORITE.LIST.NODE.children).forEach(node => { 
                        if(node.firstElementChild.textContent == cityName) {
                            node.remove();
                        }
                    })
                },
                clear() {
                    const nodes = UI.WEATHER.FAVORITE.LIST.NODE.children;
                    while(nodes.length) {
                        nodes[0].remove();
                    }
                }
            },
            like() {
                UI.WEATHER.FAVORITE.LIKE.classList.add('active')   
            }, 
            dislike() {
                UI.WEATHER.FAVORITE.LIKE.classList.remove('active');
            },
        }
    }
};