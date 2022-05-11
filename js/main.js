const hamburger = document.querySelector("#hamburger");
const mobileMenu = document.querySelector("#nav-links");

hamburger.addEventListener("click", (e) => {
  e.stopPropagation;
  hamburger.classList.toggle("active");
  mobileMenu.classList.toggle("active");
});

window.addEventListener("scroll", () => {
  hamburger.classList.remove("active");
  mobileMenu.classList.remove("active");
});

document.querySelector("#year").innerText = new Date().getFullYear();
