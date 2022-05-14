const API_URL = "https://vast-meadow-86256.herokuapp.com";
// SessionStorage Variables
const customerId = sessionStorage.getItem("customer-id");
const customers = JSON.parse(sessionStorage.getItem("customers-info"));
// Info Section Variables
const infoSection = document.querySelector("#customer-info");
const transLink = document.querySelector("#transfer-link");
// Send & Receive Variables
const sendBody = document.querySelector("#table-send-body");
const receiveBody = document.querySelector("#table-receive-body");
const dataTemplate = document.querySelector("#data-template");
// Transfer Popup
const transContainer = document.querySelector("#transfer-container");
const transForm = document.querySelector("#transfer-form");
const customerList = document.querySelector("#customer-list");
const optionTemplate = document.querySelector("#option-template");
const amountInput = document.querySelector("[name='amount']");
const closeTransPopup = document.querySelector("#close-icon");
const loading = document.querySelector("#loading");
const warning = document.querySelector("#warning");
const warningCloseBtn = warning.querySelector("#warning-btn");

// Functions calls
getCustomerInfo();
getTransferInfo();
fillInfoSection();
fillSelectionList();

transLink.addEventListener("click", () => {
  transContainer.classList.add("active");
});

closeTransPopup.addEventListener("click", () => {
  transContainer.classList.remove("active");
});

warning.querySelector(".warn-balance").innerText =
  getCustomerInfo().currentBalance;

let receiverObj;

transForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const receiveId = customerList.value;

  receiverObj = customers.filter((customer) => {
    return customer._id == receiveId;
  })[0];

  if (
    +amountInput.value > 0 &&
    +amountInput.value <= getCustomerInfo().currentBalance
  ) {
    loading.classList.add("active");
    amountInput.parentElement.classList.remove("non-valid");
    sendTransferData();
  } else if (+amountInput.value > getCustomerInfo().currentBalance) {
    amountInput.parentElement.classList.add("non-valid");
    warning.classList.add("active");
    amountInput.value = "";
  } else {
    amountInput.parentElement.classList.add("non-valid");
  }
});

warningCloseBtn.addEventListener("click", () => {
  warning.classList.remove("active");
  amountInput.parentElement.classList.remove("non-valid");
});

function getCustomerInfo() {
  const customerObj = customers.filter((customer) => {
    return customer._id == customerId;
  })[0];

  return customerObj;
}

// Info section script
function fillInfoSection() {
  infoSection.querySelector(".img").src = getCustomerInfo().avatarImg;
  infoSection.querySelector(".name").innerText = getCustomerInfo().name;
  infoSection.querySelector(".email").innerText = getCustomerInfo().email;
  infoSection.querySelector(
    ".balance"
  ).innerHTML = `Balance: <span class="amount">${
    getCustomerInfo().currentBalance
  } </span>`;
}

function fillSelectionList() {
  const customersArr = customers.filter((customer) => {
    return customer._id != getCustomerInfo()._id;
  });

  customerList.innerHTML = "";
  for (let i = 0; i < customersArr.length; i++)
    customerList.append(optionTemplate.content.cloneNode(true));

  const options = customerList.querySelectorAll(".option");

  options.forEach((option, idx) => {
    option.innerText = customersArr[idx].name;
    option.setAttribute("value", customersArr[idx]._id);
  });
}

async function sendTransferData() {
  try {
    const res = await fetch(`${API_URL}/transfers`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        amount: +amountInput.value,
        sender: {
          name: getCustomerInfo().name,
          id: getCustomerInfo()._id,
        },
        receiver: {
          name: receiverObj.name,
          id: receiverObj._id,
        },
      }),
    });
    const data = await res.json();

    let senderNewBalance =
      getCustomerInfo().currentBalance - +amountInput.value;
    let receiverNewBalance = receiverObj.currentBalance + +amountInput.value;

    if (data._id) {
      updateCustomerBalance(senderNewBalance, getCustomerInfo()._id, 1);
      updateCustomerBalance(receiverNewBalance, receiverObj._id, 2);
    }
  } catch (err) {
    window.open("../pages/404.html", "_self");
  }
}

async function updateCustomerBalance(newBalance, id, callNum) {
  try {
    const res = await fetch(`${API_URL}/customers/${id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        currentBalance: newBalance,
      }),
    });
    const data = await res.json();

    if (data._id && callNum == 2) {
      window.open("../pages/transactions.html", "_self");
    }
  } catch (err) {
    window.open("../pages/404.html", "_self");
  }
}

// Send and Receive sections script
async function getTransferInfo() {
  try {
    const res = await fetch(`${API_URL}/transfers/`);
    const data = await res.json();

    fillSendSection(data);
    fillReceiveSection(data);
  } catch (err) {
    window.open("../pages/404.html", "_self");
  }
}

function fillSendSection(data) {
  let sendArr = [];

  for (let i = 0; i < data.length; i++) {
    if (data[i].sender.id == customerId) sendArr.unshift(data[i]);
  }
  fillTableBody(sendArr, sendBody, "receiver");
}

function fillReceiveSection(data) {
  let receiveArr = [];

  for (let i = 0; i < data.length; i++) {
    if (data[i].receiver.id == customerId) receiveArr.unshift(data[i]);
  }
  fillTableBody(receiveArr, receiveBody, "sender");
}

function fillTableBody(arrOfRows, container, sendOrReceive) {
  container.innerHTML = "";

  arrOfRows.forEach(() => {
    container.append(dataTemplate.content.cloneNode(true));
  });

  const rows = container.querySelectorAll(".row");

  rows.forEach((row, idx) => {
    row.querySelector(".name").innerText =
      arrOfRows[idx][`${sendOrReceive}`].name;
    row.querySelector(".amount").innerText = arrOfRows[idx].amount;
    row.querySelector(".date").innerText = arrOfRows[idx].transferDate;
  });
}
