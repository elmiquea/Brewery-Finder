const searchButtonIP = document.getElementById('search-button-ip');
const searchButtonZip = document.getElementById('search-button-zip');
const dropdownZipEl = document.getElementById('dropdown-zip');
const dropdownIPEl = document.getElementById('dropdown-ip');
const inputEl = document.getElementById('input-search');
const dropdownZipVal = dropdownZipEl.value;
const dropdownIPVal = dropdownIPEl.value;

const geoAPIKey = '1488c32472f1e3a9cd08ffc586e794751254f842';

searchButtonZip.addEventListener("click", function () {
    // getBreweryZip()
    const inputVal = inputEl.value;
    console.log(inputVal);
})

searchButtonIP.addEventListener("click", function () {
    const APIRequestIP = 'https://api.getgeoapi.com/v2/ip/check?api_key=' + geoAPIKey;
    fetchGeo(APIRequestIP);
})

function fetchGeo(API) {
    fetch(API)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
            const lat = data.location.latitude;
            console.log(lat);
            const lon = data.location.longitude;
            console.log(lon);
            getBreweryIP(lat, lon);
        })
};