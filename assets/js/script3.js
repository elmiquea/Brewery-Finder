const newsDiv = document.getElementById("news-section");
const APIkey = 'UsQRhx6g1TERaWBEYLyabehm7V2PL978sITVg0Xp'
const APIRequest = "https://api.thenewsapi.com/v1/news/top?api_token=" + APIkey + "&search=beer&sort=published_on&locale=us";

//fetch for news
fetch(APIRequest)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        buildNews(data);
    })

//builds card for news story
function buildNews(story) {
    for (let i = 0; i < story.data.length; i++) {
        const title = story.data[i].title;
        const storyImage = story.data[i].image_url;
        const subtitle = story.data[i].description;
        const snippet = story.data[i].snippet;
        const source = story.data[i].source;
        const url = story.data[i].url;
        const columnDiv = document.createElement("div");
        
        columnDiv.classList.add("column", "is-11");
        newsDiv.appendChild(columnDiv);
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card");
        columnDiv.appendChild(cardDiv);
        
        const cardHeader = document.createElement("header");
        cardHeader.classList.add("card-header");
        cardDiv.appendChild(cardHeader);
        
        const cardHeaderTitle = document.createElement("p");
        cardHeaderTitle.classList.add("card-header-title", "is-centered");
        cardHeaderTitle.textContent = title;
        cardHeader.appendChild(cardHeaderTitle);
        
        const imageDiv = document.createElement("div");
        imageDiv.classList.add("card-image");
        cardDiv.appendChild(imageDiv);
        
        const imageContainer = document.createElement("figure");
        imageContainer.classList.add("image", "is-2by1");
        imageDiv.appendChild(imageContainer);
        
        const image = document.createElement("img");
        image.setAttribute("src", storyImage);
        imageContainer.appendChild(image);
        
        const cardMain = document.createElement("div");
        cardMain.classList.add("card-content");
        cardDiv.appendChild(cardMain);
        
        const cardContent = document.createElement("div");
        cardContent.classList.add("content");
        cardMain.appendChild(cardContent);
        
        const sub = document.createElement("h3");
        sub.textContent = subtitle;
        cardContent.appendChild(sub);
        
        const snip = document.createElement("h4");
        snip.textContent = snippet;
        cardContent.appendChild(snip);
        
        const websiteLink = document.createElement("a");
        websiteLink.href = url;
        websiteLink.setAttribute("target", "_blank")
        websiteLink.textContent = "Read More: " + source;
        cardContent.appendChild(websiteLink);
    }
}