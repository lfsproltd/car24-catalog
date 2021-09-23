import axios from 'axios';
import { getUserToken } from './../utils/utils';


var instance = axios.create();
instance.interceptors.request.use(function (config) {
  let accessToken = getUserToken(), country = localStorage.getItem("country"), vehicleType = localStorage.getItem("vehicleType");
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  if (country) {
    config.headers['X_COUNTRY'] = country;
  }
  if (vehicleType) {
    config.headers['X_VEHICLE_TYPE'] = vehicleType;
  }
  return config;
});


const axiosService = {
  get: (endPoint, data, headers = {}) => {
    const config = {};
    
    if (!endPoint) {
      throw Error('endPoint is required params');
    }
     else {
      if(endPoint.includes('/api/inventory/export-csv')) {
        headers['Accept'] = 'text/csv';
      }
      if (data) {
        config.params = data;
      }
      config.headers = headers;
      return instance.get(endPoint, config);
    }
  },
  post: (endPoint, data, headers = {}) => {
    if (!(endPoint || !data)) {
      throw Error('endPoint and data are required params');
    }
    return instance.post(endPoint, data, { headers });
  },
  put: (endPoint, data, headers = {}) => {
    if (!(endPoint || !data)) {
      throw Error('endPoint and data are required params');
    }
    return instance.put(endPoint, data, { headers });
  },
  delete: (endPoint, data, headers = {}) => {
    const config = {};
    if (!endPoint) {
      throw Error('endPoint is required params');
    } else {
      config.headers = headers;
      return instance.delete(endPoint, { data: data }, config);
    }
  },
};

export default axiosService;