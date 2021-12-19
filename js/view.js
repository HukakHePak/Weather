const WEATHER_BLOCK = document.querySelector('#weather');
const WEATHER_TABS = WEATHER_BLOCK.querySelectorAll('.presents .description > *');

export const UI = {
    WEATHER: {
        TARGET: WEATHER_BLOCK,
        SEARCH: {
            FORM: WEATHER_BLOCK.querySelector('form.search'),
            CITY: WEATHER_BLOCK.querySelector('form.search input[type="text"]'),
        },
        DISPLAY: {
            VALUES: {
                NOW:  WEATHER_TABS[0].querySelectorAll('.value'),
                DETAILS: WEATHER_TABS[1].querySelectorAll('.value'),
                FORECAST: WEATHER_TABS[2].querySelectorAll('.value')
            },
            TABS: WEATHER_TABS,
            BUTTONS: WEATHER_BLOCK.querySelectorAll('.presents .selects button'),
        },
        FAVORITE: {
            BUTTON: WEATHER_TABS[0].querySelector('.like'),
            LIST: WEATHER_BLOCK.querySelector('.favourite .locations'),
            TEMPLATE: WEATHER_BLOCK.querySelector('.favourite .locations li'),
        }
    }
};

UI.WEATHER.FAVORITE.TEMPLATE.remove();