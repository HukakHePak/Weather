const serverUrl = 'http://api.openweathermap.org/data/2.5/weather';
const cityName = 'new york';
const apiKey = 'f660a2fb1e4bad108d6160b7f58c555f';
const url = `${serverUrl}?q=${cityName}&appid=${apiKey}`;

import {UI} from './view.js'

let WEATHER_BUFFER = null;

function updateTabs() {
    console.log(WEATHER_BUFFER);
    UI.WEATHER.DISPLAY.NOW.set(WEATHER_BUFFER);

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

UI.WEATHER.SEARCH.FORM.addEventListener('submit', (event) => {
    fetch(url)
    .then(response => response.json())   
    .then(response => {
        WEATHER_BUFFER = response;
        updateTabs();
    })  
    event.preventDefault();
    event.target.reset();
})


