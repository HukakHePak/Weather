
export class Storage {
    constructor(key, options) {
        this.key = key;
        this.default = options?.value;
        this.storage = options?.isSession ? sessionStorage : localStorage;
        this.set();
    }

    get() {
        try {
            return JSON.parse(this.storage.getItem(this.key)); 
        }
        catch {
            return;
        }
    }

    set(value = this.default) {
        this.storage.setItem(this.key, JSON.stringify(value));
    }

    clear() {
        this.set();
    }

    isEmpty() {
        return !this.get();
    }
}







const KEYS = {
    LASTAB: 'weather_opened_tab',
    LASTCITY: 'last_found_city',
    FAVORITES: 'current_list_favorites'
};

export const storage = {
    getFavorites() {
        try {
            return new Set(JSON.parse(localStorage.getItem(KEYS.FAVORITES)));
        } catch { return new Set(); }
    },
    setFavorites(favorites) {
        localStorage.setItem(KEYS.FAVORITES, JSON.stringify([...favorites]));
    },
    addFavorite(favorite) {
        storage.setFavorites(storage.getFavorites().add(favorite));
    },
    removeFavorite(favorite) {
        const favorites = storage.getFavorites();
        favorites.delete(favorite);
        storage.setFavorites(favorites);
    },
    isFavorite(city) {
        return storage.getFavorites().has(city);
    },
    getTab() {
        return localStorage.getItem(KEYS.LASTAB);
    },
    setTab(tab) {
        localStorage.setItem(KEYS.LASTAB, tab);
    },
    getCity() {
        return localStorage.getItem(KEYS.LASTCITY);
    },
    setCity(city) {
        localStorage.setItem(KEYS.LASTCITY, city);
    }   
};