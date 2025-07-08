import {urls, baseURL} from "../configs/urls"
import axios from 'axios';

const axiosService = axios.create({ baseURL });

const weatherServices = {
    getWetherByCityName: (cityName: string) => axiosService.get(urls.wetherByCityName(cityName)),
    getWetherDetailsByCityName: (cityName: string) => axiosService.get(urls.wetherDetailsByCityName(cityName)),
}

export {
    weatherServices
}