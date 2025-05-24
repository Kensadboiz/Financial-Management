document.addEventListener("DOMContentLoaded", () => {
  const balanceEl = document.querySelector(".balance");
  const incomeEl = document.querySelector(".income strong");
  const expenseEl = document.querySelector(".expense strong");
  const budgetList = document.querySelector(".budget-list");
  const transactionList = document.querySelector(".transaction-list");
  const billList = document.querySelector(".bill-list");
  const searchIcon = document.querySelector(".search-icon");
  const searchInput = document.querySelector(".search-input");

  // 1. Hiển thị thông tin thu chi và số dư trong tháng hiện tại
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
  const filteredMonthTransactions = transactions.filter(t => t.date.startsWith(currentMonth));

  let income = 0;
  let expense = 0;
  filteredMonthTransactions.forEach(t => {
    const type = t.type.toLowerCase();
    const amount = Number(t.amount);
    if (type.includes("thu")) income += amount;
    else if (type.includes("chi")) expense += amount;
  });

  const accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
  const totalBalance = accounts.reduce((sum, acc) => sum + Number(acc.balance || 0), 0);

  if (balanceEl) balanceEl.textContent = `₫ ${totalBalance.toLocaleString("vi-VN")}`;
  if (incomeEl) incomeEl.textContent = `₫${income.toLocaleString("vi-VN")}`;
  if (expenseEl) expenseEl.textContent = `₫${expense.toLocaleString("vi-VN")}`;

  // Hàm hiển thị danh sách ngân sách
  function renderBudgets(list) {
    budgetList.innerHTML = "";
    list.forEach(b => {
      const li = document.createElement("li");
      li.textContent = `${b.name}: ₫${Number(b.amount).toLocaleString("vi-VN")}`;
      budgetList.appendChild(li);
    });
  }

  // Hàm hiển thị danh sách giao dịch
  function renderTransactions(list) {
    transactionList.innerHTML = "";
    list.forEach(t => {
      const li = document.createElement("li");
      li.textContent = `${t.date} - ${t.category} - ₫${Number(t.amount).toLocaleString("vi-VN")}`;
      transactionList.appendChild(li);
    });
  }

  // Hàm hiển thị danh sách hóa đơn
  function renderBills(list) {
    billList.innerHTML = "";
    list.forEach(b => {
      const li = document.createElement("li");
      li.classList.add("bill-item");

      const daysLeft = Math.ceil((new Date(b.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
      const maxDays = 30;
      const percent = Math.max(0, Math.min(100, 100 - (daysLeft / maxDays) * 100));

      li.innerHTML = `
        <div>
          <div><strong>${b.name}</strong> - ₫${Number(b.amount).toLocaleString("vi-VN")}</div>
          <div class="bill-progress">
            <div class="bill-progress-inner" style="width: ${percent}%;"></div>
          </div>
          <small>Hạn: ${b.dueDate} (${daysLeft} ngày)</small>
        </div>
      `;
      billList.appendChild(li);
    });
  }

  // Hiển thị dữ liệu mặc định (5 mục mỗi loại)
  function loadAllLists() {
    const budgets = JSON.parse(localStorage.getItem("budgets") || "[]");
    const bills = JSON.parse(localStorage.getItem("bills") || "[]")
      .filter(b => !b.paid)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    renderBudgets(budgets.slice(0, 5));
    renderTransactions(transactions.slice(0, 5));
    renderBills(bills.slice(0, 5));
  }

  // Hàm tìm kiếm trên tất cả dữ liệu: ngân sách, giao dịch, hóa đơn
  function filterAll(searchTerm) {
    const budgets = JSON.parse(localStorage.getItem("budgets") || "[]");
    const bills = JSON.parse(localStorage.getItem("bills") || "[]");

    const regex = new RegExp(searchTerm, "i");

    const filteredBudgets = budgets.filter(b =>
      regex.test(b.name) || regex.test(String(b.amount))
    );

    const filteredTransactions = transactions.filter(t =>
      regex.test(t.date) ||
      regex.test(t.type) ||
      regex.test(t.category) ||
      regex.test(t.account) ||
      (t.note && regex.test(t.note)) ||
      regex.test(String(t.amount))
    );

    const filteredBills = bills.filter(b =>
      regex.test(b.name) ||
      regex.test(b.dueDate) ||
      regex.test(String(b.amount))
    );

    renderBudgets(filteredBudgets.slice(0, 5));
    renderTransactions(filteredTransactions.slice(0, 5));
    renderBills(filteredBills.slice(0, 5));
  }

  // Bật / tắt ô tìm kiếm khi click icon
  searchIcon?.addEventListener("click", () => {
    if (searchInput.style.display === "none" || searchInput.style.display === "") {
      searchInput.style.display = "inline-block";
      searchInput.focus();
    } else {
      searchInput.style.display = "none";
      searchInput.value = "";
      loadAllLists(); // reset về danh sách mặc định khi đóng tìm kiếm
    }
  });

  // Sự kiện nhập từ khóa tìm kiếm
  searchInput?.addEventListener("input", (e) => {
    const searchTerm = e.target.value.trim();
    if (searchTerm.length === 0) {
      loadAllLists();
    } else {
      filterAll(searchTerm);
    }
  });

  // Khởi tạo dữ liệu hiển thị
  loadAllLists();
});
