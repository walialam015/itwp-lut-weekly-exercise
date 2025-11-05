if(document.readyState !== "loading") {
    console.log("Document is ready!");
    initializeCode();
} else {
    document.addEventListener("DOMContentLoaded", function() {
        console.log("Document is ready after waiting!");
        initializeCode();
    })
}

function initializeCode() {
    const myButton = document.getElementById("my-button");
    const mainHeading = document.getElementById("main-heading");

    const addButton = document.getElementById("add-data");
    const list = document.getElementById("my-list");
    const textarea = document.getElementById("my-textarea");

    myButton.addEventListener("click", function() {
        console.log("Hellow world");
        mainHeading.textContent = "Moi maailma"
    })

    addButton.addEventListener("click", function () {
        
        const newItem = document.createElement("li");  
        newItem.textContent = textarea.value;        
        list.appendChild(newItem);        
        textarea.value = "";
});
}

