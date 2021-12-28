export const STORAGE = {
    KEY: {
        COLLECTION: 'weather_favorite_collection',
        BUFFER:'weather_buffer',
        FORECAST: 'weather_forecast',
        LASTAB: 'weather_opened_tab'
    },
    CITIES: {
        get() {
            const value = localStorage.getItem(STORAGE.KEY.COLLECTION);
            return value ? value.split(', ') : [];
        },
        set(citiesList) { 
            if(!citiesList) return;
            localStorage.setItem(STORAGE.KEY.COLLECTION, citiesList.join(', '));
        },
        add(cityName) {
            let collection = STORAGE.CITIES.get();
            collection.push(cityName);

            STORAGE.CITIES.set(collection);
        },
        remove(cityName) {
            const value = STORAGE.CITIES.get();

            if(!value) return;
            if(!cityName) return;   

            STORAGE.CITIES.set(value.filter( item => item != cityName ));
        },
        includes(cityName) {
            const value = STORAGE.CITIES.get();
            return value ? value.indexOf(cityName) + 1 : false;
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
            set(obj) {
                localStorage.setItem(STORAGE.KEY.BUFFER, obj);
            }
        },
        FORECAST: {
            get() {
                let value = localStorage.getItem(STORAGE.KEY.FORECAST);

                value = value ? JSON.parse(value).list : undefined;

                return value ? value : [];
            },
            set(obj) {
                localStorage.setItem(STORAGE.KEY.FORECAST, obj);
            }
        }
    }    
}