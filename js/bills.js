// Biến toàn cục
const totalPaidAmountElement = document.getElementById("totalPaidAmount");
const totalDebtAmountElement = document.getElementById("totalDebtAmount");

document.addEventListener("DOMContentLoaded", () => {
  loadBills();

  document.getElementById("searchInput").addEventListener("input", function () {
    const keyword = this.value.toLowerCase();
    loadBills(keyword);
  });
});

// Mở form thêm hóa đơn
function openForm() {
  document.getElementById("billForm").classList.remove("hidden");
}

// Đóng form thêm hóa đơn
function closeForm() {
  document.getElementById("billForm").classList.add("hidden");
  clearForm();
}

// Xóa dữ liệu trong form
function clearForm() {
  document.getElementById("billName").value = "";
  document.getElementById("billAmount").value = "";
  document.getElementById("billDueDate").value = "";
  document.getElementById("billStatus").value = "Chưa thanh toán";
}

// Thêm hóa đơn mới
function addBill() {
  const name = document.getElementById("billName").value.trim();
  const amount = parseFloat(document.getElementById("billAmount").value);
  const dueDate = document.getElementById("billDueDate").value;
  const status = document.getElementById("billStatus").value;

  if (!name || isNaN(amount) || !dueDate) {
    alert("Vui lòng nhập đầy đủ thông tin!");
    return;
  }

  const bills = JSON.parse(localStorage.getItem("bills")) || [];
  bills.push({ name, amount, dueDate, status });
  localStorage.setItem("bills", JSON.stringify(bills));

  loadBills();
  closeForm();
}

// Tải danh sách hóa đơn
function loadBills(search = "") {
  const tbody = document.getElementById("billsTableBody");
  tbody.innerHTML = "";
  const bills = JSON.parse(localStorage.getItem("bills")) || [];

  bills.forEach((bill, index) => {
    if (bill.name.toLowerCase().includes(search)) {
      const row = document.createElement("tr");
      const statusClass = bill.status === "Đã thanh toán" ? "paid" : "pending";

      row.innerHTML = `
        <td>${bill.name}</td>
        <td>${formatCurrency(bill.amount)}</td>
        <td>${bill.dueDate}</td>
        <td><span class="status ${statusClass}">${bill.status}</span></td>
        <td>
          ${bill.status === "Chưa thanh toán"
            ? `<button class="btn-pay" onclick="openPaymentForm(${index})">Thanh toán</button>`
            : ""}
          <button class="btn-edit" onclick="deleteBill(${index})">Xóa</button>
        </td>
      `;
      tbody.appendChild(row);
    }
  });

  calculateTotals(); // Cập nhật tổng sau khi load
}

function calculateTotals() {
  let totalPaid = 0;      // Tổng tiền đã thanh toán
  let totalDebt = 0;      // Tổng tiền chưa thanh toán (nợ)

  const bills = JSON.parse(localStorage.getItem("bills")) || [];

  bills.forEach(bill => {
    if (bill.status === "Đã thanh toán") {
  totalPaid += Number(bill.amount);
} else {
  totalDebt += Number(bill.amount);
}
  });

  totalPaidAmountElement.textContent = formatCurrency(totalPaid);
  totalDebtAmountElement.textContent = formatCurrency(totalDebt);
}


// Xóa hóa đơn
function deleteBill(index) {
  const bills = JSON.parse(localStorage.getItem("bills")) || [];
  if (confirm("Bạn có chắc muốn xóa hóa đơn này?")) {
    bills.splice(index, 1);
    localStorage.setItem("bills", JSON.stringify(bills));
    loadBills();
  }
}

// Mở form thanh toán
function openPaymentForm(index) {
  const bills = JSON.parse(localStorage.getItem("bills")) || [];
  const bill = bills[index];

  window.currentBill = bill;
  window.currentBillIndex = index;

  loadAccounts();

  document.getElementById("paymentForm").classList.remove("hidden");
}

// Đóng form thanh toán
function closePaymentForm() {
  document.getElementById("paymentForm").classList.add("hidden");
}

// Tải danh sách tài khoản (ví)
function loadAccounts() {
  const accounts = JSON.parse(localStorage.getItem("accounts")) || [];
  const accountSelect = document.getElementById("walletSelect");

  accountSelect.innerHTML = '<option value="">Chọn ví</option>';

  accounts.forEach(account => {
    const option = document.createElement("option");
    option.value = account.name;
    option.textContent = `${account.name} - ${formatCurrency(account.balance)}`;
    accountSelect.appendChild(option);
  });
}

// Xử lý thanh toán hóa đơn
function processPayment() {
  const accounts = JSON.parse(localStorage.getItem("accounts")) || [];
  const selectedAccountName = document.getElementById("walletSelect").value;

  if (!selectedAccountName) {
    alert("Vui lòng chọn ví để thanh toán.");
    return;
  }

  const account = accounts.find(a => a.name === selectedAccountName);

  if (!account) {
    alert("Không tìm thấy ví đã chọn.");
    return;
  }

  if (account.balance >= window.currentBill.amount) {
    account.balance -= window.currentBill.amount;
    localStorage.setItem("accounts", JSON.stringify(accounts));

    const bills = JSON.parse(localStorage.getItem("bills")) || [];
    bills[window.currentBillIndex].status = "Đã thanh toán";
    localStorage.setItem("bills", JSON.stringify(bills));

    closePaymentForm();
    loadBills();
  } else {
    alert("Số dư ví không đủ để thanh toán.");
  }
}

// Hàm định dạng tiền tệ
function formatCurrency(amount) {
  return Number(amount).toLocaleString("vi-VN") + "₫";
}
