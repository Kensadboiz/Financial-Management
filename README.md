# Ứng Dụng Quản Lý Tài Sản - Phiên Bản HTML/CSS/JavaScript

## Giới Thiệu
Đây là phiên bản thuần HTML, CSS và JavaScript của ứng dụng Quản Lý Tài Sản. Phiên bản này giữ nguyên toàn bộ chức năng và thiết kế của ứng dụng gốc, nhưng sử dụng các công nghệ web cơ bản thay vì React và các thư viện hiện đại.

## Tính Năng Chính
- Theo dõi chi tiêu, thu nhập, khoản vay và khoản nợ
- Quản lý nhiều loại tài khoản (tiền mặt, ngân hàng, ví điện tử)
- Thiết lập và theo dõi ngân sách
- Quản lý hóa đơn và nhắc nhở thanh toán
- Báo cáo tài chính chi tiết với biểu đồ trực quan
- Chế độ tối (Dark Mode)
- Giao diện tối ưu cho điện thoại di động
- Sao lưu và khôi phục dữ liệu

## Cấu Trúc Thư Mục
```
html_version/
├── css/
│   ├── styles.css           # Tệp CSS chính
│   ├── accounts.css 
│   ├── bills.css 
│   ├── budgets.css 
│   ├── categories.css 
│   ├── reports.css 
│   ├── settings.css 
│   └── transactions.css 
├── js/
│   ├── app.js           
│   ├── accounts.js
│   ├── bills.js
│   ├── budgets.js
│   ├── categories.js
│   ├── reports.js
│   ├── settings.js
│   └── transactions.js
├── pages/                   # Các trang của ứng dụng
│   ├── accounts.html
│   ├── bills.html
│   ├── budgets.html
│   ├── categories.html
│   ├── reports.html
│   ├── settings.html
│   └── transactions.html
├── images/                  # Thư mục chứa hình ảnh
└── index.html               # Trang chính
```

## Hướng Dẫn Cài Đặt và Sử Dụng

### Phương Pháp 1: Sử Dụng Trực Tiếp
1. Giải nén file ZIP vào thư mục bất kỳ trên máy tính
2. Mở file `index.html` bằng trình duyệt web (Chrome, Firefox, Edge, etc.)

### Phương Pháp 2: Sử Dụng Máy Chủ Web Cục Bộ
1. Giải nén file ZIP vào thư mục bất kỳ
2. Cài đặt Node.js (nếu chưa có)
3. Trong thư mục chứa file `index.html`, mở terminal và chạy lệnh:
   ```
   npx serve
   ```
4. Mở trình duyệt và truy cập địa chỉ được hiển thị trên terminal (thường là http://localhost:5000)

### Phương Pháp 3: Triển Khai Trên GitHub Pages
1. Tạo repository trên GitHub
2. Đẩy toàn bộ thư mục lên repository
3. Vào Settings > Pages > Source, chọn branch main và thư mục root, sau đó Save
4. Trang web sẽ được triển khai tại URL dạng https://username.github.io/repository-name/

## Lưu Ý Khi Sử Dụng
- Ứng dụng sử dụng localStorage để lưu trữ dữ liệu, nên dữ liệu sẽ được giữ lại giữa các lần truy cập nhưng chỉ trong cùng một trình duyệt
- Nếu xóa dữ liệu trình duyệt, dữ liệu của ứng dụng cũng sẽ bị xóa
- Trang web chạy hoàn toàn ở phía client, không cần kết nối internet sau khi tải lần đầu
- Nên sử dụng tính năng sao lưu dữ liệu trong mục Cài Đặt thường xuyên

## Các Thư Viện Sử Dụng
- **Font Awesome** (6.4.0): Cung cấp các biểu tượng
- **Chart.js**: Vẽ biểu đồ báo cáo tài chính

## Tương Thích
- Chrome 80+
- Firefox 76+
- Safari 13.1+
- Edge 80+
- Opera 67+
- Chrome for Android 80+
- Safari on iOS 13.4+

## Khác Biệt So Với Phiên Bản Gốc
So với phiên bản React/Node.js, phiên bản HTML thuần này có một số khác biệt:
- Sử dụng localStorage thay vì cơ sở dữ liệu PostgreSQL để lưu trữ dữ liệu
- Xử lý phía client thay vì có API server riêng
- Tải và kết xuất trang trọn vẹn thay vì sử dụng Single Page Application (SPA)
- Không phụ thuộc vào các thư viện UI hiện đại như Shadcn UI

## Hỗ Trợ
Nếu bạn gặp vấn đề khi sử dụng ứng dụng, vui lòng tạo issue trên repository GitHub hoặc liên hệ qua email.

---

Cảm ơn bạn đã sử dụng Ứng Dụng Quản Lý Tài Sản!