/**
 * app.js
 * 
 * Chứa các hàm khởi tạo và xử lý sự kiện chính cho ứng dụng
 */

document.addEventListener('DOMContentLoaded', function() {
  // Khởi tạo dữ liệu từ localStorage
  StorageService.initializeLocalStorage();
  
  // Cập nhật UI với dữ liệu hiện tại
  updateUI();
  
  // Thiết lập các event handlers
  setupEventHandlers();
});

/**
 * Cập nhật giao diện với dữ liệu hiện tại
 */
function updateUI() {
  // Cập nhật ngày hiện tại
  Components.updateDate();
  
  // Lấy dữ liệu từ localStorage
  const accounts = StorageService.getAccounts();
  const categories = StorageService.getCategories();
  const transactions = StorageService.getRecentTransactions();
  const budgets = StorageService.getCurrentBudgets();
  const bills = StorageService.getUpcomingBills();
  
  // Cập nhật tổng quan số dư
  const currentBalance = StorageService.getCurrentBalance();
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const monthlyIncome = StorageService.getMonthlyIncome(currentYear, currentMonth);
  const monthlyExpense = StorageService.getMonthlyExpense(currentYear, currentMonth);
  
  Components.updateBalanceSummary(currentBalance, monthlyIncome, monthlyExpense);
  
  // Hiển thị giao dịch gần đây
  Components.renderRecentTransactions(transactions, categories);
  
  // Hiển thị ngân sách
  Components.renderBudgets(budgets, categories);
  
  // Hiển thị hóa đơn sắp đến hạn
  Components.renderUpcomingBills(bills, categories);
  
  // Điền danh sách danh mục và tài khoản vào form thêm giao dịch
  Components.populateCategorySelect(categories, 'expense');
  Components.populateAccountSelect(accounts);
}

/**
 * Thiết lập các xử lý sự kiện
 */
function setupEventHandlers() {
  setupSearchToggle();
  setupTransactionModal();
  setupTransactionTypeButtons();
  setupTransactionForm();
}

/**
 * Thiết lập nút tìm kiếm
 */
function setupSearchToggle() {
  const searchToggleBtn = document.getElementById('search-toggle');
  const searchContainer = document.getElementById('search-container');
  
  if (searchToggleBtn && searchContainer) {
    searchToggleBtn.addEventListener('click', function() {
      searchContainer.classList.toggle('hidden');
      
      // Focus vào ô tìm kiếm khi hiện
      if (!searchContainer.classList.contains('hidden')) {
        document.getElementById('search-input').focus();
      }
    });
  }
}

/**
 * Thiết lập modal thêm giao dịch
 */
function setupTransactionModal() {
  const addTransactionBtn = document.getElementById('add-transaction');
  const modal = document.getElementById('transaction-modal');
  const closeBtn = document.getElementById('close-modal');
  
  if (addTransactionBtn && modal) {
    addTransactionBtn.addEventListener('click', function() {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Reset form khi mở modal
      resetTransactionForm();
    });
  }
  
  if (closeBtn && modal) {
    closeBtn.addEventListener('click', function() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
    
    // Đóng modal khi click bên ngoài
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
}

/**
 * Thiết lập nút chọn loại giao dịch
 */
function setupTransactionTypeButtons() {
  const typeButtons = document.querySelectorAll('.transaction-type-button');
  
  if (typeButtons.length) {
    typeButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Bỏ active khỏi tất cả các nút
        typeButtons.forEach(btn => btn.classList.remove('active'));
        
        // Thêm active cho nút được click
        this.classList.add('active');
        
        // Cập nhật danh sách danh mục theo loại giao dịch
        const type = this.getAttribute('data-type');
        const categories = StorageService.getCategories();
        Components.populateCategorySelect(categories, type);
      });
    });
  }
}

/**
 * Thiết lập form thêm giao dịch
 */
function setupTransactionForm() {
  const form = document.getElementById('transaction-form');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Lấy loại giao dịch đang được chọn
      const activeTypeButton = document.querySelector('.transaction-type-button.active');
      const type = activeTypeButton ? activeTypeButton.getAttribute('data-type') : 'expense';
      
      // Lấy giá trị từ form
      const amount = document.getElementById('transaction-amount').value;
      const date = document.getElementById('transaction-date').value;
      const categoryId = document.getElementById('transaction-category').value;
      const accountId = document.getElementById('transaction-account').value;
      const description = document.getElementById('transaction-description').value;
      
      // Validate form
      if (!amount || parseFloat(amount) <= 0) {
        Utils.showToast('Lỗi', 'Vui lòng nhập số tiền hợp lệ', 'error');
        return;
      }
      
      if (!date) {
        Utils.showToast('Lỗi', 'Vui lòng chọn ngày', 'error');
        return;
      }
      
      if (!categoryId) {
        Utils.showToast('Lỗi', 'Vui lòng chọn danh mục', 'error');
        return;
      }
      
      if (!accountId) {
        Utils.showToast('Lỗi', 'Vui lòng chọn tài khoản', 'error');
        return;
      }
      
      // Tạo giao dịch mới
      const transaction = {
        amount,
        date: new Date(date).toISOString(),
        category_id: parseInt(categoryId),
        account_id: parseInt(accountId),
        description,
        type
      };
      
      try {
        // Thêm giao dịch và cập nhật UI
        StorageService.createTransaction(transaction);
        updateUI();
        
        // Đóng modal
        document.getElementById('transaction-modal').classList.remove('active');
        document.body.style.overflow = '';
        
        // Hiển thị thông báo thành công
        Utils.showToast('Thành công', 'Đã thêm giao dịch mới', 'success');
      } catch (error) {
        console.error('Lỗi khi thêm giao dịch:', error);
        Utils.showToast('Lỗi', 'Không thể thêm giao dịch', 'error');
      }
    });
  }
}

/**
 * Reset form thêm giao dịch về giá trị mặc định
 */
function resetTransactionForm() {
  // Reset loại giao dịch về "Chi tiêu"
  const typeButtons = document.querySelectorAll('.transaction-type-button');
  typeButtons.forEach(btn => btn.classList.remove('active'));
  const expenseButton = document.querySelector('.transaction-type-button[data-type="expense"]');
  if (expenseButton) {
    expenseButton.classList.add('active');
  }
  
  // Reset các trường input
  document.getElementById('transaction-amount').value = '';
  
  // Đặt ngày mặc định là hôm nay
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  document.getElementById('transaction-date').value = `${yyyy}-${mm}-${dd}`;
  
  document.getElementById('transaction-description').value = '';
  
  // Reset các select box
  const categories = StorageService.getCategories();
  Components.populateCategorySelect(categories, 'expense');
  
  const accounts = StorageService.getAccounts();
  Components.populateAccountSelect(accounts);
}