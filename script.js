function getBreweryIp (breweryType, lat, lon) {
    const fetchUrl = "https://api.openbrewerydb.org/v1/breweries?by_dist=" + lat + "," + lon + "&per_page=5&by_type=" + breweryType;

    fetch(fetchUrl)
    .then  (function(response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then (function(data) {
        console.log (data);
    })
}

function getBreweryZip (breweryType, zip) {
    const fetchUrl = "https://api.openbrewerydb.org/v1/breweries?by_postal=" + zip + "&per_page=5&by_type=" + breweryType;

    fetch(fetchUrl)
    .then  (function(response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then (function(data) {
        console.log (data);
    })  
}

