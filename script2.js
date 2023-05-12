let brewArray = JSON.parse(localStorage.getItem("BrewArray"));

function displayFave() {
    if (brewArray != null) {
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
            address.textContent = brewArray[i].address;
            cardContent.appendChild(address);
            const phone = document.createElement("h4");
            phone.textContent = brewArray[i].phone;
            cardContent.appendChild(phone);
            const websiteLink = document.createElement("a");
            websiteLink.href = brewArray[i].url;
            websiteLink.textContent = brewArray[i].url;
            cardContent.appendChild(websiteLink);
            const cardFooter = document.createElement("footer");
            cardFooter.classList.add("card-footer");
            cardDiv.appendChild(cardFooter);

        }
    }
}

displayFave();