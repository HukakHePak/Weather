import { NODES, controls } from './view.js';
import { storage } from './storage.js';
import { requestWeather } from './api.js';
import { cookie } from './cookie.js';

async function updateWeather(cityName) {
    if(!cityName) return;

    requestWeather(cityName).then(response => {
        cookie.saveCity(response.city);
        
        changeLike();
        controls.updateTabs(response);
    }).catch( error => {
        console.log(error);
        controls.notify('Unknow city');
    });
}

function changeLike() {
    controls.setLike( storage.isFavorite( cookie.getCity() ) );
}

NODES.FAVORITES.addEventListener('add', event => {
    const city = event.detail.city;

    storage.addFavorite(city);

    event.detail.node.lastElementChild.addEventListener('click', () => {
        controls.removeFavorite(city);
    });

    event.detail.node.firstElementChild.addEventListener('click', () => {
        updateWeather(city);
    });
    
    changeLike();
});

NODES.FAVORITES.addEventListener('remove', event => {
    storage.removeFavorite(event.detail.city);
    changeLike();
});

NODES.LIKE.addEventListener('click', () => {
    const city = cookie.getCity();

    storage.isFavorite(city) ? controls.removeFavorite(city) : controls.addFavorite(city);
});

NODES.FORM.addEventListener('submit', event => {  
    updateWeather(event.target.city.value);

    NODES.FORM.reset();
    event.preventDefault();
});

NODES.BUTTONS.forEach((button, index) => 
    button.addEventListener('click', () => storage.setTab(index) )
);

NODES.BUTTONS[storage.getTab() || 0].click();

storage.getFavorites().forEach( controls.addFavorite );

updateWeather(cookie.getCity());


//cookie.saveCity('york');
console.log(document.cookie);
console.log(cookie.getCity());