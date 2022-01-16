export const STORAGE = {
    KEY: {
        COLLECTION: 'weather_favorite_collection',
        BUFFER:'weather_buffer',
        FORECAST: 'weather_forecast',
        LASTAB: 'weather_opened_tab'
    },
    CITIES: {
        get() {
            try {
                return new Set(JSON.parse(localStorage.getItem(STORAGE.KEY.COLLECTION)));
            } catch { return new Set(); };
        },
        set(cities) { 
            localStorage.setItem(STORAGE.KEY.COLLECTION, JSON.stringify([...cities]));
        },
        add(cityName) {
            STORAGE.CITIES.set(STORAGE.CITIES.get().add(cityName));
        },
        remove(cityName) {
            const cities = STORAGE.CITIES.get();
            cities.delete(cityName);
            STORAGE.CITIES.set(cities);
        },
        includes(cityName) {
            return STORAGE.CITIES.get().has(cityName);
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
                    return JSON.parse(localStorage.getItem(STORAGE.KEY.FORECAST));
                } catch {
                    return [];
                };
            },
            set(forecast) {
                localStorage.setItem(STORAGE.KEY.FORECAST, forecast);
            }
        }
    }
}