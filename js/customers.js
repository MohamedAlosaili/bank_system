const cardTemplate = document.querySelector("#card-template");
const cardsContainer = document.querySelector("#customers-cards");

getCustomersInfo();

async function getCustomersInfo() {
  try {
    const res = await fetch(
      "https://vast-meadow-86256.herokuapp.com/customers",
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      }
    );
    const data = await res.json();

    createCards(data);
  } catch (err) {
    console.log(err);
  }
}

function createCards(data) {
  cardsContainer.innerHTML = "";
  for (let i = 0; i < data.length; i++)
    cardsContainer.append(cardTemplate.content.cloneNode(true));

  const cards = cardsContainer.querySelectorAll(".card");
  cards.forEach((card, idx) => {
    sessionStorage.setItem("customers-info", JSON.stringify(data));
    card.dataset.id = data[idx]._id;
    // card.querySelector()
    card.querySelector(".customer-name").innerText = data[idx].name;
    card.querySelector(
      ".balance"
    ).innerHTML = `Balance: <span class="amount">${data[idx].currentBalance}</span>`;
  });

  const detailsBtn = document.querySelectorAll(".card .btn.details");

  detailsBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      sessionStorage.setItem("customer-id", e.target.parentElement.dataset.id);
    });
  });
}
