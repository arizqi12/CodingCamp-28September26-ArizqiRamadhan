const transactionForm = document.getElementById("transaction-form");
const itemNameInput = document.getElementById("item-name");
const itemAmountInput = document.getElementById("item-amount");
const itemCategorySelect = document.getElementById("item-category");
const transactionList = document.getElementById("transaction-list");
const totalBalanceEl = document.getElementById("total-balance");
const themeToggleBtn = document.getElementById("theme-toggle");
const sortSelect = document.getElementById("sort-select");
const newCategoryInput = document.getElementById("new-category-input");
const addCategoryBtn = document.getElementById("add-category-btn");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let categories = JSON.parse(localStorage.getItem("categories")) || [
  "Food",
  "Transport",
  "Fun",
];
let currentTheme = localStorage.getItem("theme") || "light";
let spendingChart = null;

function init() {
  applyTheme(currentTheme);
  renderCategories();
  renderTransactions();
  updateBalance();
  initChart();
}

function saveToLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
  localStorage.setItem("categories", JSON.stringify(categories));
}

themeToggleBtn.addEventListener("click", () => {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  localStorage.setItem("theme", currentTheme);
  applyTheme(currentTheme);
});

function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    themeToggleBtn.textContent = "☀️ Light Mode";
  } else {
    document.documentElement.removeAttribute("data-theme");
    themeToggleBtn.textContent = "🌙 Dark Mode";
  }
}

function renderCategories() {
  itemCategorySelect.innerHTML = "";
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    itemCategorySelect.appendChild(option);
  });
}

addCategoryBtn.addEventListener("click", () => {
  const newCat = newCategoryInput.value.trim();
  if (!newCat) {
    alert("Please enter a category name.");
    return;
  }
  if (categories.includes(newCat)) {
    alert("Category already exists!");
    return;
  }

  categories.push(newCat);
  saveToLocalStorage();
  renderCategories();
  newCategoryInput.value = "";
  updateChartData();
});

transactionForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = itemNameInput.value.trim();
  const amount = parseFloat(itemAmountInput.value);
  const category = itemCategorySelect.value;

  if (!name || isNaN(amount) || amount <= 0) {
    alert("Please fill in all fields correctly!");
    return;
  }

  const newTransaction = {
    id: Date.now(),
    name: name,
    amount: amount,
    category: category,
  };

  transactions.push(newTransaction);
  saveToLocalStorage();

  itemNameInput.value = "";
  itemAmountInput.value = "";

  renderTransactions();
  updateBalance();
  updateChartData();
});

function deleteTransaction(id) {
  transactions = transactions.filter((item) => item.id !== id);
  saveToLocalStorage();
  renderTransactions();
  updateBalance();
  updateChartData();
}

sortSelect.addEventListener("change", () => {
  renderTransactions();
});

function getSortedTransactions() {
  const sortVal = sortSelect.value;
  let sorted = [...transactions];

  if (sortVal === "newest") {
    sorted.sort((a, b) => b.id - a.id);
  } else if (sortVal === "oldest") {
    sorted.sort((a, b) => a.id - b.id);
  } else if (sortVal === "highest") {
    sorted.sort((a, b) => b.amount - a.amount);
  } else if (sortVal === "lowest") {
    sorted.sort((a, b) => a.amount - b.amount);
  }
  return sorted;
}

function renderTransactions() {
  transactionList.innerHTML = "";
  const sortedData = getSortedTransactions();

  if (sortedData.length === 0) {
    transactionList.innerHTML =
      '<p style="text-align: center; color: var(--text-muted); padding: 20px;">No transactions added yet.</p>';
    return;
  }

  sortedData.forEach((item) => {
    const li = document.createElement("li");
    li.classList.add("transaction-item");

    li.innerHTML = `
            <div class="transaction-info">
                <h4>${escapeHtml(item.name)}</h4>
                <div class="amount">$${item.amount.toFixed(2)}</div>
                <span class="badge">${item.category}</span>
            </div>
            <button class="btn-delete" type="button">Delete</button>
        `;

    li.querySelector(".btn-delete").addEventListener("click", () => {
      deleteTransaction(item.id);
    });

    transactionList.appendChild(li);
  });
}

function updateBalance() {
  const total = transactions.reduce((acc, item) => acc + item.amount, 0);
  totalBalanceEl.textContent = `$${total.toFixed(2)}`;
}

function initChart() {
  const canvas = document.getElementById("spendingChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const categoryTotals = getCategoryTotals();

  spendingChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(categoryTotals),
      datasets: [
        {
          data: Object.values(categoryTotals),
          backgroundColor: [
            "#10b981",
            "#3b82f6",
            "#f97316",
            "#8b5cf6",
            "#ec4899",
            "#14b8a6",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });
}

function updateChartData() {
  if (!spendingChart) {
    initChart();
    return;
  }

  const categoryTotals = getCategoryTotals();
  spendingChart.data.labels = Object.keys(categoryTotals);
  spendingChart.data.datasets[0].data = Object.values(categoryTotals);
  spendingChart.update("none");
}

function getCategoryTotals() {
  const totals = {};
  categories.forEach((cat) => (totals[cat] = 0));

  transactions.forEach((item) => {
    if (totals[item.category] === undefined) {
      totals[item.category] = 0;
    }
    totals[item.category] += item.amount;
  });
  return totals;
}

function escapeHtml(str) {
  return str.replace(
    /[&<>'"]/g,
    (tag) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
        tag
      ] || tag,
  );
}

init();
