const baseURL: string = "https://api.openweathermap.org/data/2.5";

const API_KEY = "3933d2c8c934f99a8c31418139c186c5";

const urls = {
  wetherByCityName: (cityName: string) =>
    `${baseURL}/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=usa`,
  wetherDetailsByCityName: (cityName: string) =>
    `${baseURL}/forecast?q=${cityName}&appid=${API_KEY}&units=metric&lang=usa`,
};

export { baseURL, urls };
