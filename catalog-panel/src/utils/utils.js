import {CITIES_GROUP} from './constants/values.constants';

export const getUserData = () => {
    return JSON.parse(localStorage.getItem("userData"));
}

export const getUserToken = () => {
    let userToken = JSON.parse(localStorage.getItem("okta-token-storage"));
    if (userToken && userToken.accessToken && userToken.accessToken.accessToken) {
        return userToken.accessToken.accessToken;
    }
    return null;
}


export const convertObjectToParams = (params) => {
    if (typeof params === 'string') {
        return params;
    }
    let finalParams = '';
    Object.keys(params).forEach((key, index) => {
        if (index === 0) {
            finalParams += '?';
        }
        finalParams += key + '=' + params[key];
        if ((index + 1) !== Object.keys(params).length) {
            finalParams += '&';
        }
    });
    return finalParams;
}

export const getDateFormateMMDDYYY = dateString => {
    const dateObj = dateString.split('/');
    const date = dateObj[0];
    const month = dateObj[1];
    dateObj[0] = month;
    dateObj[1] = date;
    return dateObj.join('/');
}

export const dateFormat = (e) => {
    let dateTime = new Date(e);
    let month = dateTime.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    let year = dateTime.getFullYear();
    let date = dateTime.getDate();
    if (date < 10) {
        date = '0' + date;
    }
    if (year < 10) {
        year = '0' + year;
    }
    let newDate = year + "-" + month  + "-" + date;
    return newDate;
}
export const timeFormat = (e) => {
    let newTime = new Date(e);
    let ampm = " AM";
    let hr = newTime.getHours();
    if (hr > 12) {
        hr -= 12;
        ampm = " PM";
    }
    let min = newTime.getMinutes();
    if (min && min < 10) {
        min = '0' + min;
    }
    if (!min) {
        min = '00';
    }
    if (hr && hr < 10) {
        //console.log(hr)
        hr = '0' + hr;
    }
    let chengeTime = hr + ":" + min + ampm;
    return chengeTime;
}

export const isValidTimeForSlot = () => {
    const startTime = new Date().getTime();
    const endDate = new Date();
    endDate.setHours(16,59,59,999);
    const endTime = endDate.getTime();
    return endTime >= startTime;
};

export const getFinalRanges = (startTime, endTime, difference, valTime = new Date(), initialLeadTime) => {
    let CurrentDate = new Date();
    const isItSameDate = valTime.getDate() === CurrentDate.getDate();
    if(isItSameDate && !isValidTimeForSlot()) {
        return [];
    }
    let ranges = [];
    let finalRange = [];
    ranges = getRange(startTime, endTime, difference, [], initialLeadTime);
    let newDate = new Date().getTime();
    let currentTime = valTime && valTime.getDate() !== CurrentDate.getDate() ?
        new Date(newDate + difference * 60000) :
        new Date(newDate + initialLeadTime * 60000);
    
    const hour = currentTime.getHours();
    const minute = currentTime.getMinutes();
    const mins = Number(minute) > 10 ? minute : "0" + minute;

    let newTime = ""
    if (valTime === undefined) {
        newTime = hour + '.' + mins;
    }
    else if (valTime.getDate() !== CurrentDate.getDate()) {
        newTime = startTime;
    }

    else {
        newTime = hour + '.' + mins;
    }
    if (ranges && ranges.length) {
        ranges.forEach(element => {
            let splitedElement = element.split("-")[0];
            if (parseFloat(splitedElement) >= parseFloat(newTime)) {
                finalRange.push((element).replace(".", ":"));
            }

        });
    }
    return finalRange;
}

export const getRange = (startTimeNew, endTime, difference, ranges, initialLeadTime) => {
    let rangeStart = startTimeNew;

    let rangeEnd = 0, startTimeSplit = startTimeNew.split("."),
        minsPlusDifference = Number(startTimeSplit[1]) + Number(difference),
        timeArray = [],
        newHour = 0,
        newMins = 0;
    if (minsPlusDifference > 60) {
        if (difference > 60) {
            let newHoursToAdd = Math.floor(difference / 60);
            let minsAfterAddingHours = Number(startTimeSplit[1]) + (difference - (60 * newHoursToAdd));
            let minsAfterRemovingHours = Number(startTimeSplit[1]) - (difference - (60 * newHoursToAdd));
            newHour = Number(startTimeSplit[0]) + newHoursToAdd;
            newHour = minsAfterAddingHours >= 60 ? newHour + 1 : newHour;
            newMins = minsAfterAddingHours >= 60 ? minsAfterRemovingHours : minsAfterAddingHours;
        } else {
            newHour = Number(startTimeSplit[0]) + 1;
            newMins = difference - (60 - startTimeSplit[1]);
        }
    } else if (minsPlusDifference === 60) {
        newHour = Number(startTimeSplit[0]) + 1;
        newMins = 0;
    } else {
        newHour = startTimeSplit[0];
        newMins = minsPlusDifference;
    }
    if (newMins < 10) {
        newMins = "0" + newMins;
    }
    if (newHour < 10) {
        newHour = newHour;

    }

    timeArray = [newHour, newMins];
    rangeEnd = timeArray.join(".");

    if (parseFloat(rangeEnd) <= parseFloat(endTime)) {
        ranges.push(rangeStart + "-" + rangeEnd);
        getRange(rangeEnd, endTime, difference, ranges);
    }
    return ranges;

}

export const IsAlphaNumeric = (alphane) => {
    var numaric = alphane;
    for (var j = 0; j < numaric.length; j++) {
        var alphaa = numaric.charAt(j);
        var hh = alphaa.charCodeAt(0);
        if ((hh > 47 && hh < 58) || (hh > 64 && hh < 91) || (hh > 96 && hh < 123)) {
        }
        else {
            return false;
        }
    }
    return true
}

var selectedValue = 0;

export const setActiveToggle = (selected) => {
    selectedValue = selected;
}

export const getActiveToggle = () => selectedValue;

export const redirectPage = (currentQueryString) => {
    if (currentQueryString) {
        if (window.location.pathname.includes("location")) {
            window.location = '/location'
        }
        else if (window.location.pathname.includes("masterdata")) {
            window.location = '/masterdata'
        }
        else if (window.location.pathname.includes("bulkupload")) {
            window.location = '/bulkupload'
        }
        else {
            window.location = '/'
        }

    } else {
        window.location.reload(false);
    }
}
export const localStorageGroupData = () => {
    let localData = localStorage.getItem('okta-token-storage');
    let groupData = "";
    if (localData) {
        groupData = JSON.parse(localData).accessToken &&
            JSON.parse(localData).accessToken &&
            JSON.parse(localData).accessToken.claims &&
            JSON.parse(localData).accessToken.claims.groups ?
            JSON.parse(localData).accessToken.claims.groups : ""

    }
    return groupData
}

export const setLocationType = locationType => {
    if(locationType === 'CAR_STUDIO') {
        return locationType.replace('CAR_', '');
    }
    return locationType && locationType.replace(/_/g, ' ') || '-';
};

export const isObjectEmpty = dataObject => Object.keys(dataObject).length === 0;

export const getLogisticSearchRequestParams = searchParams => {
    const requestParams = new URLSearchParams(searchParams);
    requestParams.append('sort','mv.logistic.requestedPickupTime');
    requestParams.append('mv.logistic.requestedPickupTime.dir','asc');
    requestParams.append('sort','mv.logistic.pickUpSlotFrom');
    requestParams.append('mv.logistic.pickUpSlotFrom.dir','asc');
    requestParams.append('sort','mv.logistic.pickUpSlotTo');
    requestParams.append('mv.logistic.pickUpSlotTo.dir','asc');
    return '?'+requestParams.toString();
};

/**
   * @param {string} cityCode 
   * @param {array} CITIES_GROUP
   * findCityList method will return all cityname if that is NCR
   */
  export const findCityList = (cityCode, CITIES_GROUP) => {
    if(CITIES_GROUP.filter(cityCodeValue => cityCodeValue === cityCode).length) {
      return CITIES_GROUP;
    }
    return [cityCode];
  }