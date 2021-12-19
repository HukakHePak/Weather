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
            NOW: {
                TAB: WEATHER_TABS[0],
                set: weather => {
                    const fields = WEATHER_TABS[0].querySelectorAll('.value');
                    fields[1].textContent = Math.round(weather.main.temp - 273);
                    fields[2].textContent = weather.name;
                },
            },
            DETAILS: {
                TAB: WEATHER_TABS[1],
                set: () => {

                },
            },
            FORECAST: {
                TAB: WEATHER_TABS[2],
                set: () => {

                },
            },
            TABS: WEATHER_TABS,
            BUTTONS: WEATHER_BLOCK.querySelectorAll('.presents .selects button'),
        },
        FAVOURITES: WEATHER_BLOCK.querySelector('.favourite .locations'),
    }
};