document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggleFormBtn");
  const formWrapper = document.getElementById("transactionFormOverlay");
  const cancelBtn = document.getElementById("btnCancel");
  const transactionForm = document.getElementById("transactionForm");
  const transactionTableBody = document.getElementById("transactionTableBody");
  const categorySelect = document.getElementById("category");
  const accountSelect = document.getElementById("account");
  const modalTitle = document.getElementById("modalTitle");
  const searchInput = document.getElementById("searchInput");  // Thêm phần tìm kiếm

  let editIndex = -1; // Chỉ số giao dịch đang sửa

  // Hàm tải danh mục từ localStorage
  function loadCategories() {
    const categories = JSON.parse(localStorage.getItem("categories") || "[]");
    categorySelect.innerHTML = `<option value="">Chọn danh mục</option>`;
    categories.forEach(cat => {
      const name = typeof cat === "object" ? cat.name : cat;
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
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

  // Hàm hiển thị giao dịch lên bảng
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

    // Gắn sự kiện cho nút "Sửa"
    document.querySelectorAll(".btn-edit").forEach(button => {
      button.addEventListener("click", (e) => {
        editIndex = parseInt(e.target.getAttribute("data-index"));
        const tx = JSON.parse(localStorage.getItem("transactions"))[editIndex];
        openEditModal(tx);
      });
    });

    // Gắn sự kiện cho nút "Xóa"
    document.querySelectorAll(".btn-delete").forEach(button => {
      button.addEventListener("click", (e) => {
        const index = parseInt(e.target.getAttribute("data-index"));
        if (confirm("Bạn có chắc chắn muốn xóa giao dịch này?")) {
          deleteTransaction(index);
        }
      });
    });
  }

  // Hàm lọc giao dịch theo từ khóa tìm kiếm
  function filterTransactions(searchTerm) {
    const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");

    // Lọc theo ngày, loại giao dịch, danh mục, tài khoản, và ghi chú
    const filteredTransactions = transactions.filter(tx => {
      const searchRegex = new RegExp(searchTerm, "i");  // Tạo một biểu thức chính quy không phân biệt chữ hoa chữ thường
      return searchRegex.test(tx.date) ||
        searchRegex.test(tx.type) ||
        searchRegex.test(tx.category) ||
        searchRegex.test(tx.account) ||
        (tx.note && searchRegex.test(tx.note));  // Kiểm tra trong phần ghi chú
    });

    renderTransactions(filteredTransactions);  // Hiển thị các giao dịch đã lọc
  }

  // Hàm mở modal để sửa giao dịch
  function openEditModal(tx) {
    modalTitle.textContent = "Sửa Giao Dịch"; // Cập nhật tiêu đề modal thành "Sửa"
    document.getElementById("date").value = tx.date;
    document.getElementById("type").value = tx.type;
    document.getElementById("amount").value = tx.amount;
    document.getElementById("category").value = tx.category;
    document.getElementById("account").value = tx.account;
    document.getElementById("note").value = tx.note;

    formWrapper.classList.add("active");
  }

  // Cập nhật số dư tài khoản
  function updateAccountBalance(accountName, amount, type) {
    let accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
    const accountIndex = accounts.findIndex(acc => acc.name === accountName);
    if (accountIndex !== -1) {
      // Cập nhật số dư
      if (type === "Thu nhập") {
        accounts[accountIndex].balance += amount;
      } else if (type === "Chi tiêu") {
        accounts[accountIndex].balance -= amount;
      }
      localStorage.setItem("accounts", JSON.stringify(accounts));
    }
  }

  // Xóa giao dịch
  function deleteTransaction(index) {
    const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
    const tx = transactions[index];
    const accountName = tx.account;
    const amount = tx.amount;
    const type = tx.type;

    // Cập nhật số dư tài khoản
    updateAccountBalance(accountName, amount, type);

    transactions.splice(index, 1); // Xóa giao dịch
    localStorage.setItem("transactions", JSON.stringify(transactions));
    renderTransactions(transactions); // Hiển thị lại bảng giao dịch
  }

  // Lưu giao dịch (thêm mới hoặc sửa)
  transactionForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const date = document.getElementById("date").value;
    const type = document.getElementById("type").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const category = categorySelect.value;
    const accountName = accountSelect.value;
    const note = document.getElementById("note").value;

    if (!date || !type || !amount || !category || !accountName) return;

    let transactions = JSON.parse(localStorage.getItem("transactions") || "[]");

    // Cập nhật số dư tài khoản khi thêm giao dịch mới hoặc sửa
    if (editIndex === -1) {
      // Thêm giao dịch mới
      transactions.push({ date, type, amount, category, account: accountName, note });
      updateAccountBalance(accountName, amount, type);
    } else {
      // Sửa giao dịch hiện tại
      const oldTx = transactions[editIndex];
      const oldAmount = oldTx.amount;
      const oldType = oldTx.type;

      // Cập nhật số dư tài khoản cũ
      updateAccountBalance(oldTx.account, oldAmount, oldType);

      // Thêm giao dịch đã sửa vào mảng
      transactions[editIndex] = { date, type, amount, category, account: accountName, note };

      // Cập nhật số dư tài khoản mới
      updateAccountBalance(accountName, amount, type);
    }

    localStorage.setItem("transactions", JSON.stringify(transactions));
    formWrapper.classList.remove("active"); // Đóng modal
    transactionForm.reset(); // Reset form
    renderTransactions(transactions); // Hiển thị lại bảng giao dịch
    editIndex = -1; // Reset chỉ số sau khi sửa
  });

  // Hiển thị và ẩn modal
  toggleBtn?.addEventListener("click", () => {
    formWrapper.classList.add("active");
    loadCategories();
    loadAccounts();
    modalTitle.textContent = "➕ Giao Dịch Mới"; // Đặt lại tiêu đề modal khi thêm mới
  });

  cancelBtn?.addEventListener("click", () => {
    formWrapper.classList.remove("active");
    editIndex = -1; // Reset chỉ số khi hủy
  });

  formWrapper?.addEventListener("click", (e) => {
    if (e.target === formWrapper) {
      formWrapper.classList.remove("active");
      editIndex = -1; // Reset chỉ số khi click ra ngoài
    }
  });

  // Lắng nghe sự kiện tìm kiếm
  searchInput?.addEventListener("input", (e) => {
    const searchTerm = e.target.value.trim();
    filterTransactions(searchTerm);  // Lọc giao dịch theo từ khóa tìm kiếm
  });

  // On page load
  renderTransactions(JSON.parse(localStorage.getItem("transactions") || "[]"));
  loadCategories();
  loadAccounts();
});
