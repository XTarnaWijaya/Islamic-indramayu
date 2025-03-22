document.addEventListener("DOMContentLoaded", function() {
  if (!sessionStorage.getItem("popupShown")) {
    var popup = document.getElementById("popup");
    popup.style.display = "block";
    sessionStorage.setItem("popupShown", "true");
  }
  var closeBtn = document.querySelector(".close");
  closeBtn.addEventListener("click", function() {
    document.getElementById("popup").style.display = "none";
  });
});