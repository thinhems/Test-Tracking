# Hệ thống theo dõi vị trí

Hệ thống cho phép tạo link theo dõi vị trí và chia sẻ với người khác.

## Cài đặt

1. Clone repository:
```bash
git clone <repository-url>
cd location-tracker
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Build ứng dụng:
```bash
npm run build
```

4. Chạy server:
```bash
npm start
```

Hoặc chạy trong chế độ development:
```bash
npm run dev
```

## Cách sử dụng

1. Truy cập http://localhost:3000
2. Click nút "Tạo Link Mới" để tạo link theo dõi
3. Sao chép và chia sẻ link với người cần theo dõi
4. Khi người được chia sẻ mở link, họ sẽ được yêu cầu cho phép chia sẻ vị trí
5. Để xem vị trí, nhập mã truy cập (mặc định: 123456)

## Deploy lên Render.com

1. Tạo tài khoản tại [Render.com](https://render.com)
2. Tạo một Web Service mới
3. Kết nối với repository GitHub của bạn
4. Cấu hình như sau:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment Variables:
     - `PORT`: 3000
     - `BASE_URL`: URL của ứng dụng sau khi deploy (ví dụ: https://your-app.onrender.com)

## Lưu ý

- Hệ thống sử dụng bộ nhớ tạm để lưu trữ vị trí. Trong môi trường production, nên sử dụng database.
- Mã truy cập mặc định là "123456". Trong môi trường production, nên thay đổi mã này và lưu trữ an toàn.
- Ứng dụng sử dụng WebSocket để cập nhật vị trí theo thời gian thực.
- API Key Google Maps trong file track.html nên được giới hạn theo domain và thay đổi trong môi trường production. 