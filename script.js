const searchButtonIP = document.getElementById('search-button-ip');
const searchButtonZip = document.getElementById('search-button-zip');
const dropdownZipEl = document.getElementById('dropdown-zip');
const dropdownIPEl = document.getElementById('dropdown-ip');
const inputEl = document.getElementById('input-search');
const seeFaveBrewEl = document.getElementById('see-fave-brews')
let brewArray = JSON.parse(localStorage.getItem("BrewArray"));
const cardSection = document.getElementById("card-section");
const likeEl = document.querySelector(".favebox");


const geoAPIKey = '1488c32472f1e3a9cd08ffc586e794751254f842';

if (searchButtonZip != null) {
    searchButtonZip.addEventListener("click", function () {
        const inputVal = inputEl.value;
        const dropdownZipVal = dropdownZipEl.value;
        console.log(inputVal);
        if(inputVal && inputVal.length == 5){
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
    const fetchUrl = "https://api.openbrewerydb.org/v1/breweries?by_dist=" + lat + "," + lon + "&per_page=5&by_type=" + breweryType;

    fetch(fetchUrl)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            }
        })
        .then(function (data) {
            console.log(data);
            buildBreweryCards(data);
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
        })
}

function buildBreweryCards(brewery) {
    console.log(brewery);
    cardSection.innerHTML = "";
    for (let i = 0; i < brewery.length; i++) {
        const breweryName = brewery[i].name;
        const breweryPhone = brewery[i].phone;
        const breweryStreet = brewery[i].street;
        const breweryCity = brewery[i].city;
        const breweryState = brewery[i].state;
        const breweryWebsite = brewery[i].website_url;
        const breweryAddress = breweryStreet + ", " + breweryCity + ", " + breweryState;
        const columnDiv = document.createElement("div");
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
            phone.textContent = "Phone Number: " + breweryPhone;
        }
        console.log(breweryPhone);
        cardContent.appendChild(phone);
        const websiteLink = document.createElement("a");
        if (!breweryWebsite) {
            websiteLink.textContent = "No Website Available"
        } else {
            websiteLink.href = breweryWebsite;
            websiteLink.textContent = breweryWebsite;
        }
        cardContent.appendChild(websiteLink);
        const cardFooter = document.createElement("footer");
        cardFooter.classList.add("card-footer");
        cardDiv.appendChild(cardFooter);
        //This is where I create the like button for each brewery
        const likeButton = document.createElement("a");
        likeButton.classList.add("card-footer-item", "favebox");
        likeButton.setAttribute("data-name", breweryName);
        likeButton.setAttribute("data-address", breweryAddress);
        likeButton.setAttribute("data-phone", breweryPhone);
        likeButton.setAttribute("data-url", breweryWebsite);
        likeButton.textContent = "Like";
        cardFooter.appendChild(likeButton);
    };
}

if (likeEl != null) {
    likeEl.addEventListener("click", function (event) {
        const element = event.target;
        if (element.matches(".favebox")) {
            //parse string associated with favorite box
            const newEntry = {
                name: element.getAttribute("data-name"),
                address: element.getAttribute("data-address"),
                phone: element.getAttribute("data-phone"),
                url: element.getAttribute("data-url"),
            }
            if (brewArray === null) {
                brewArray = [newEntry];
            } else {
                brewArray.push(newEntry);
            }
            localStorage.setItem("BrewArray", JSON.stringify(brewArray));
            displayFave();
        }
    });
}

