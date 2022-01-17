import { NODES, CONTROLS } from './view.js'
import { STORAGE } from './storage.js';
import { requestWeather } from './api.js';

async function updateWeather(cityName) {
    if(!cityName) return;

    requestWeather(cityName).then(response => {
        STORAGE.setCity(response.city);
        
        changeLike();
        CONTROLS.updateTabs(response);
    })
}

function changeLike() {
    CONTROLS.setLike(STORAGE.isFavorite(STORAGE.getCity()));
}

function removeCity(city) {
    CONTROLS.removeFavorite(city)
    STORAGE.removeFavorite(city)
}

function addCity(city) {
    CONTROLS.addFavorite(city);
    STORAGE.addFavorite(city);
}

NODES.FAVORITES.addEventListener('add', event => {
    const city = event.detail.city;

    const favoriteNode = event.detail.node;

    favoriteNode.lastElementChild.addEventListener('click', () => {
        removeCity(city);
        changeLike();
    });

    event.detail.node.firstElementChild.addEventListener('click', () => {
        updateWeather(city);
    });
    
    changeLike();
})

NODES.LIKE.addEventListener('click', () => {
    const city = STORAGE.getCity();
    if(!city) return;

    STORAGE.isFavorite(city) ? removeCity(city) : addCity(city);
});

NODES.FORM.addEventListener('submit', event => {  
    updateWeather(event.target.city.value);

    NODES.FORM.reset();
    event.preventDefault();
});

NODES.BUTTONS.forEach((button, index) => {
    button.addEventListener('click', () => {
        STORAGE.setTab(index);
    });
})

NODES.BUTTONS[STORAGE.getTab()].click();

//const lastCity = STORAGE.LAST.CITY.get();
//updateWeather(STORAGE.getCity() || 'City');
//NODES.FORM.city.value = 'City';
//NODES.FORM.click();

STORAGE.getFavorites().forEach( CONTROLS.addFavorite );
