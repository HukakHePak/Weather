const WEATHER_STORAGE_KEY = {
    COLLECTION: 'weather_favorite_collection',
    BUFFER:'weather_buffer',
    LASTAB: 'weather_opened_tab'
}

export const WEATHER_STORAGE = {
    CITIES: {
        get() {
            return localStorage.getItem(WEATHER_STORAGE_KEY.COLLECTION).split(', ');
        },
        set(array) { 
            localStorage.setItem(WEATHER_STORAGE_KEY.COLLECTION, array.join(', '));
        },
        add(string) {
            let COLLECTION = this.get();
            COLLECTION.push(string);

            this.set(COLLECTION);
        },
        remove(string) {
            this.set(this.get().filter( item => item != string ));
        },
        includes(string) {     
            return this.get().indexOf(string) + 1;
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
            set(object) {
                JSON.stringify(localStorage.setItem(WEATHER_STORAGE_KEY.BUFFER, object));
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
