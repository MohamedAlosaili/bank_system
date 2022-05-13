const API_URL = "https://vast-meadow-86256.herokuapp.com";
const tableBody = document.querySelector("#t-body");
const bodyTemplate = document.querySelector("#body-template");

getTransferHistory();

async function getTransferHistory() {
  try {
    const res = await fetch(`${API_URL}/transfers`);
    const data = await res.json();

    fillTransferTable(data);
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}

function fillTransferTable(data) {
  tableBody.innerHTML = "";

  for (let i = 0; i < data.length; i++)
    tableBody.append(bodyTemplate.content.cloneNode(true));

  const rows = tableBody.querySelectorAll(".row");

  rows.forEach((row, idx) => {
    idx += 1;
    row.querySelector(".num").innerHTML = idx;
    row.querySelector(".sender").innerHTML =
      data[data.length - idx].sender.name;
    row.querySelector(".receiver").innerHTML =
      data[data.length - idx].receiver.name;
    row.querySelector(".amount").innerHTML = data[data.length - idx].amount;
    row.querySelector(".date").innerHTML = data[data.length - idx].transferDate;
  });
}
