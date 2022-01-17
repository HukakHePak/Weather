const KEYS = {
    LASTAB: 'weather_opened_tab',
    LASTCITY: 'last_found_city',
    FAVORITES: 'current_list_favorites'
};

export const STORAGE = {
    getFavorites() {
        try {
            return new Set(JSON.parse(localStorage.getItem(KEYS.FAVORITES)));
        } catch { return new Set() };
    },
    setFavorites(favorites) {
        localStorage.setItem(KEYS.FAVORITES, JSON.stringify([...favorites]));
    },
    addFavorite(favorite) {
        STORAGE.setFavorites(STORAGE.getFavorites().add(favorite));
    },
    removeFavorite(favorite) {
        const favorites = STORAGE.getFavorites();
        favorites.delete(favorite);
        STORAGE.setFavorites(favorites);
    },
    isFavorite(city) {
        return STORAGE.getFavorites().has(city);
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
}