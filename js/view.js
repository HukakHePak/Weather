const WEATHER = document.querySelector('#weather');

const FORM = document.forms.weather;
const NOTIFICATION = WEATHER.querySelector('.form__notification');
const LIKE = WEATHER.querySelector('.like');

const TABS = {
    COLLECTION: WEATHER.querySelectorAll('.presents .description > *'),
    NOW: WEATHER.querySelector('.presents .description > .now'),
    DETAILS: WEATHER.querySelector('.presents .description > .details'),
    FORECAST: WEATHER.querySelector('.presents .description > .forecast')
}
const BUTTONS = WEATHER.querySelectorAll('.presents .selects button');

const DISPLAY = WEATHER.querySelector('.presents .description');

const TEMPLATES = {
    FAVORITES: WEATHER.querySelector('.favourite .locations .city'),
    FORECAST: WEATHER.querySelector('.presents .description > .forecast .details li'),
}

const FAVORITES = WEATHER.querySelector('.favourite .locations');

export const NODES = {
    FORM,
    LIKE,
    DISPLAY,
    BUTTONS,
    FAVORITES,
};

export const CONTROLS = {
    notify(msg) {            
        NOTIFICATION.textContent = msg;
        activate(NOTIFICATION);

        setTimeout( () => deactivate(NOTIFICATION) , 2000);
    },
    setLike(liked) {
        liked ? activate(LIKE) : deactivate(LIKE);
    }, 
    initForecast(size) {

    },
    updateTabs(data) {
        fillTab(TABS.FORECAST, data);
        fillTab(TABS.DETAILS, data);

        TABS.FORECAST.firstElementChild.textContent = data.city;

        TABS.FORECAST.forEach( (node, index) => 
            fillTab(node, data.list[index])               
        );
    },
    addFavorite(city) {
        const node = TEMPLATES.FAVORITES.cloneNode(true);

        node.firstElementChild.textContent = city;

        FAVORITES.prepend(node);
        FAVORITES.dispatchEvent( new CustomEvent('add', { detail: { city, node } }));
    },
    removeFavorite(city) {
        Array.from(FAVORITES.children).filter(node => { 
            if(node.firstElementChild.textContent == city) node.remove();
        })   
    }
};

function createEvent(node, name, detail) {
    node.dispatchEvent( new CustomEvent(name, { detail }) );
}

function activate(node) {
    node.classList.add('active');
}

function deactivate(node) {
    node.classList.remove('active');
}

function clearContainer(container) {
    while(container.length) container[0].remove();
}

function fillTab(tab, entries) {
    entries.forEach(([key, value]) => {
        const node = tab.querySelector(`.${key}`);
        if(key == 'icon') {
            node.src = value;
            return;
        }
        node.textContent = value;
        //node[key == 'icon' ? 'src' : 'textContent'] = value;
    });
}

BUTTONS.forEach( (button, index) => {
    button.addEventListener('click', () => {
        TABS.COLLECTION.forEach(deactivate);
        activate(TABS.COLLECTION[index]);

        BUTTONS.forEach(deactivate);
        activate(BUTTONS[index]);
    });
});