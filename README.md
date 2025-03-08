# Asset Management System

## 📌 Giới thiệu
Đây là hệ thống quản lý tài sản sử dụng **NestJS** và **TypeORM** với **PostgreSQL**.

🔗 **API Documentation:** [⚡ Truy cập ngay Swagger API](https://asset-management-system.eduteck.online/api/v1)  

## 🚀 Cài đặt
### 1️⃣ Clone dự án
```sh
git clone https://github.com/ngongochuyoky/asset_management_system.git
cd asset_management_system
```

### 2️⃣ Cài đặt dependencies
```sh
npm install
```

### 3️⃣ Cấu hình biến môi trường
Tạo file `.env` trong thư mục gốc và điền thông tin database:

```sh
cp env.example .env
```

---

## 🔨 Build & Migrate Database
### 1️⃣ Build dự án
```sh
npm run build
```

### 2️⃣ Chạy migration để tạo bảng trong PostgreSQL
```sh
npm run db:migration:run
```

---

## ▶️ Chạy ứng dụng
### Chạy development mode (hot-reload)
```sh
npm run start:dev
```

### Chạy production mode
```sh
npm run start
```

---

## ✅ Kiểm tra API
Ứng dụng sẽ chạy trên `http://localhost:3000`. Bạn có thể kiểm tra API qua **Postman** hoặc **Swagger** tại:

🚀 **Swagger API:** [👉 Truy cập ngay](http://localhost:3000/api/v1)

---

## 🛠 Lệnh hỗ trợ
### Chạy migration rollback (quay về migration trước)
```sh
npm run db:migration:revert
```

## 💡 Góp ý & Hỗ trợ
Nếu bạn gặp vấn đề, vui lòng tạo issue trên GitHub hoặc liên hệ qua email 📩 `huyngo.05042000@gmail.com`. 🚀

