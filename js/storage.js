const WEATHER_STORAGE_KEY = {
    COLLECTION: 'weather_favorite_collection',
    BUFFER:'weather_buffer',
    FORECAST: 'weather_forecast',
    LASTAB: 'weather_opened_tab'
}

export const WEATHER_STORAGE = {
    CITIES: {
        get() {
            return localStorage.getItem(WEATHER_STORAGE_KEY.COLLECTION).split(', ');
        },
        set(arr) { 
            localStorage.setItem(WEATHER_STORAGE_KEY.COLLECTION, arr.join(', '));
        },
        add(str) {
            let COLLECTION = this.get();
            COLLECTION.push(str);

            this.set(COLLECTION);
        },
        remove(str) {
            this.set(this.get().filter( item => item != str ));
        },
        includes(str) {     
            return this.get().indexOf(str) + 1;
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
                return JSON.parse(localStorage.getItem(WEATHER_STORAGE_KEY.BUFFER));
            },
            set(obj) {
                JSON.stringify(localStorage.setItem(WEATHER_STORAGE_KEY.BUFFER, obj));
            }
        },
        FORECAST: {
            get() {
                return JSON.parse(localStorage.getItem(WEATHER_STORAGE_KEY.FORECAST));
            },
            set(obj) {
                JSON.stringify(localStorage.setItem(WEATHER_STORAGE_KEY.FORECAST, obj));
            }
        }
    }
}

if(WEATHER_STORAGE.CITIES.get() === undefined) {
    WEATHER_STORAGE.CITIES.set() = [];
}

if(WEATHER_STORAGE.LAST.TAB.get() === undefined) {
    WEATHER_STORAGE.CITIES.TAB.set() = 0;
}

if(WEATHER_STORAGE.LAST.WEATHER.get() === undefined) {
    WEATHER_STORAGE.CITIES.WEATHER.set() = {};
}

if(WEATHER_STORAGE.LAST.FORECAST.get() === undefined) {
    WEATHER_STORAGE.CITIES.FORECAST.set() = {};
}
