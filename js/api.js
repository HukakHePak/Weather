export const URL = {
    CURRENT: 'https://api.openweathermap.org/data/2.5/weather',
    FORECAST: 'https://api.openweathermap.org/data/2.5/forecast',
    ICON: 'https://openweathermap.org/img/wn',
    API_KEY: 'f660a2fb1e4bad108d6160b7f58c555f',
}

async function requestURL(cityName, url) {
    const response = await fetch(`${url}?q=${cityName}&appid=${URL.API_KEY}`);

    if(response.ok) return await response.text(); 

    throw new Error(response);     
}

export async function requestWeather(cityName) {
    return new Promise(async (resolve, reject) => {
        try {
            const weather = await requestURL(cityName, URL.CURRENT).then(JSON.parse).then(toWeatherObj);
            const forecast = await requestURL(cityName, URL.FORECAST).then(JSON.parse);
            
            weather.forecast = forecast.list.map( toWeatherObj );
            resolve(weather);
        } catch(error) { 
            reject(error);
        } 
    })
}

function toWeatherObj(obj) {
    return {
        date: toDateDM(obj.dt),
        time: obj.dt_txt ? obj.dt_txt.slice(-8, -3) : undefined,
        temp: toCelcius(obj.main.temp),
        feels: toCelcius(obj.main.feels_like),
        main: obj.weather[0].main,
        icon: `${URL.ICON}/${obj.weather[0].icon.slice(0, 2)}n@2x.png`,
        city: obj.name,
        sunrise: toTimeHM(obj.sys.sunrise),
        sunset: toTimeHM(obj.sys.sunset),
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