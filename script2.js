let brewArray = JSON.parse(localStorage.getItem("BrewArray"));
const removeEl = document.querySelector(".remove");

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