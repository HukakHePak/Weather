import Cookies from 'js-cookie';

export const cookie = {
    saveCity(city) {
        document.cookie = 'city=' + encodeURIComponent(city) + '; max-age = 3600';
    },
    getCity() {
        try {
            return decodeURIComponent(document.cookie.split('; ').find( cook => cook.split('=')[0] === 'city').split('=')[1]);
        } catch {
            return 'City';
        }
    },
    saveTab(tabIndex) {
        Cookies.set('tab', tabIndex, { 'max-age': '3600' });
    },
    getTab() {
        return Cookies.get('tab') || 0;
    }
};