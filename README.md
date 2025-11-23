# Hải Đăng Meta - Backend API

Backend API cho nền tảng Hải Đăng Meta, được xây dựng với Laravel 11.

## 📋 Yêu cầu hệ thống

- PHP >= 8.2
- Composer
- MySQL >= 8.0 hoặc MariaDB >= 10.3
- Node.js & NPM (cho frontend)

## 🚀 Cài đặt nhanh (Local Development)

### 1. Clone repository và vào thư mục backend

```bash
cd backend
```

### 2. Chạy script setup tự động

**Linux/Mac:**
```bash
chmod +x setup-local.sh
./setup-local.sh
```

**Windows (PowerShell):**
```powershell
.\setup-local.ps1
```

**Windows (Git Bash):**
```bash
chmod +x setup-local.sh
./setup-local.sh
```

### 3. Cài đặt thủ công (nếu script không chạy được)

```bash
# Cài đặt dependencies
composer install

# Copy .env file
# Windows: Copy-Item env.example .env
# Linux/Mac: cp env.example .env

# Generate application key
php artisan key:generate

# Cấu hình database trong .env
# DB_DATABASE=haidangmeta
# DB_USERNAME=root
# DB_PASSWORD=your_password

# Chạy migrations
php artisan migrate

# Tạo admin user
php artisan tinker
# Trong tinker:
$user = App\Models\User::create([
    'name' => 'Admin',
    'email' => 'admin@haidangmeta.com',
    'password' => Hash::make('admin123'),
    'email_verified_at' => now(),
]);
$user->assignRole('admin');
exit

# Clear cache
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# Tạo storage link
php artisan storage:link
```

### 4. Khởi động server

```bash
php artisan serve
```

Backend sẽ chạy tại: `http://localhost:8000`

## 🔧 Cấu hình

### Database

Cập nhật file `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=haidangmeta
DB_USERNAME=root
DB_PASSWORD=your_password
```

### OAuth (Google & Facebook)

Cập nhật trong `.env`:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:8000/api/v1/auth/google/callback

# Facebook OAuth
FACEBOOK_CLIENT_ID=820326607281961
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
FACEBOOK_REDIRECT_URI=http://localhost:8000/api/v1/auth/facebook/callback
```

Xem thêm hướng dẫn chi tiết trong `OAUTH_SETUP.md`.

### Frontend URL

```env
FRONTEND_URL=http://localhost:3000
```

### CORS

```env
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
CORS_SUPPORTS_CREDENTIALS=true
```

## 📁 Cấu trúc thư mục

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/V1/        # API Controllers
│   │   ├── Requests/          # Form Requests
│   │   └── Resources/         # API Resources
│   ├── Models/                # Eloquent Models
│   ├── Services/              # Business Logic Services
│   └── ...
├── config/                     # Configuration files
├── database/
│   └── migrations/            # Database migrations
├── routes/
│   └── api.php                # API Routes
└── ...
```

## 🔌 API Endpoints

### Public Endpoints

- `GET /api/v1` - API Info
- `GET /api/v1/products` - Danh sách sản phẩm
- `GET /api/v1/products/filters` - Filter options
- `GET /api/v1/posts` - Danh sách bài viết
- `GET /api/v1/posts/{slug}` - Chi tiết bài viết
- `GET /api/v1/payment-methods` - Phương thức thanh toán
- `GET /api/v1/settings` - Cài đặt
- `GET /api/v1/faq` - FAQ
- `POST /api/v1/tools/check-live-fb` - Kiểm tra Facebook account
- `POST /api/v1/tools/test-facebook-token` - Test Facebook token

### Authentication

- `POST /api/v1/register` - Đăng ký
- `POST /api/v1/login` - Đăng nhập
- `POST /api/v1/logout` - Đăng xuất
- `GET /api/v1/me` - Thông tin user hiện tại
- `PUT /api/v1/me` - Cập nhật profile
- `POST /api/v1/forgot-password` - Quên mật khẩu
- `POST /api/v1/reset-password` - Đặt lại mật khẩu

### OAuth

- `GET /api/v1/auth/google/redirect` - Redirect đến Google OAuth
- `GET /api/v1/auth/google/callback` - Google OAuth callback
- `GET /api/v1/auth/facebook/redirect` - Redirect đến Facebook OAuth
- `GET /api/v1/auth/facebook/callback` - Facebook OAuth callback

### Authenticated User

- `GET /api/v1/orders` - Lịch sử đơn hàng
- `POST /api/v1/orders` - Tạo đơn hàng
- `GET /api/v1/orders/{id}/download` - Tải đơn hàng
- `GET /api/v1/deposits` - Lịch sử nạp tiền

### Admin Endpoints

Tất cả admin endpoints yêu cầu authentication và role `admin`:

- `GET /api/v1/admin/dashboard` - Dashboard
- `GET /api/v1/admin/users` - Quản lý users
- `GET /api/v1/admin/orders` - Quản lý orders
- `GET /api/v1/admin/products` - Quản lý products
- `GET /api/v1/admin/settings` - Cài đặt admin
- Và nhiều endpoints khác...

Xem chi tiết trong `routes/api.php`.

## 🗄️ Database

### Tạo database

```sql
CREATE DATABASE haidangmeta CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Chạy migrations

```bash
php artisan migrate
```

### Chạy migrations mới (OAuth)

```bash
php artisan migrate
# Migration add_oauth_fields_to_users_table sẽ tự động chạy
```

## 👤 Tạo Admin User

### Cách 1: Sử dụng Tinker

```bash
php artisan tinker
```

```php
$user = App\Models\User::create([
    'name' => 'Admin',
    'email' => 'admin@haidangmeta.com',
    'password' => Hash::make('admin123'),
    'email_verified_at' => now(),
]);
$user->assignRole('admin');
```

### Cách 2: Sử dụng SQL script

```bash
mysql -u root -p haidangmeta < database/create-admin-user.sql
```

## 🔐 Default Admin Credentials

- **Email:** admin@haidangmeta.com
- **Password:** admin123

⚠️ **Lưu ý:** Đổi mật khẩu ngay sau lần đăng nhập đầu tiên!

## 🧪 Testing

```bash
# Run tests
php artisan test

# Run specific test
php artisan test --filter AuthTest
```

## 📦 Dependencies chính

- **Laravel Framework** ^11.0
- **Laravel Sanctum** ^4.0 - API Authentication
- **Laravel Socialite** ^5.0 - OAuth Integration
- **Spatie Permission** ^6.0 - Role & Permission Management

## 🛠️ Development Commands

```bash
# Clear all cache
php artisan optimize:clear

# Cache configuration
php artisan config:cache

# Cache routes
php artisan route:cache

# Cache views
php artisan view:cache

# Generate IDE helper
php artisan ide-helper:generate

# Show routes
php artisan route:list
```

## 📝 Logs

Logs được lưu trong `storage/logs/laravel.log`

```bash
# Xem logs real-time
tail -f storage/logs/laravel.log
```

## 🐛 Troubleshooting

### Lỗi CSRF Token

- Đảm bảo đã gọi `/sanctum/csrf-cookie` trước khi gọi API
- Kiểm tra `SESSION_DOMAIN` và `SESSION_SAME_SITE` trong `.env`

### Lỗi CORS

- Kiểm tra `CORS_ALLOWED_ORIGINS` trong `.env`
- Đảm bảo frontend URL được thêm vào danh sách

### Lỗi Database Connection

- Kiểm tra database đã được tạo chưa
- Kiểm tra credentials trong `.env`
- Đảm bảo MySQL service đang chạy

### Lỗi Permission

- Chạy `php artisan optimize:clear`
- Kiểm tra roles và permissions đã được seed chưa

## 📚 Tài liệu thêm

- [Laravel Documentation](https://laravel.com/docs)
- [Laravel Sanctum](https://laravel.com/docs/sanctum)
- [Laravel Socialite](https://laravel.com/docs/socialite)
- [OAuth Setup Guide](./OAUTH_SETUP.md)
- [Setup Guide](./SETUP_GUIDE.md)

## 📄 License

MIT License

## 👥 Contributors

Hải Đăng Meta Team

