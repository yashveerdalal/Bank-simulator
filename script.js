"use strict";

const owners = [
  {
    owner: "yashveerDalal",
    Pin: 1212,
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  },
  {
    owner: "nidhiRana",
    Pin: 9090,
    movements: [-4000, 600, -40, -75, 9000, -320, 500, -4],
  },
  {
    owner: "harshKundu",
    Pin: 7557,
    movements: [20, 300, -50, 95, -3010, -210],
  },
];

const elements = {
  existingUser: document.querySelector(".direct-user-login"),
  existingPin: document.querySelector(".user-login-pin"),
  usernameNew: document.querySelector(".inputHomeUser"),
  newPin: document.querySelector(".inputHomePin"),
  signUp: document.querySelector(".signUp"),
  directLogin: document.querySelector(".arrow-button"),
  logout: document.querySelector(".logout-button"),
  dark: document.querySelector(".dark-mode-toggle"),
  transferInput: document.querySelector(".transfer-to"),
  transferAmount: document.querySelector(".transfer-amount"),
  transferButton: document.querySelector(".transfer-button"),
  loanAmount: document.querySelector(".loan-amount"),
  loanButton: document.querySelector(".loan-button"),
  closeUser: document.querySelector(".confirm-user"),
  closePin: document.querySelector(".confirm-pin"),
  closeButton: document.querySelector(".close-button"),
  closeTimer: document.querySelector(".close-timer"),
  totalBalance: document.querySelector(".totalBalance"),
  homePage: document.querySelector(".home-page"),
  container: document.querySelector(".container"),
  header: document.querySelector(".header"),
  image: document.querySelector(".ui-image"),
  bodyStyle: document.querySelector(".bodyStyle"),
  transactionsDark: document.querySelector(".transactions"),
  actionsDark: document.querySelector(".actions"),
  financialData: document.querySelector(".financialData"),
  FinancialDataRowStyle: document.querySelector(".financialDataRow"),
  scrollBar: document.querySelector(".scrollBar"),
  dateTimeDisplay: document.querySelector(".date-time"),
};

const camelCase = function (username) {
  return username
    .trim()
    .toLowerCase()
    .split(" ")
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join("");
};

const applyLayoutChange = function () {
  elements.container.classList.toggle(
    "desktop-layout",
    window.innerWidth >= 768
  );
};

const updateBalance = function (balance) {
  elements.totalBalance.textContent = `${balance} $`;
};

const updateFinancialData = function () {
  if (!accountOwner) return;

  const user = owners.find((owner) => owner.owner === accountOwner);

  if (user) {
    const { movements } = user;
    const totalIn = movements
      .filter((mov) => mov > 0)
      .reduce((acc, mov) => acc + mov, 0);
    const totalOut = movements
      .filter((mov) => mov < 0)
      .reduce((acc, mov) => acc + mov, 0);
    const totalLoan =
      movements.filter((mov) => mov > 0).reduce((acc, mov) => acc + mov, 0) *
      0.012;

    elements.scrollBar.innerHTML = "";

    movements.forEach((mov) => {
      const div = document.createElement("div");
      div.classList.add("transaction");

      if (mov > 0) {
        div.textContent = `+${mov} $`;
        div.classList.add("loan");
      } else {
        div.textContent = `-${Math.abs(mov)} $`;
        div.classList.add("withdrawal");
      }

      elements.scrollBar.prepend(div);
    });

    document.getElementById("in").value = `${totalIn} $`;
    document.getElementById("out").value = `${Math.abs(totalOut)} $`;
    document.getElementById("interest").value = `${totalLoan.toFixed(2)} $`;
  }
};

const sign = function () {
  const username = camelCase(elements.usernameNew.value);
  const pin = Number(elements.newPin.value);

  if (!username || !pin) {
    alert("Username and PIN cannot be empty.");
    return;
  }

  if (owners.some((owner) => owner.owner === username)) {
    alert("Username is already taken.");
    return;
  }

  owners.push({
    owner: username,
    Pin: pin,
    movements: [],
  });
  console.log("Sign-up successful");
  console.log("Updated owners array: ", owners);

  accountOwner = username;
  accBalance = 0;
  updateBalance(accBalance);
  updateFinancialData();
};

let accountOwner;
let accBalance = 0;

const login = function () {
  const username = camelCase(elements.existingUser.value);
  const pin = Number(elements.existingPin.value);

  const user = owners.find(
    (account) => account.owner === username && account.Pin === pin
  );
  if (user) {
    elements.homePage.classList.add("hidden");
    elements.container.classList.add("show");
    elements.header.classList.add("show");
    elements.image.classList.add("show");

    accountOwner = username;
    accBalance = user.movements.reduce((acc, mov) => acc + mov, 0);
    updateBalance(accBalance);

    elements.existingUser.value = "";
    elements.existingPin.value = "";

    console.log("Login successful");
    startLogoutTimer();
    updateFinancialData();
  } else {
    alert("Wrong username or PIN.");
  }
};

const loan = function () {
  const loanAmt = Number(elements.loanAmount.value);

  if (loanAmt > 0 && accountOwner) {
    setTimeout(() => {
      const user = owners.find((owner) => owner.owner === accountOwner);
      if (user) {
        user.movements.push(loanAmt);
        accBalance += loanAmt;
        updateBalance(accBalance);
        elements.loanAmount.value = "";
        console.log(
          `Loan of ${loanAmt} approved for ${accountOwner}. New balance: ${accBalance}`
        );
        updateFinancialData();
      }
    }, 2000);
  } else {
    alert("Invalid loan amount or no user logged in.");
  }
};

const transferFunds = function () {
  const transferAmt = Number(elements.transferAmount.value);
  const recipient = camelCase(elements.transferInput.value);

  if (
    transferAmt > 0 &&
    transferAmt <= accBalance &&
    owners.some((owner) => owner.owner === recipient)
  ) {
    owners.forEach((owner) => {
      if (owner.owner === accountOwner) {
        owner.movements.push(-transferAmt);
        accBalance -= transferAmt;
      }
      if (owner.owner === recipient) {
        owner.movements.push(transferAmt);
      }
    });
    updateBalance(accBalance);
    elements.transferAmount.value = "";
    elements.transferInput.value = "";
    console.log(
      `Transferred ${transferAmt} to ${recipient}. New balance: ${accBalance}`
    );
    updateFinancialData();
  } else {
    alert("Invalid transfer amount or recipient does not exist.");
  }
};

const closeAccount = function () {
  const username = camelCase(elements.closeUser.value);
  const pin = Number(elements.closePin.value);

  const userIndex = owners.findIndex(
    (owner) => owner.owner === username && owner.Pin === pin
  );

  if (userIndex !== -1) {
    owners.splice(userIndex, 1);
    elements.closeUser.value = "";
    elements.closePin.value = "";

    console.log("Account closed successfully");
    console.log("Updated owners array:", owners);

    elements.homePage.classList.remove("hidden");
    elements.container.classList.remove("show");
    elements.header.classList.remove("show");
    elements.image.classList.remove("show");

    accountOwner = null;
    accBalance = 0;
    updateBalance(accBalance);
    updateFinancialData();
  } else {
    alert("Wrong username or PIN. Account closure failed.");
  }
};

const logoutUser = function () {
  elements.homePage.classList.remove("hidden");
  elements.container.classList.remove("show");
  elements.header.classList.remove("show");
  elements.image.classList.remove("show");

  accountOwner = null;
  accBalance = 0;
  updateBalance(accBalance);

  elements.usernameNew.value = "";
  elements.newPin.value = "";
  elements.existingPin.value = "";
  elements.existingUser.value = "";

  darkMode = false;
  darkModeElements.forEach((el) => el.classList.remove("dark-mode"));
  darkModeTextElements.forEach((el) => el.classList.remove("dark-mode-text"));

  console.log("Logged out due to inactivity");
};

let logoutTimer;
let countdownInterval;

const startLogoutTimer = function () {
  let time = 300;

  const updateTimer = function () {
    const minutes = String(Math.floor(time / 60)).padStart(2, "0");
    const seconds = String(time % 60).padStart(2, "0");
    elements.closeTimer.textContent = `${minutes}:${seconds}`;
    time--;

    if (time < 0) {
      clearInterval(countdownInterval);
      logoutUser();
    }
  };

  updateTimer();
  countdownInterval = setInterval(updateTimer, 1000);
};

const darkModeElements = [
  elements.bodyStyle,
  elements.transactionsDark,
  elements.actionsDark,
  elements.financialData,
  elements.FinancialDataRowStyle,
  elements.scrollBar,
];
const darkModeTextElements = [elements.totalBalance];

let darkMode = false;

const toggleDarkMode = function () {
  darkMode = !darkMode;

  darkModeElements.forEach((el) => el.classList.toggle("dark-mode", darkMode));
  darkModeTextElements.forEach((el) =>
    el.classList.toggle("dark-mode-text", darkMode)
  );

  console.log(`Dark mode ${darkMode ? "enabled" : "disabled"}`);
};

const updateDateTime = function () {
  const now = new Date();
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  elements.dateTimeDisplay.textContent = now.toLocaleDateString(
    "en-US",
    options
  );
};

setInterval(updateDateTime, 1000);

elements.signUp.addEventListener("click", sign);
elements.directLogin.addEventListener("click", login);
elements.logout.addEventListener("click", logoutUser);
elements.transferButton.addEventListener("click", transferFunds);
elements.loanButton.addEventListener("click", loan);
elements.closeButton.addEventListener("click", closeAccount);
elements.dark.addEventListener("click", toggleDarkMode);
window.addEventListener("resize", applyLayoutChange);

applyLayoutChange();
updateDateTime();
