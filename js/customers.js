const API_URL = "https://vast-meadow-86256.herokuapp.com";

const cardTemplate = document.querySelector("#card-template");
const placeholderTemplate = document.querySelector("#skeleton-template");
const cardsContainer = document.querySelector("#customers-cards");

createSkeletonCards();
getCustomersInfo();

function createSkeletonCards() {
  cardsContainer.innerHTML = "";
  for (let i = 0; i < 10; i++) {
    cardsContainer.append(placeholderTemplate.content.cloneNode(true));
  }
}

async function getCustomersInfo() {
  try {
    const res = await fetch(`${API_URL}/customers`);
    const data = await res.json();

    createCards(data);
  } catch (err) {
    window.open("../pages/404.html", "_self");
  }
}

function createCards(data) {
  cardsContainer.innerHTML = "";
  for (let i = 0; i < data.length; i++)
    cardsContainer.append(cardTemplate.content.cloneNode(true));

  // Create customer-info in sessionStorage
  sessionStorage.setItem("customers-info", JSON.stringify(data));

  fillCustomerCards(data);

  pickCustomerIdOnClick();
}

function fillCustomerCards(data) {
  const cards = cardsContainer.querySelectorAll(".card");
  cards.forEach((card, idx) => {
    card.dataset.id = data[idx]._id;
    card.querySelector(".img").src = data[idx].avatarImg;
    card.querySelector(".customer-name").innerText = `${data[idx].name}`;
    card.querySelector(
      ".balance"
    ).innerHTML = `Balance: <span class="amount">${data[idx].currentBalance}</span>`;
  });
}

function pickCustomerIdOnClick() {
  const detailsBtn = document.querySelectorAll(".card .btn.details");

  detailsBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      sessionStorage.setItem(
        "customer-id",
        e.target.parentElement.parentElement.dataset.id
      );
    });
  });
}
