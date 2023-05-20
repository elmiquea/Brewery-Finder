const searchButtonIP = document.getElementById('search-button-ip');
const searchButtonZip = document.getElementById('search-button-zip');
const dropdownZipEl = document.getElementById('dropdown-zip');
const dropdownIPEl = document.getElementById('dropdown-ip');
const inputEl = document.getElementById('input-search');
const clearDislikeEl = document.getElementById("clear-dislikes");
const seeFaveBrewEl = document.getElementById('see-fave-brews');
const cardSection = document.getElementById("card-section");
let brewArray = JSON.parse(localStorage.getItem("BrewArray")) || [];
let dislikeArray = JSON.parse(localStorage.getItem("dislikes")) || [];
const removeEl = document.querySelector(".rembox");
const likeEl = document.querySelector(".favebox");
let disliked;
let markers = [];

const geoAPIKey = 'a2854aef178b7d71349a4aaa2af43d1d547f3295';

//event listener for the search by zip code
searchButtonZip.addEventListener("click", function () {
    const inputVal = inputEl.value;
    const dropdownZipVal = dropdownZipEl.value;
    if (inputVal && inputVal.length == 5) {
        getBreweryZip(dropdownZipVal, inputVal);
    }
})

//event listener for the search by IP
searchButtonIP.addEventListener("click", function () {
    const APIRequestIP = 'https://api.getgeoapi.com/v2/ip/check?api_key=' + geoAPIKey;
    const dropdownIPVal = dropdownIPEl.value;
    fetchGeo(APIRequestIP, dropdownIPVal);
})

//fetch to get location from IP address
function fetchGeo(API, dropdownIPVal) {
    fetch(API)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            const lat = data.location.latitude;
            const lon = data.location.longitude;
            getBreweryIp(dropdownIPVal, lat, lon);
        })
};

//search the Brewery API by distance according to coordinates
function getBreweryIp(breweryType, lat, lon) {
    extraSearch = dislikeArray.length;
    const fetchUrl = "https://api.openbrewerydb.org/v1/breweries?by_dist=" + lat +
        "," + lon + "&per_page=" + (5 + extraSearch) + "&by_type=" + breweryType;

    fetch(fetchUrl)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
        })
        .then(function (data) {
            buildBreweryCards(data);
            initMap(data, lat, lon);
        })
}

//search for breweries by zip code
function getBreweryZip(breweryType, zip) {
    let extraSearch = dislikeArray.length;
    const fetchUrl = "https://api.openbrewerydb.org/v1/breweries?by_postal=" +
        zip + "&per_page=" + (5 + extraSearch) + "&by_type=" + breweryType;

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

//puts together the card posted to screen
function buildBreweryCards(brewery) {
    brewArray = JSON.parse(localStorage.getItem("BrewArray")) || [];
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

        checkDislikes(breweryName);

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
            for (let j = 0; j < brewArray.length; j++) {
                if (brewArray[j].name == buttonName) {
                    likeButton.classList.add("liked");
                    likeButton.textContent = "Liked";
                }
            }

            const dislikeButton = document.createElement("a");
            dislikeButton.classList.add("card-footer-item", "rembox");
            dislikeButton.setAttribute("data-name", breweryName);
            dislikeButton.textContent = "Dislike";
            cardFooter.appendChild(dislikeButton);

            cards++;
        }
    }
};

//event listener for like button
likeEl.addEventListener("click", function (event) {
    const element = event.target;

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
            lon: element.getAttribute("data-lon"),
        }

        for (let i = 0; i < brewArray.length; i++) {
            if (brewArray[i].name == newEntry.name) {
                return;
            }
        }
        brewArray.unshift(newEntry);
    }
    localStorage.setItem("BrewArray", JSON.stringify(brewArray));
});

//checks to see if brewery has been disliked and won't post card if it has
function checkDislikes(brewName) {
    for (let i = 0; i < dislikeArray.length; i++) {
        if (dislikeArray[i] == brewName) {
            disliked = true;
            return disliked;
        } else {
            disliked = false;
        }
    }
}

//event listener for dislike box
removeEl.addEventListener("click", function (event) {
    const element = event.target;
    if (element.matches(".rembox") && !element.matches("#card-section")) {
        element.parentElement.parentElement.parentElement.classList.add("none");
        const likedButton = element.previousElementSibling;
        likedButton.classList.remove("liked");
        likedButton.innerHTML = "Like";

        const newEntry = element.getAttribute("data-name");
        dislikeArray.unshift(newEntry);
        localStorage.setItem("dislikes", JSON.stringify(dislikeArray));

        const newBrewArray = [];
        for (let i = 0; i < brewArray.length; i++) {
            if (Array.isArray(brewArray) && !dislikeArray.includes(brewArray[i].name)) {
                newBrewArray.push(brewArray[i])
            }
        }
        localStorage.setItem("BrewArray", JSON.stringify(newBrewArray));

        for (let i = 0; i < markers.length; i++) {
            if (markers[i].title == newEntry) {
                markers[i].setMap(null);
            }
        }
    }
});


// clears all dislikes
function clearDislikes() {
    const len = dislikeArray.length;
    for (let i = len; i > 0; i--) {
        dislikeArray.pop();
    }
    localStorage.setItem("dislikes", JSON.stringify(dislikeArray));
}


//puts map on page with markers
async function initMap(brewery, lat, lon) {
    const { Map } = await google.maps.importLibrary("maps");
    const myPos = { lat: lat, lng: lon };
    let map = new Map(document.getElementById("map"), {
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
                icon: "https://maps.google.com/mapfiles/kml/paddle/orange-blank.png"
            });
            markers.push(marker);
            pins++;
        }
    }
}

//clears Markers from map to prepare for new markers to be added
function clearMarkers() {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}

//fetch for getting coordinates from zip code for map when searching by zip
function findCoordZip(zip, brewery) {
    const fetchUrl = "https://api.openweathermap.org/geo/1.0/zip?zip="
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

//model to confirm clearing dislikes
$(function () {
    $("#dialog-confirm").dialog({
        position: {my: "center", at: "center", of: window},
        dialogClass: "fixed",
        resizable: false,
        height: "auto",
        width: 400,
        modal: true,
        autoOpen: false,
        buttons: {
            "Clear Dislikes": 
            function () {
                $(this).dialog("close");
                clearDislikes();
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });
    $('#clear-dislikes').click(function () {
        $("#dialog-confirm").dialog('open');
    })
});