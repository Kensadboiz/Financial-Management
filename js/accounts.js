document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.page !== 'accounts') return;

  const addBtn = document.getElementById('add-account-btn');
  const modal = document.getElementById('account-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const form = document.getElementById('account-form');
  const modalTitle = document.getElementById('modal-title');
  const tableBody = document.getElementById('accounts-table-body');
  const searchInput = document.getElementById('search-input');

  let accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
  let transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
  let editingIndex = null;

  // Hàm lưu tài khoản vào localStorage
  function saveToLocalStorage() {
    localStorage.setItem('accounts', JSON.stringify(accounts));
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }

  // Hàm định dạng số dư thành tiền
  function formatCurrency(value) {
    return Number(value).toLocaleString('vi-VN') + '₫';
  }

  // Hàm render bảng tài khoản
  function renderTable(filter = '') {
    tableBody.innerHTML = '';

    const filteredAccounts = accounts.filter(acc => 
      acc.name.toLowerCase().includes(filter.toLowerCase())
    );

    if (filteredAccounts.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="4" class="px-6 py-4 text-center text-gray-500">Không có tài khoản phù hợp.</td></tr>`;
      return;
    }

    filteredAccounts.forEach((acc, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">${acc.name}</td>
        <td class="px-6 py-4 whitespace-nowrap text-center text-green-600 font-semibold">${formatCurrency(acc.balance)}</td>
        <td class="px-6 py-4 whitespace-nowrap text-gray-700">${acc.type}</td>
        <td class="px-6 py-4 whitespace-nowrap text-center space-x-2">
          <button class="text-blue-600 hover:underline edit-btn" data-index="${idx}">Sửa</button>
          <button class="text-red-600 hover:underline delete-btn" data-index="${idx}">Xóa</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  // Hàm mở modal (thêm mới hoặc chỉnh sửa)
  function openModal(edit = false, index = null) {
    modal.classList.remove('hidden');
    if (edit && index !== null) {
      modalTitle.textContent = 'Sửa tài khoản';
      const acc = accounts[index];
      form['name'].value = acc.name;
      form['balance'].value = acc.balance;
      form['type'].value = acc.type;
      editingIndex = index;
    } else {
      modalTitle.textContent = 'Thêm tài khoản';
      form.reset();
      editingIndex = null;
    }
  }

  // Hàm đóng modal
  function closeModal() {
    modal.classList.add('hidden');
  }

  // Xử lý sự kiện thêm tài khoản
  addBtn.addEventListener('click', () => openModal());

  // Xử lý sự kiện đóng modal
  closeModalBtn.addEventListener('click', closeModal);

  // Đóng modal nếu click ra ngoài modal
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });

  // Xử lý form khi thêm hoặc sửa tài khoản
  form.addEventListener('submit', e => {
    e.preventDefault();

    const name = form['name'].value.trim();
    const balance = parseFloat(form['balance'].value);
    const type = form['type'].value;

    if (!name || isNaN(balance) || !type) {
      alert('Vui lòng nhập đủ thông tin hợp lệ!');
      return;
    }

    if (editingIndex !== null) {
      // Cập nhật tài khoản
      accounts[editingIndex] = { name, balance, type };
    } else {
      // Thêm mới tài khoản
      accounts.push({ name, balance, type });
    }

    saveToLocalStorage();
    renderTable(searchInput.value);
    closeModal();
  });

  // Xử lý sự kiện nhấn nút "Sửa" hoặc "Xóa" trong bảng tài khoản
  tableBody.addEventListener('click', e => {
    if (e.target.classList.contains('edit-btn')) {
      const idx = e.target.dataset.index;
      openModal(true, idx);
    } else if (e.target.classList.contains('delete-btn')) {
      const idx = e.target.dataset.index;
      if (confirm('Bạn có chắc muốn xóa tài khoản này không?')) {
        accounts.splice(idx, 1);
        saveToLocalStorage();
        renderTable(searchInput.value);
      }
    }
  });

  // Xử lý sự kiện tìm kiếm
  searchInput.addEventListener('input', e => {
    renderTable(e.target.value);
  });

  // Khởi tạo bảng lúc đầu
  renderTable();

  // Hàm cập nhật số dư tài khoản khi có giao dịch
  function updateAccountBalance(accountName, amount) {
    const account = accounts.find(acc => acc.name === accountName);
    if (account) {
      account.balance += amount; // Cập nhật số dư tài khoản
      saveToLocalStorage();
      renderTable(searchInput.value);
    }
  }

  // Xử lý giao dịch - trừ tiền từ tài khoản khi giao dịch chi tiêu
  document.addEventListener('transactionCompleted', (e) => {
    const { accountName, amount, transactionType } = e.detail;

    if (transactionType === 'Chi tiêu') {
      updateAccountBalance(accountName, -amount); // Trừ tiền khi chi tiêu
    } else if (transactionType === 'Thu nhập') {
      updateAccountBalance(accountName, amount); // Thêm tiền khi thu nhập
    }
  });
});
