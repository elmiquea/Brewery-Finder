const searchButtonIP = document.getElementById('search-button-ip');
const searchButtonZip = document.getElementById('search-button-zip');
const dropdownZipEl = document.getElementById('dropdown-zip');
const dropdownIPEl = document.getElementById('dropdown-ip');
const inputEl = document.getElementById('input-search');
const clearDislikeEl = document.getElementById("clear-dislikes");
const seeFaveBrewEl = document.getElementById('see-fave-brews');
const cardSection = document.getElementById("card-section");
let brewArray = JSON.parse(localStorage.getItem("BrewArray"));
let dislikeArray = JSON.parse(localStorage.getItem("dislikes"));
const removeEl = document.querySelector(".rembox");
const likeEl = document.querySelector(".favebox");
let disliked;
let markers = [];

const geoAPIKey = 'a2854aef178b7d71349a4aaa2af43d1d547f3295';

if (searchButtonZip != null) {
    searchButtonZip.addEventListener("click", function () {
        const inputVal = inputEl.value;
        const dropdownZipVal = dropdownZipEl.value;
        console.log(inputVal);
        if (inputVal && inputVal.length == 5) {
            getBreweryZip(dropdownZipVal, inputVal);
            console.log(dropdownZipVal);
        }
    })
}

if (searchButtonIP != null) {
    searchButtonIP.addEventListener("click", function () {
        const APIRequestIP = 'https://api.getgeoapi.com/v2/ip/check?api_key=' + geoAPIKey;
        const dropdownIPVal = dropdownIPEl.value;
        fetchGeo(APIRequestIP, dropdownIPVal);
        console.log(dropdownIPVal);
    })
}

function fetchGeo(API, dropdownIPVal) {
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
            getBreweryIp(dropdownIPVal, lat, lon);
        })
};

function getBreweryIp(breweryType, lat, lon) {
    let extraSearch;

    if (dislikeArray === null) {
        extraSearch = 0;
    } else {
        extraSearch = dislikeArray.length;
    }

    const fetchUrl = "https://api.openbrewerydb.org/v1/breweries?by_dist=" + lat +
        "," + lon + "&per_page=" + (5 + extraSearch) + "&by_type=" + breweryType;

    fetch(fetchUrl)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
        })
        .then(function (data) {
            console.log(data);
            buildBreweryCards(data);
            initMap(data, lat, lon);
        })
}

function getBreweryZip(breweryType, zip) {
    const fetchUrl = "https://api.openbrewerydb.org/v1/breweries?by_postal=" + zip + "&per_page=5&by_type=" + breweryType;

    fetch(fetchUrl)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
        })
        .then(function (data) {
            buildBreweryCards(data);
            findCoordZip(zip, data);
        })
}

function buildBreweryCards(brewery) {
    console.log(brewery);
    brewArray = JSON.parse(localStorage.getItem("BrewArray"));
    console.log(brewArray);
    cardSection.innerHTML = "";
    let cards = 0;
    for (let i = 0; i < brewery.length; i++) {
        const breweryName = brewery[i].name;
        const breweryPhone = brewery[i].phone;
        const breweryStreet = brewery[i].street;
        const breweryCity = brewery[i].city;
        const breweryState = brewery[i].state;
        const breweryWebsite = brewery[i].website_url;
        const breweryLat = brewery[i].latitude;
        const breweryLon = brewery[i].longitude;
        const breweryAddress = breweryStreet + ", " + breweryCity + ", " + breweryState;
        const columnDiv = document.createElement("div");

        checkDislikes(brewery[i].name);

        if (!disliked && cards < 5) {
            columnDiv.classList.add("column", "is-11");
            cardSection.appendChild(columnDiv);
            const cardDiv = document.createElement("div");
            cardDiv.classList.add("card");
            columnDiv.appendChild(cardDiv);
            const cardHeader = document.createElement("header");
            cardHeader.classList.add("card-header");
            cardDiv.appendChild(cardHeader);
            const cardHeaderTitle = document.createElement("p");
            cardHeaderTitle.classList.add("card-header-title", "is-centered");
            cardHeaderTitle.textContent = breweryName;
            cardHeader.appendChild(cardHeaderTitle);
            const cardMain = document.createElement("div");
            cardMain.classList.add("card-content");
            cardDiv.appendChild(cardMain);
            const cardContent = document.createElement("div");
            cardContent.classList.add("content");
            cardMain.appendChild(cardContent);
            const address = document.createElement("h3");
            address.textContent = breweryStreet + ", " + breweryCity + ", " + breweryState;
            cardContent.appendChild(address);
            const phone = document.createElement("h4");
            if (!breweryPhone) {
                phone.textContent = "No Phone Number Available"
            } else {
                phone.textContent = "Phone Number: " + breweryPhone.slice(0, 3) + "-" + breweryPhone.slice(3, 6) + "-" + breweryPhone.slice(6, 10);
            }
            console.log(breweryPhone);
            cardContent.appendChild(phone);
            const websiteLink = document.createElement("a");
            if (!breweryWebsite) {
                websiteLink.textContent = "No Website Available"
            } else {
                websiteLink.href = breweryWebsite;
                websiteLink.setAttribute("target", "_blank")
                websiteLink.textContent = breweryWebsite;
            }
            cardContent.appendChild(websiteLink);
            const cardFooter = document.createElement("footer");
            cardFooter.classList.add("card-footer");
            cardDiv.appendChild(cardFooter);
            const likeButton = document.createElement("a");
            likeButton.classList.add("card-footer-item", "favebox");
            likeButton.setAttribute("data-name", breweryName);
            likeButton.setAttribute("data-address", breweryAddress);
            likeButton.setAttribute("data-phone", breweryPhone);
            likeButton.setAttribute("data-url", breweryWebsite);
            likeButton.setAttribute("data-lat", breweryLat);
            likeButton.setAttribute("data-lon", breweryLon);
            likeButton.textContent = "Like";
            const buttonName = likeButton.getAttribute("data-name");
            cardFooter.appendChild(likeButton);
            if (!(!brewArray || brewArray[0] == null)) {
                for (let j = 0; j < brewArray.length; j++) {
                    if (brewArray[j].name == buttonName) {
                        likeButton.classList.add("liked");
                        likeButton.textContent = "Liked";
                    }
                }
            }
            const dislikeButton = document.createElement("a");
            dislikeButton.classList.add("card-footer-item", "rembox");
            dislikeButton.setAttribute("data-name", breweryName);
            dislikeButton.textContent = "Dislike";
            cardFooter.appendChild(dislikeButton);
            cards++;
        }
    };
}

if (likeEl != null) {
    likeEl.addEventListener("click", function (event) {
        const element = event.target;
        console.log(element);
        if (element.matches(".favebox") && !element.matches("#card-section")) {
            element.classList.add("liked");
            element.textContent = "Liked";
            //parse string associated with favorite box
            const newEntry = {
                name: element.getAttribute("data-name"),
                address: element.getAttribute("data-address"),
                phone: element.getAttribute("data-phone"),
                url: element.getAttribute("data-url"),
                lat: element.getAttribute("data-lat"),
                lon: element.getAttribute("data-lon")
            }
            if (!brewArray || brewArray[0] == null) {
                brewArray = [newEntry];
            } else {
                for (let i = 0; i < brewArray.length; i++) {
                    if (brewArray[i].name == newEntry.name) {
                        return;
                    }
                }
                brewArray.unshift(newEntry);
            }
            localStorage.setItem("BrewArray", JSON.stringify(brewArray));

        }
    });
}

function checkDislikes(brewName) {
    //const dislikeArray = JSON.parse(localStorage.getItem("dislikes"));
    if (dislikeArray != null) {
        for (let i = 0; i < dislikeArray.length; i++) {
            if (dislikeArray[i] == brewName) {
                disliked = true;
                return disliked;
            } else {
                disliked = false;
            }
        }
    }
}

if (removeEl != null) {
    removeEl.addEventListener("click", function (event) {
        const element = event.target;
        if (element.matches(".rembox") && !element.matches("#card-section")) {
            console.log(element);
            element.parentElement.parentElement.parentElement.classList.add("none");
            const likedButton = element.previousElementSibling;
            likedButton.classList.remove("liked");
            likedButton.innerHTML = "Like";
            //parse string associated with favorite box
            const newEntry = element.getAttribute("data-name")

            if (dislikeArray === null) {
                dislikeArray = [newEntry];
            } else {
                for (let i = 0; i < dislikeArray.length; i++) {
                    if (dislikeArray[i] == newEntry) {
                        return;
                    }
                }
                dislikeArray.unshift(newEntry);
            }
            localStorage.setItem("dislikes", JSON.stringify(dislikeArray));
            const newBrewArray = [];
            for (let i = 0; i < brewArray.length; i++) {
                if (Array.isArray(brewArray) && !dislikeArray.includes(brewArray[i].name)) {
                    newBrewArray.push(brewArray[i])
                }
            }
            localStorage.setItem("BrewArray", JSON.stringify(newBrewArray));
        }
    });
}

if (clearDislikeEl != null) {
    clearDislikeEl.addEventListener("click", function (event) {
        const element = event.target;
        const len = dislikeArray.length
        if (element.matches("#clear-dislikes")) {
            for (let i = len; i > 0; i--) {
                dislikeArray.pop();
            }
        }
        localStorage.setItem("dislikes", JSON.stringify(dislikeArray));
    });
}

async function initMap(brewery, lat, lon) {
    const { Map } = await google.maps.importLibrary("maps");
    const myPos = { lat: lat, lng: lon };
    map = new Map(document.getElementById("map"), {
        center: myPos,
        zoom: 10,
    });

    new google.maps.Marker({
        position: myPos,
        map: map,
        title: "You are Here.",
    });

    clearMarkers();

    let pins = 0;
    for (let i = 0; i < brewery.length; i++) {
        const brewPos = {
            lat: parseFloat(brewery[i].latitude),
            lng: parseFloat(brewery[i].longitude)
        };

        checkDislikes(brewery[i].name);

        if (!disliked && pins < 5) {
            const marker = new google.maps.Marker({
                position: brewPos,
                map: map,
                title: brewery[i].name,
                icon: "http://maps.google.com/mapfiles/kml/paddle/orange-blank.png"
            });
            markers.push(marker);
            pins++;
        }
    }
}

function clearMarkers() {
    if (markers != []) {
        for (let i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = [];
    }
}

function findCoordZip(zip, brewery) {
    const fetchUrl = "http://api.openweathermap.org/geo/1.0/zip?zip="
        + zip + "&appid=237336740efcd4d74b2307eb0e33a4d1";

    fetch(fetchUrl)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
        })
        .then(function (data) {
            lat = parseFloat(data.lat);
            lon = parseFloat(data.lon);
            initMap(brewery, lat, lon);
        })
}