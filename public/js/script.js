const passButton = document.querySelector('#pb');

passButton.addEventListener("click", function() {
   const passwordField = document.getElementById('password');
   const type = passwordField.getAttribute("type");
   if (type === "password") {
      passwordField.setAttribute("type", "text");
      passButton.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
   } else {
      passwordField.setAttribute("type", "password");
      passButton.innerHTML = '<i class="fa-solid fa-eye"></i>'
   }
});