const transLink = document.querySelector("#transfer-link");
const transContainer = document.querySelector("#transfer-container");
const closeTransPopup = document.querySelector("#close-icon");

transLink.addEventListener("click", () => {
  transContainer.classList.add("active");
});

closeTransPopup.addEventListener("click", () => {
  transContainer.classList.remove("active");
});
