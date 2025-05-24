// script.js

// Lấy các phần tử trong DOM
const addCategoryBtn = document.getElementById('addCategoryBtn');
const categoryModal = document.getElementById('categoryModal');
const saveCategoryBtn = document.getElementById('saveCategoryBtn');
const cancelCategoryBtn = document.getElementById('cancelCategoryBtn');
const categoryNameInput = document.getElementById('categoryName');
const categoryTypeSelect = document.getElementById('categoryType');
const categoryList = document.getElementById('categoryList');
const searchCategoryInput = document.getElementById('searchCategory');

// Lấy danh mục từ localStorage
function getCategories() {
  const categories = JSON.parse(localStorage.getItem('categories')) || [];
  return categories;
}

// Lưu danh mục vào localStorage
function saveCategories(categories) {
  localStorage.setItem('categories', JSON.stringify(categories));
}

// Render danh mục vào bảng
function renderCategories(categories = []) {
  categoryList.innerHTML = ''; // Clear the table first

  if (categories.length === 0) {
    categoryList.innerHTML = '<tr><td colspan="3" class="text-center">Không có danh mục nào.</td></tr>';
  } else {
    categories.forEach((category, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${category.name}</td>
        <td>${category.type}</td>
        <td>
          <button class="btn-delete" onclick="deleteCategory(${index})">Xóa</button>
        </td>
      `;
      categoryList.appendChild(tr);
    });
  }
}

// Xóa danh mục
function deleteCategory(index) {
  const categories = getCategories();
  categories.splice(index, 1); // Xóa danh mục tại vị trí chỉ định
  saveCategories(categories); // Lưu lại vào localStorage
  renderCategories(categories); // Render lại danh mục
}

// Hiển thị modal khi nhấn nút "Thêm danh mục"
addCategoryBtn.addEventListener('click', () => {
  categoryModal.classList.remove('hidden'); // Hiển thị modal
  categoryNameInput.value = ''; // Làm trống ô nhập tên danh mục
  categoryTypeSelect.value = 'Chi tiêu'; // Chọn mặc định "Chi tiêu"
});

// Hủy thêm danh mục và đóng modal
cancelCategoryBtn.addEventListener('click', () => {
  categoryModal.classList.add('hidden'); // Ẩn modal
});

// Lưu danh mục mới
saveCategoryBtn.addEventListener('click', () => {
  const name = categoryNameInput.value.trim();
  const type = categoryTypeSelect.value;

  if (name) {
    const categories = getCategories();
    categories.push({ name, type }); // Thêm danh mục mới vào danh sách
    saveCategories(categories); // Lưu lại danh mục vào localStorage
    renderCategories(categories); // Render lại danh mục
    categoryModal.classList.add('hidden'); // Ẩn modal
  }
});

// Tìm kiếm danh mục
searchCategoryInput.addEventListener('input', () => {
  const query = searchCategoryInput.value.toLowerCase();
  const categories = getCategories();
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(query) // Tìm kiếm theo tên danh mục
  );

  renderCategories(filteredCategories); // Render lại danh mục theo kết quả tìm kiếm
});

// Render danh mục khi tải trang
document.addEventListener('DOMContentLoaded', () => {
  const categories = getCategories(); // Lấy danh mục từ localStorage
  renderCategories(categories); // Render danh mục ban đầu
});
