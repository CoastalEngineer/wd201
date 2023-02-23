const load = () => {
  let entries = localStorage.getItem("storedEntries");

  if (entries != null) {
    entries = JSON.parse(entries);
  } else {
    entries = [];
  }

  return entries;
};

const push = (event) => {
  event.preventDefault();

  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
  let dob = document.getElementById("dob").value;
  let accepted = document.getElementById("toggle-check").checked;

  let entry = {
    name,
    email,
    password,
    dob,
    accepted,
  };

  prev.push(entry);

  localStorage.setItem("storedEntries", JSON.stringify(prev));

  displayEntries();
};

const displayEntries = () => {
  const entries = load();

  const row = entries
    .map((entry) => {
      const name = `<th>${entry.name}</th>`;
      const email = `<th>${entry.email}</th>`;
      const password = `<th>${entry.password}</th>`;
      const dob = `<th>${entry.dob}</th>`;
      const accepted = `<th>${entry.accepted}</th>`;
      return `<tr>${name} ${email} ${password} ${dob} ${accepted}</tr>`;
    })
    .join("\n");

  let table = document.getElementById("table");
  table.innerHTML = `
  <tr>
  <th> Name </th> 
  <th>Email</th>
        <th>Password</th>
        <th>Dob</th>
        <th>Accepted terms?</th>
  </tr>
  ${row}
  `;
};

let prev = load();

let form = document.getElementById("form");

form.addEventListener("submit", push);

displayEntries();

function getAge(today, bday) {
  let age = today.getFullYear() - bday.getFullYear();
  let month = today.getMonth() - bday.getMonth();

  if (month < 0 || (month === 0 && today.getDate() < bday.getDate())) {
    age--;
  }
  return age;
}

let dateSelector = document.getElementById("dob");

dateSelector.addEventListener("change", () => {
  let [year, month, date] = document.getElementById("dob").value.split("-");

  let dob = new Date(year, month, date);

  let today = new Date();

  age = getAge(today, dob);

  if (age < 18 || age > 55) {
    dateSelector.setCustomValidity("Age must be between 18 and 55");
    dateSelector.reportValidity();
  } else {
    dateSelector.setCustomValidity("");
  }
});

const email = document.getElementById("email");

email.addEventListener("input", () => ValidityState(email));

function validate(ele) {
  if (ele.validity.typeMismatch) {
    ele.setCustomValidity("Email is not in correct format!");
    ele.reportValidity();
  } else {
    ele.setCustomValidity("");
  }
}
