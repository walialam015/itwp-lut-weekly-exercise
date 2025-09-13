var form = document.getElementById("user-form");
var table = document.getElementById("user-table");
var tableBody = document.getElementById("table-body");
var emptyButton = document.getElementById("empty-table");

table.setAttribute("border", "1");


form.addEventListener("submit", function(event) {
    event.preventDefault();

    var username = document.getElementById("input-username").value;
    var email = document.getElementById("input-email").value;
    var isAdmin = document.getElementById("input-admin").checked;
    var imageInput = document.getElementById("input-image");

    var rowID = "row-" + username;

    var oldRow = document.getElementById(rowID);
    if(oldRow) {
        tableBody.removeChild(oldRow);
    }

    var newRow = document.createElement("tr");
    newRow.setAttribute("id", rowID);

    var usernameBox = document.createElement("td");
    usernameBox.textContent = username;
    newRow.appendChild(usernameBox);

    var emailBox = document.createElement("td");
    emailBox.textContent = email;
    newRow.appendChild(emailBox);

    var adminBox = document.createElement("td");
    if (isAdmin) {
        adminBox.textContent = "X";
    } else {
        adminBox.textContent = "-";
    }
    newRow.appendChild(adminBox);

    var imageBox = document.createElement("td");
    var file = imageInput.files[0];

    if (file) {
        var img = document.createElement("img");
        img.src = URL.createObjectURL(file);
        img.width = 64;
        img.height = 64;
        imageBox.appendChild(img);
    } else {
        imageBox.textContent = "NO IMAGE SELECTED";
    }

    newRow.appendChild(imageBox);

    tableBody.appendChild(newRow);

    form.reset();
});

emptyButton.addEventListener("click", function() {
    tableBody.innerHTML = "";
});

