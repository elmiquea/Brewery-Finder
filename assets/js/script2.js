let brewArray = JSON.parse(localStorage.getItem("BrewArray"));
const removeEl = document.querySelector(".remove");
let map;
let markers = [];

const geoAPIKey = '1488c32472f1e3a9cd08ffc586e794751254f842';

function displayFave() {
    brewArray = JSON.parse(localStorage.getItem("BrewArray"));
    console.log(brewArray);
    if (!brewArray || brewArray == null || brewArray.length == 0) {
        const faveBrewElE = document.getElementById("fave-brew");
        console.log("I'm empty")
        const columnDivE = document.createElement("div");
        columnDivE.classList.add("column", "is-11");
        faveBrewElE.appendChild(columnDivE);
        const cardDivE = document.createElement("div");
        cardDivE.classList.add("card");
        columnDivE.appendChild(cardDivE);
        const cardHeaderE = document.createElement("header");
        cardHeaderE.classList.add("card-header");
        cardDivE.appendChild(cardHeaderE);
        const cardHeaderTitleE = document.createElement("p");
        cardHeaderTitleE.classList.add("card-header-title", "is-centered");
        cardHeaderTitleE.textContent = "You Have No Liked Breweries";
        cardHeaderE.appendChild(cardHeaderTitleE);
    } else {
        brewArray = JSON.parse(localStorage.getItem("BrewArray"));
        const faveBrewEl = document.getElementById("fave-brew");

        for (let i = 0; i < brewArray.length; i++) {
            const columnDiv = document.createElement("div");
            columnDiv.classList.add("column", "is-11");
            faveBrewEl.appendChild(columnDiv);
            const cardDiv = document.createElement("div");
            cardDiv.classList.add("card");
            columnDiv.appendChild(cardDiv);
            const cardHeader = document.createElement("header");
            cardHeader.classList.add("card-header");
            cardDiv.appendChild(cardHeader);
            const cardHeaderTitle = document.createElement("p");
            cardHeaderTitle.classList.add("card-header-title", "is-centered");
            cardHeaderTitle.textContent = brewArray[i].name;
            cardHeader.appendChild(cardHeaderTitle);
            const cardMain = document.createElement("div");
            cardMain.classList.add("card-content");
            cardDiv.appendChild(cardMain);
            const cardContent = document.createElement("div");
            cardContent.classList.add("content");
            cardMain.appendChild(cardContent);
            const address = document.createElement("h3");
            if (brewArray[i].address == "null") {
                address.textContent = "No Address Available";
            } else {
                address.textContent = brewArray[i].address;
            }
            cardContent.appendChild(address);
            const phone = document.createElement("h4");
            if (!brewArray[i].phone) {
                phone.textContent = "No Phone Number Available";
            } else {
                phone.textContent = "Phone Number: " + brewArray[i].phone.slice(0, 3) + "-" + brewArray[i].phone.slice(3, 6) + "-" + brewArray[i].phone.slice(6, 10);
            }
            cardContent.appendChild(phone);
            const websiteLink = document.createElement("a");
            if (brewArray[i].url == "null") {
                websiteLink.textContent = "No Website Available";
            } else {
                websiteLink.href = brewArray[i].url;
                websiteLink.textContent = brewArray[i].url;
            }
            cardContent.appendChild(websiteLink);
            const cardFooter = document.createElement("footer");
            cardFooter.classList.add("card-footer");
            cardDiv.appendChild(cardFooter);
            const removeButton = document.createElement("a");
            removeButton.classList.add("card-footer-item", "remove");
            removeButton.setAttribute("data-name", brewArray[i].name);
            removeButton.textContent = "Remove";
            cardFooter.appendChild(removeButton)

        }
    }
}

displayFave();

if (removeEl != null) {
    removeEl.addEventListener("click", function (event) {
        const element = event.target;
        if (element.matches(".remove")) {
            const removeArray = JSON.parse(localStorage.getItem("BrewArray"));
            const removeName = element.getAttribute("data-name");
            for (let i = 0; i < removeArray.length; i++) {
                if (removeArray[i].name == removeName) {
                    removeArray.splice(i, 1);
                }
            }

            localStorage.setItem("BrewArray", JSON.stringify(removeArray));
            removeCards();
            clearMarkers();
            fetchGeo();
            displayFave();
        }
    });
}

function removeCards() {
    const list = document.getElementById("fave-brew");
    while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
    }
}

function fetchGeo() {
    const API = 'https://api.getgeoapi.com/v2/ip/check?api_key=' + geoAPIKey;
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
            initMap(lat, lon);
        })
};

async function initMap(lat, lon) {
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

    for (let i = 0; i < brewArray.length; i++) {
        console.log(parseFloat(brewArray[i].lat));
        const brewPos = {
            lat: parseFloat(brewArray[i].lat),
            lng: parseFloat(brewArray[i].lon)
        };

        const marker = new google.maps.Marker({
            position: brewPos,
            map: map,
            title: brewArray[i].name,
            icon: "http://maps.google.com/mapfiles/kml/paddle/orange-blank.png"
        });

        markers.push(marker);

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

fetchGeo();