export const STORAGE = {
    KEY: {
        COLLECTION: 'weather_favorite_collection',
        BUFFER:'weather_buffer',
        FORECAST: 'weather_forecast',
        LASTAB: 'weather_opened_tab'
    },
    CITIES: {
        get() {
            const cities = localStorage.getItem(STORAGE.KEY.COLLECTION);
            return cities ? cities.split(', ') : [];
        },
        set(cities) { 
            if(!cities) return;
            localStorage.setItem(STORAGE.KEY.COLLECTION, cities.join(', '));
        },
        add(cityName) {
            const cities = (new Set(STORAGE.CITIES.get())).add(cityName);
            STORAGE.CITIES.set([...cities]);
        },
        remove(cityName) {
            if(!cityName) return; 

            const cities = STORAGE.CITIES.get();

            if(cities) 
                STORAGE.CITIES.set(cities.filter( city => city != cityName ));
        },
        includes(cityName) {
            const cities = STORAGE.CITIES.get();
            return cities ? cities.indexOf(cityName) + 1 : false;
        },
    },
    LAST: {
        TAB: {
            get() {
                return localStorage.getItem(STORAGE.KEY.LASTAB);
            },
            set(tabIndex) {
                localStorage.setItem(STORAGE.KEY.LASTAB, tabIndex);
            }
        },
        WEATHER: {
            get() {
                const VALUE = localStorage.getItem(STORAGE.KEY.BUFFER);
                return VALUE ? JSON.parse(VALUE) : undefined;
            },
            set(weather) {
                localStorage.setItem(STORAGE.KEY.BUFFER, weather);
            }
        },
        FORECAST: {
            get() {
                try{
                    return JSON.parse(localStorage.getItem(STORAGE.KEY.FORECAST)).list;
                } catch {
                    return [];
                }
            },
            set(forecast) {
                localStorage.setItem(STORAGE.KEY.FORECAST, forecast);
            }
        }
    }
}