let budgets = JSON.parse(localStorage.getItem("budgets")) || [];
let editingIndex = null;
let usingIndex = null; // Chỉ số ngân sách khi dùng

// Đợi DOM load xong mới thực thi
document.addEventListener("DOMContentLoaded", () => {
  renderBudgets();

  // Xử lý tìm kiếm ngân sách
  document.getElementById("searchInput").addEventListener("input", function () {
    renderBudgets(this.value.toLowerCase());
  });

  // Xử lý mở form thêm ngân sách
  document.getElementById("addBudgetBtn").addEventListener("click", function () {
    openForm(); // Mở form thêm ngân sách
  });
});

// Định dạng tiền tệ
function formatCurrency(amount) {
  return Number(amount).toLocaleString("vi-VN") + "₫";
}

// Định dạng ngày tháng
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("vi-VN");
}

// Mở form thêm/sửa ngân sách
function openForm(index = null) {
  const modal = document.getElementById("budgetForm");
  modal.classList.remove("hidden"); // Mở modal

  if (index !== null) {
    // Chỉnh sửa ngân sách
    const budget = budgets[index];
    document.getElementById("budgetName").value = budget.name;
    document.getElementById("budgetAmount").value = budget.amount;
    document.getElementById("startDate").value = budget.start;
    document.getElementById("endDate").value = budget.end;
    editingIndex = index;
  } else {
    // Thêm ngân sách mới
    clearForm();
    editingIndex = null;
  }
}

// Đóng form và ẩn đi
function closeForm() {
  const modal = document.getElementById("budgetForm");
  modal.classList.add("hidden"); // Ẩn modal khi bấm "Hủy"
  clearForm();
}

// Đóng form Dùng ngân sách và ẩn đi
function closeUseForm() {
  const modal = document.getElementById("useBudgetForm");
  modal.classList.add("hidden");
}

// Xóa dữ liệu trong form
function clearForm() {
  document.getElementById("budgetName").value = "";
  document.getElementById("budgetAmount").value = "";
  document.getElementById("startDate").value = "";
  document.getElementById("endDate").value = "";
}

// Lưu ngân sách
function saveBudget() {
  const name = document.getElementById("budgetName").value.trim();
  const amount = parseFloat(document.getElementById("budgetAmount").value);
  const start = document.getElementById("startDate").value;
  const end = document.getElementById("endDate").value;

  // Kiểm tra dữ liệu hợp lệ
  if (!name || isNaN(amount) || !start || !end) {
    alert("Vui lòng điền đầy đủ thông tin!");
    return;
  }

  // Cập nhật ngân sách hoặc thêm ngân sách mới
  if (editingIndex !== null) {
    budgets[editingIndex] = { ...budgets[editingIndex], name, amount, start, end };
  } else {
    budgets.push({ name, amount, start, end, used: 0 });
  }

  // Lưu vào localStorage và cập nhật bảng
  localStorage.setItem("budgets", JSON.stringify(budgets));
  renderBudgets();
  closeForm(); // Đóng form khi lưu
}

// Hiển thị ngân sách
function renderBudgets(search = "") {
  const tbody = document.getElementById("budgetTableBody");
  tbody.innerHTML = "";

  budgets.forEach((budget, index) => {
    if (budget.name.toLowerCase().includes(search)) {
      const remaining = budget.amount - (budget.used || 0);

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${budget.name}</td>
        <td>${formatCurrency(budget.amount)}</td>
        <td>${formatDate(budget.start)} - ${formatDate(budget.end)}</td>
        <td>${formatCurrency(budget.used || 0)}</td>
        <td>${formatCurrency(remaining)}</td>
        <td>
          <button onclick="openUseBudgetForm(${index})">Dùng</button>
          <button onclick="openForm(${index})">Sửa</button>
        </td>
      `;
      tbody.appendChild(row);
    }
  });
}

// Mở form "Dùng ngân sách"
function openUseBudgetForm(index) {
  usingIndex = index;
  const modal = document.getElementById("useBudgetForm");
  modal.classList.remove("hidden"); // Mở form Dùng ngân sách
}

// Lưu số tiền đã chi vào ngân sách
function saveUsedBudget() {
  const usedAmount = parseFloat(document.getElementById("usedAmount").value);

  // Kiểm tra số tiền chi hợp lệ
  if (isNaN(usedAmount) || usedAmount <= 0) {
    alert("Số tiền không hợp lệ.");
    return;
  }

  // Kiểm tra nếu chi vượt quá ngân sách
  if (!budgets[usingIndex].used) budgets[usingIndex].used = 0;
  if (budgets[usingIndex].used + usedAmount > budgets[usingIndex].amount) {
    alert("Chi vượt quá ngân sách!");
    return;
  }

  // Cập nhật số tiền đã chi
  budgets[usingIndex].used += usedAmount;
  localStorage.setItem("budgets", JSON.stringify(budgets));
  renderBudgets();
  closeUseForm(); // Đóng form Dùng ngân sách
}
