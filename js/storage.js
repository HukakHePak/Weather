const KEY = {
    LASTAB: 'weather_opened_tab',
    LASTCITY: 'last_found_city',
    FAVORITES: 'cuttent_list_favorites'
};


export const STORAGE = {
    KEY: {
        LASTAB: 'weather_opened_tab',
        LASTCITY: 'last_found_city',
        FAVORITES: 'cuttent_list_favorites'
    },
    FAVORITES: {
        get() {
            try {
                return new Set(JSON.parse(localStorage.getItem(STORAGE.KEY.FAVORITES)));
            } catch { return new Set(); };
        },
        set(cities) { 
            localStorage.setItem(STORAGE.KEY.FAVORITES, JSON.stringify([...cities]));
        },
        add(cityName) {
            STORAGE.FAVORITES.set(STORAGE.FAVORITES.get().add(cityName));
        },
        remove(cityName) {
            const cities = STORAGE.FAVORITES.get();
            cities.delete(cityName);
            STORAGE.FAVORITES.set(cities);
        },
        includes(cityName) {
            return STORAGE.FAVORITES.get().has(cityName);
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
        CITY: {
            get() {
                return localStorage.getItem(STORAGE.KEY.LASTCITY);
            },
            set(cityName) {
                localStorage.setItem(STORAGE.KEY.LASTCITY, cityName);
            },
            isFavorite() {
                return STORAGE.FAVORITES.includes(STORAGE.LAST.CITY.get());
            }
        }
    }
}