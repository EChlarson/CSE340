document.addEventListener("DOMContentLoaded", function () {
   const favButton = document.getElementById("favButton");
   const button = favButton.querySelector("button");
 
   if (button.innerText === "Already Saved") {
     button.setAttribute("disabled", true); // Disable the button
   }
 
   favButton.addEventListener("submit", function (event) {
     button.innerText = "Already Saved"; // Change the text
     button.setAttribute("disabled", true); // Disable button after submission
   });
 });