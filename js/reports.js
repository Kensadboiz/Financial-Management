document.addEventListener("DOMContentLoaded", () => {
  const reportMonthInput = document.getElementById("reportMonth");
  const today = new Date();
  const currentMonth = today.toISOString().slice(0, 7); // 'YYYY-MM'

  // Thiết lập mặc định là tháng hiện tại
  reportMonthInput.value = currentMonth;

  document.getElementById("generateReportBtn").addEventListener("click", () => {
    const month = reportMonthInput.value || currentMonth;

    const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");

    const filtered = transactions.filter((t) => t.date.startsWith(month));

    let income = 0;
    let expense = 0;

    const tbody = document.getElementById("reportTableBody");
    tbody.innerHTML = "";

    filtered.forEach((t) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${t.date}</td>
        <td>${t.type}</td>
        <td>${t.category}</td>
        <td>${Number(t.amount).toLocaleString("vi-VN")}₫</td>
        <td>${t.description ?? ""}</td>
      `;
      tbody.appendChild(tr);

      const type = t.type.toLowerCase();
      if (type.includes("thu")) income += Number(t.amount);
      else if (type.includes("chi")) expense += Number(t.amount);
    });

    // Nếu không có giao dịch, vẫn hiển thị thông báo "Không có giao dịch"
    if (filtered.length === 0) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td colspan="5" style="text-align:center; padding: 1em;">Không có giao dịch trong tháng này</td>`;
      tbody.appendChild(tr);
    }

    // Hiển thị số tổng
    document.getElementById("totalIncome").textContent = `${income.toLocaleString("vi-VN")}₫`;
    document.getElementById("totalExpense").textContent = `${expense.toLocaleString("vi-VN")}₫`;
    document.getElementById("totalBalance").textContent = `${(income - expense).toLocaleString("vi-VN")}₫`;
    document.getElementById("reportMonthDisplay").textContent = month;

    // Hiển thị các phần liên quan
    document.getElementById("reportSummary").classList.remove("hidden");
    document.getElementById("reportDetails").classList.remove("hidden");
  });
});
