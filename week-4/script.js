document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("search-form");
    const input = document.getElementById("input-show");
    const showContainer = document.querySelector(".show-container");

    form.addEventListener("submit", async function(event) {
        event.preventDefault();
        const query = input.value.trim();
        if (query === "") {
            alert("ENTER A SHOW NAME");
            return;
        }
        try {
            const response = await fetch("https://api.tvmaze.com/search/shows?q=" + query);
            const data = await response.json();
            //console.log(data);
            showContainer.innerHTML = "";

            for (var i= 0; i < data.length; i++) {
                const show = data[i].show;
                
                const showData = document.createElement("div");
                showData.className = "show-data";

                const img = document.createElement("img");
                if (show.image) {
                    img.src = show.image.medium;
                } else {
                    img.src = "https://via.placeholder.com/210x295?text=No+Image";
                }
                
                const infoDiv = document.createElement("div");
                infoDiv.className = "show-info";

                const title = document.createElement("h1");
                title.textContent = show.name;

                const summary = document.createElement("div");
                if (show.summary) {
                    summary.innerHTML = show.summary;
                } else {
                    summary.innerHTML = "<p>No summary available</p>";
                }

                infoDiv.appendChild(title);
                infoDiv.appendChild(summary);
                showData.appendChild(img);
                showData.appendChild(infoDiv);

                showContainer.appendChild(showData);
            }
        } catch (error) {
            console.error("Error fetching show data:", error);
            showContainer.innerHTML = "<p>Something went wrong. Please try again later.</p>";
        }

    });    
    
});