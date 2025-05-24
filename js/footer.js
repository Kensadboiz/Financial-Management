document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggleFormBtn");
  const formWrapper = document.getElementById("transactionFormOverlay");
  const cancelBtn = document.getElementById("btnCancel");
  const transactionForm = document.getElementById("transactionForm");
  const transactionTableBody = document.getElementById("transactionTableBody");
  const categorySelect = document.getElementById("category");
  const accountSelect = document.getElementById("account");
  const modalTitle = document.getElementById("modalTitle");
  const searchInput = document.getElementById("searchInput");
  const typeSelect = document.getElementById("type"); // Thêm dòng này

  let editIndex = -1;

  // Hàm lọc và tải danh mục theo loại giao dịch
  function filterCategoriesByType(type) {
    const categories = JSON.parse(localStorage.getItem("categories") || "[]");
    categorySelect.innerHTML = `<option value="">Chọn danh mục</option>`;
    categories
      .filter(cat => typeof cat === "object" && cat.type === type)
      .forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.name;
        option.textContent = cat.name;
        categorySelect.appendChild(option);
      });
  }

  // Hàm tải tài khoản từ localStorage
  function loadAccounts() {
    const accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
    accountSelect.innerHTML = `<option value="">Chọn tài khoản</option>`;
    accounts.forEach(acc => {
      const option = document.createElement("option");
      option.value = acc.name;
      option.textContent = `${acc.name} - ${Number(acc.balance).toLocaleString("vi-VN")}₫`;
      accountSelect.appendChild(option);
    });
  }

  // Hiển thị giao dịch lên bảng
  function renderTransactions(transactions) {
    transactionTableBody.innerHTML = "";
    transactions.forEach((tx, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="p-2">${tx.date}</td>
        <td class="p-2">${tx.type}</td>
        <td class="p-2">${tx.category}</td>
        <td class="p-2 text-right">${Number(tx.amount).toLocaleString("vi-VN")}₫</td>
        <td class="p-2">${tx.account}</td>
        <td class="p-2">${tx.note || ""}</td>
        <td class="p-2 text-center">
          <button class="btn-edit" data-index="${index}">Sửa</button>
          <button class="btn-delete" data-index="${index}">Xóa</button>
        </td>
      `;
      transactionTableBody.appendChild(row);
    });

    document.querySelectorAll(".btn-edit").forEach(button => {
      button.addEventListener("click", (e) => {
        editIndex = parseInt(e.target.getAttribute("data-index"));
        const tx = JSON.parse(localStorage.getItem("transactions"))[editIndex];
        openEditModal(tx);
      });
    });

    document.querySelectorAll(".btn-delete").forEach(button => {
      button.addEventListener("click", (e) => {
        const index = parseInt(e.target.getAttribute("data-index"));
        if (confirm("Bạn có chắc chắn muốn xóa giao dịch này?")) {
          deleteTransaction(index);
        }
      });
    });
  }

  // Lọc giao dịch theo từ khóa
  function filterTransactions(searchTerm) {
    const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
    const filtered = transactions.filter(tx => {
      const regex = new RegExp(searchTerm, "i");
      return regex.test(tx.date) ||
        regex.test(tx.type) ||
        regex.test(tx.category) ||
        regex.test(tx.account) ||
        (tx.note && regex.test(tx.note));
    });
    renderTransactions(filtered);
  }

  // Mở modal sửa giao dịch
  function openEditModal(tx) {
    modalTitle.textContent = "Sửa Giao Dịch";
    document.getElementById("date").value = tx.date;
    typeSelect.value = tx.type;
    filterCategoriesByType(tx.type); // Cập nhật danh mục theo loại
    document.getElementById("amount").value = tx.amount;
    categorySelect.value = tx.category;
    accountSelect.value = tx.account;
    document.getElementById("note").value = tx.note;
    formWrapper.classList.add("active");
  }

  // Cập nhật số dư tài khoản
  function updateAccountBalance(accountName, amount, type) {
    let accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
    const index = accounts.findIndex(acc => acc.name === accountName);
    if (index !== -1) {
      if (type === "Thu nhập") {
        accounts[index].balance += amount;
      } else if (type === "Chi tiêu") {
        accounts[index].balance -= amount;
      }
      localStorage.setItem("accounts", JSON.stringify(accounts));
    }
  }

  // Xóa giao dịch
  function deleteTransaction(index) {
    const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
    const tx = transactions[index];
    updateAccountBalance(tx.account, tx.amount, tx.type);
    transactions.splice(index, 1);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    renderTransactions(transactions);
  }

  // Lưu giao dịch
  transactionForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const date = document.getElementById("date").value;
    const type = typeSelect.value;
    const amount = parseFloat(document.getElementById("amount").value);
    const category = categorySelect.value;
    const accountName = accountSelect.value;
    const note = document.getElementById("note").value;

    if (!date || !type || !amount || !category || !accountName) return;

    let transactions = JSON.parse(localStorage.getItem("transactions") || "[]");

    if (editIndex === -1) {
      transactions.push({ date, type, amount, category, account: accountName, note });
      updateAccountBalance(accountName, amount, type);
    } else {
      const oldTx = transactions[editIndex];
      updateAccountBalance(oldTx.account, oldTx.amount, oldTx.type);
      transactions[editIndex] = { date, type, amount, category, account: accountName, note };
      updateAccountBalance(accountName, amount, type);
    }

    localStorage.setItem("transactions", JSON.stringify(transactions));
    formWrapper.classList.remove("active");
    transactionForm.reset();
    renderTransactions(transactions);
    editIndex = -1;
  });

  // Hiển thị modal thêm mới
  toggleBtn?.addEventListener("click", () => {
    formWrapper.classList.add("active");
    typeSelect.value = "";
    categorySelect.innerHTML = `<option value="">Chọn danh mục</option>`;
    loadAccounts();
    modalTitle.textContent = "➕ Giao Dịch Mới";
  });

  // Đóng modal khi hủy
  cancelBtn?.addEventListener("click", () => {
    formWrapper.classList.remove("active");
    editIndex = -1;
  });

  formWrapper?.addEventListener("click", (e) => {
    if (e.target === formWrapper) {
      formWrapper.classList.remove("active");
      editIndex = -1;
    }
  });

  // Lọc danh mục khi loại giao dịch thay đổi
  typeSelect?.addEventListener("change", () => {
    const selectedType = typeSelect.value;
    filterCategoriesByType(selectedType);
  });

  // Tìm kiếm giao dịch
  searchInput?.addEventListener("input", (e) => {
    const searchTerm = e.target.value.trim();
    filterTransactions(searchTerm);
  });

  // On page load
  renderTransactions(JSON.parse(localStorage.getItem("transactions") || "[]"));
  loadAccounts();
});
