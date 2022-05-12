const API_URL = "https://vast-meadow-86256.herokuapp.com";

const customerId = localStorage.getItem("customer-id");
const customerName = localStorage.getItem("customer-name");

const transLink = document.querySelector("#transfer-link");
const transContainer = document.querySelector("#transfer-container");
const closeTransPopup = document.querySelector("#close-icon");
const infoSection = document.querySelector("#info-section");

transLink.addEventListener("click", () => {
  transContainer.classList.add("active");
});

closeTransPopup.addEventListener("click", () => {
  transContainer.classList.remove("active");
});

// API Functions calls
getCustomerInfo();
getTransferInfo();
getAllCustomersInfo();

async function getCustomerInfo() {
  const res = await fetch(`${API_URL}/customers/${customerId}`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  });
  const data = await res.json();

  fillInfoSection(data);
  return data;
}

// Info section script
function fillInfoSection(data) {
  infoSection.querySelector(".name").innerText = data.name;
  infoSection.querySelector(".email").innerText = data.email;
  infoSection.querySelector(
    ".balance"
  ).innerHTML = `Balance <span class="amount">${data.currentBalance} </span>`;
}

async function getTransferInfo() {
  const res = await fetch(`${API_URL}/transfers/`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  });
  const data = await res.json();

  fillSendSection(data);
  fillReceiveSection(data);
}

// Transfer opration script
async function getAllCustomersInfo() {
  const res = await fetch(`${API_URL}/customers`, {
    headers: { "Content-type": "application/json" },
  });

  const data = await res.json();

  console.log(data);
  fillSelectionList(data);
}

// Fill Customer select list
const customerlist = document.querySelector("#customer-list");
const optionTemplate = document.querySelector("#option-template");

function fillSelectionList(data) {
  customerlist.innerHTML = "";
  for (let i = 0; i < data.length; i++)
    customerlist.append(optionTemplate.content.cloneNode(true));

  const customers = document.querySelectorAll(".option");

  customers.forEach((customer, idx) => {
    customer.innerText = data[idx].name;
    customer.setAttribute("value", `${data[idx].name}-${data[idx]._id}`);
  });
}

// Submit form function
const transForm = document.querySelector("#transfer-form");
const amountInput = document.querySelector("[name='amount']");

transForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const receiveName = customerlist.value.split("-")[0];
  const receiveId = customerlist.value.split("-")[1];

  console.log(receiveName);
  console.log(receiveId);
  // getCustomerInfo()
  //   .then((res) => res.json())
  //   .then((data) => console.log(data));

  if (+amountInput > 0 && +amountInput <= getCustomerInfo().currentBalance) {
    console.log("True");
    // sendTransferData().then(res => res.json()).then;
    sendTransferData();
  }

  async function sendTransferData() {
    const res = await fetch(`${API_URL}/transfers`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        amount: amountInput,
        sender: {
          name: await getCustomerInfo().name,
          id: await getCustomerInfo()._id,
        },
        receiver: {
          name: receiveName,
          id: receiveId,
        },
      }),
    });
    const data = await res.json();
    console.log(data);
  }
});

// Send and Receive sections script
const sendBody = document.querySelector("#table-send-body");
const receiveBody = document.querySelector("#table-receive-body");
const dataTemplate = document.querySelector("#data-template");

function fillSendSection(data) {
  let sendArr = [];

  for (let i = 0; i < data.length; i++) {
    if (data[i].sender.id === customerId) sendArr.push(data[i]);
  }

  fillBodyTable(sendArr, sendBody, "sender");
}

function fillReceiveSection(data) {
  let receiveArr = [];

  for (let i = 0; i < data.length; i++) {
    if (data[i].receiver.id === customerId) receiveArr.push(data[i]);
  }

  fillBodyTable(receiveArr, receiveBody, "receiver");
}

function fillBodyTable(arrOfRows, container, dataType) {
  arrOfRows.forEach(() => {
    container.append(dataTemplate.content.cloneNode(true));
  });

  const rows = document.querySelectorAll(".row");

  rows.forEach((row, idx) => {
    row.querySelector(".name").innerText = arrOfRows[idx][`${dataType}`].name;
    row.querySelector(".amount").innerText = arrOfRows[idx].amount;
    row.querySelector(".date").innerText = arrOfRows[idx].transferDate;
  });
}
