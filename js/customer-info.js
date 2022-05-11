const customerId = localStorage.getItem("customer-id");

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

getCustomerInfo();

async function getCustomerInfo() {
  const res = await fetch(
    `https://vast-meadow-86256.herokuapp.com/customers/${customerId}`,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    }
  );
  const data = await res.json();

  fillData(data);
}

function fillData(data) {
  infoSection.querySelector(".name").innerText = data.name;
  infoSection.querySelector(".email").innerText = data.email;
  infoSection.querySelector(
    ".balance"
  ).innerHTML = `Balance <span class="amount">${data.currentBalance} </span>`;
}

getTransferInfo();

async function getTransferInfo() {
  const res = await fetch(
    `https://vast-meadow-86256.herokuapp.com/transfers/`,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    }
  );
  const data = await res.json();

  console.log(data);
  fillSendSection(data);
  fillReceiveSection(data);
}

const sendBody = document.querySelector("#table-send-body");
const sendTemplate = document.querySelector("#send-row-template");
const receiveBody = document.querySelector("#table-receive-body");
const receiveTemplate = document.querySelector("#receive-row-template");

function fillSendSection(data) {
  let sendArr = [];

  for (let i = 0; i < data.length; i++) {
    if (data[i].sender.id === customerId) sendArr.push(data[i]);
  }

  sendArr.forEach((item) =>
    sendBody.append(sendTemplate.content.cloneNode(true))
  );

  const rows = sendBody.querySelectorAll(".row");

  rows.forEach((row, idx) => {
    row.querySelector(".name").innerText = sendArr[idx].receiver.name;
    row.querySelector(".amount").innerText = sendArr[idx].amount;
    row.querySelector(".date").innerText = sendArr[idx].transferDate;
  });
}

function fillReceiveSection(data) {
  let receiveArr = [];

  for (let i = 0; i < data.length; i++) {
    if (data[i].receiver.id === customerId) receiveArr.push(data[i]);
  }

  receiveArr.forEach((item) =>
    receiveBody.append(sendTemplate.content.cloneNode(true))
  );

  const rows = receiveBody.querySelectorAll(".row");

  rows.forEach((row, idx) => {
    row.querySelector(".name").innerText = receiveArr[idx].sender.name;
    row.querySelector(".amount").innerText = receiveArr[idx].amount;
    row.querySelector(".date").innerText = receiveArr[idx].transferDate;
  });
}
