
const WEATHER_STORAGE_KEY = {
    COLLECTION: 'weather_favorite_collection',
    BUFFER:'weather_buffer',
    FORECAST: 'weather_forecast',
    LASTAB: 'weather_opened_tab'
}

export const WEATHER_STORAGE = {
    CITIES: {
        get() {
            const VALUE = localStorage.getItem(WEATHER_STORAGE_KEY.COLLECTION);
            return VALUE ? VALUE.split(', ') : [];
        },
        set(arr) { 
            if(!arr) return;
            localStorage.setItem(WEATHER_STORAGE_KEY.COLLECTION, arr.join(', '));
        },
        add(str) {
            let COLLECTION = WEATHER_STORAGE.CITIES.get();
            COLLECTION.push(str);

            WEATHER_STORAGE.CITIES.set(COLLECTION);
        },
        remove(str) {
            const VALUE = WEATHER_STORAGE.CITIES.get();

            if(!VALUE) return;
            if(!str) return;   

            WEATHER_STORAGE.CITIES.set(VALUE.filter( item => item != str ));
        },
        includes(str) {
            const VALUE = WEATHER_STORAGE.CITIES.get();
            return VALUE ? VALUE.indexOf(str) + 1 : false;
        },
    },
    LAST: {
        TAB: {
            get() {
                return localStorage.getItem(WEATHER_STORAGE_KEY.LASTAB);
            },
            set(index) {
                localStorage.setItem(WEATHER_STORAGE_KEY.LASTAB, index);
            }
        },
        WEATHER: {
            get() {
                const VALUE = localStorage.getItem(WEATHER_STORAGE_KEY.BUFFER);
                return VALUE ? JSON.parse(VALUE) : undefined;
            },
            set(obj) {
                localStorage.setItem(WEATHER_STORAGE_KEY.BUFFER, obj);
            }
        },
        FORECAST: {
            get() {
                let value = localStorage.getItem(WEATHER_STORAGE_KEY.FORECAST);

                value = value ? JSON.parse(value).list : undefined;

                return value ? value : [];
            },
            set(obj) {
                localStorage.setItem(WEATHER_STORAGE_KEY.FORECAST, obj);
            }
        }
    }
}