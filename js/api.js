import { format } from "date-fns";

export const URLS = {
    CURRENT: 'https://api.openweathermap.org/data/2.5/weather',
    FORECAST: 'https://api.openweathermap.org/data/2.5/forecast',
    ICON: 'https://openweathermap.org/img/wn',
    API_KEY: 'f660a2fb1e4bad108d6160b7f58c555f',
}

async function requestURL(cityName, url) {
    return await fetch(`${url}?q=${cityName}&appid=${URLS.API_KEY}`).then(res => res.json());
}

export async function requestWeather(cityName) {
    const data = await requestURL(cityName, URLS.CURRENT).then( simplifyWeatherData );
    data.forecast = await requestURL(cityName, URLS.FORECAST).then(res => res.list.map( simplifyWeatherData ));

    return data;
}

function simplifyWeatherData(data) {
    return {
        date: convertDate(data.dt).date,
        time: data.dt_txt ? data.dt_txt.slice(-8, -3) : undefined,
        temp: toCelcius(data.main.temp),
        feels: toCelcius(data.main.feels_like),
        weather: data.weather[0].main,
        icon: `${URLS.ICON}/${data.weather[0].icon.slice(0, 2)}n@2x.png`,
        city: data.name,
        sunrise: convertDate(data.sys.sunrise).time,
        sunset: convertDate(data.sys.sunset).time,
    };
}

function toCelcius(temperature) {
    return Math.round(temperature - 273);
}

function convertDate(milisec) {
    if(!milisec) return { };

    const date = new Date(milisec * 1000);
    
    return {
        time: format(date, 'HH:mm'),
        date: format(date, 'dd LLL')
    }
}