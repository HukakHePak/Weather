export const URLS = {
    CURRENT: 'https://api.openweathermap.org/data/2.5/weather',
    FORECAST: 'https://api.openweathermap.org/data/2.5/forecast',
    ICON: 'https://openweathermap.org/img/wn',
    API_KEY: 'f660a2fb1e4bad108d6160b7f58c555f',
}

async function requestURL(cityName, url) {
    const response = await fetch(`${url}?q=${cityName}&appid=${URLS.API_KEY}`);

    if(response.ok) return await response.text(); 

    throw new Error(response);     
}

export async function requestWeather(cityName) {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await requestURL(cityName, URLS.CURRENT).then(JSON.parse).then( simplifyWeatherData );
            const forecast = await requestURL(cityName, URLS.FORECAST).then(JSON.parse);
            
            data.forecast = forecast.list.map( simplifyWeatherData );
            resolve(data);
        } catch(error) { 
            reject(error);
        } 
    })
}

function simplifyWeatherData(data) {
    return {
        date: toDateDM(data.dt),
        time: data.dt_txt ? data.dt_txt.slice(-8, -3) : undefined,
        temp: toCelcius(data.main.temp),
        feels: toCelcius(data.main.feels_like),
        main: data.weather[0].main,
        icon: `${URLS.ICON}/${data.weather[0].icon.slice(0, 2)}n@2x.png`,
        city: data.name,
        sunrise: toTimeHM(data.sys.sunrise),
        sunset: toTimeHM(data.sys.sunset),
    };
}

function toCelcius(temperature) {
    return Math.round(temperature - 273);
}

function toTimeHM(time) {
    const date = new Date(time * 1000);
    return date.getHours() + ':' + date.getMinutes();
}

function toDateDM(time) {
    const date = new Date(time * 1000);
    return  date.getDate()  + ' ' + date.toLocaleString('en', { month: 'short' });;
}