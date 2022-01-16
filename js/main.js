import { UI } from './view.js'
import { STORAGE } from './storage.js';
import { requestWeather } from './api.js';

async function updateWeather(cityName) {
    if(!cityName) return;

    requestWeather(cityName)
    .then(weather => {
        changeLikeButton();
        STORAGE.LAST.CITY.set(weather.city);
        UI.WEATHER.DISPLAY.TABS.update(weather);
    })
    .catch((error) => {
        console.error(error);
        UI.WEATHER.SEARCH_FORM.notify('Unknown city');
        return undefined;
    });
}

function changeLikeButton() {
    const favorite = UI.WEATHER.FAVORITE;

    if(STORAGE.LAST.CITY.isFavorite()) {
        favorite.like();
        return;
    }
    favorite.dislike();
}

{
    const display = UI.WEATHER.DISPLAY;
    const tab = STORAGE.LAST.TAB;

    display.BUTTONS.forEach( (button, index) => {
        button.addEventListener('click', () => {
            display.TABS.clear();
            display.TABS.select(index);

            tab.set(index);
        });
    });

    const activeTab = tab.get();

    if(activeTab) display.BUTTONS[activeTab].click();
} 

function addFavoriteCity(cityName) {
    UI.WEATHER.FAVORITE.LIST.add(cityName, updateWeather, removeFavoriteCity);
}

function removeFavoriteCity(cityName) {
    if(STORAGE.LAST.WEATHER.get().name == cityName)
        UI.WEATHER.FAVORITE.dislike();
        
    STORAGE.CITIES.remove(cityName);   
}

{
    const favorite = UI.WEATHER.FAVORITE;

    favorite.LIKE.addEventListener('click', () => {
        const cityName = STORAGE.LAST.CITY.get();

        if(!cityName) return;  

        if(STORAGE.CITIES.includes(cityName)) {
            removeFavoriteCity(cityName); 
            favorite.LIST.remove(cityName);
            return;      
        } 

        STORAGE.CITIES.add(cityName);
        addFavoriteCity(cityName);

        favorite.like();
    });
}

{
    const search = UI.WEATHER.SEARCH_FORM;
    
    search.NODE.addEventListener('submit', event => {  
        updateWeather( search.getCity() );
        
        search.NODE.reset();
        event.preventDefault();
    });
}

window.onload = () => {
    const lastCity = STORAGE.LAST.CITY.get();
    updateWeather(lastCity ? lastCity : 'City');
    
    UI.WEATHER.FAVORITE.LIST.clear();

    STORAGE.FAVORITES.get().forEach( addFavoriteCity );
};