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

NODES.FAVORITES.addEventListener('add', event => {
    const city = event.detail.city;

    STORAGE.addFavorite(city);

    event.detail.node.lastElementChild.addEventListener('click', () => {
        CONTROLS.removeFavorite(city);
    });

    event.detail.node.firstElementChild.addEventListener('click', () => {
        updateWeather(city);
    });
    
    changeLike();
});

NODES.FAVORITES.addEventListener('remove', event => {
    STORAGE.removeFavorite(event.detail.city);
    changeLike();
});

NODES.LIKE.addEventListener('click', () => {
    const city = STORAGE.getCity();

    STORAGE.isFavorite(city) ? CONTROLS.removeFavorite(city) : CONTROLS.addFavorite(city);
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

NODES.BUTTONS[STORAGE.getTab() || 0].click();

STORAGE.getFavorites().forEach( CONTROLS.addFavorite );

updateWeather(STORAGE.getCity() || 'City');
