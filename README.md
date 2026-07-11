# KidWords

Ứng dụng học từ vựng cho trẻ em. Người dùng **nạp** một danh sách từ vựng theo
ngày, sau đó màn hình **học** tự động chạy qua từng từ (kèm tự động đọc).

Dữ liệu hiện được lưu ở `localStorage`. Khi backend sẵn sàng, chỉ cần đổi phần
thân của service (xem [Chuyển sang API](#chuyển-sang-api)).

## Stack

Kế thừa quy ước từ các dự án MFE khác:

- **React 19** + **Rsbuild**
- **TanStack Router** (file-based routing) + **TanStack Query** (server state)
- **Tailwind CSS 4**
- **react-hook-form** + **zod** (form & validation)
- **sonner** (toast), **lucide-react** (icon), **classnames**
- **Biome** (lint + format), **TypeScript** (strict)

## Lệnh

```bash
pnpm install
pnpm dev          # dev server (port 5000, hoặc REACT_APP_PORT)
pnpm build        # production build
pnpm preview      # xem thử bản build
pnpm check        # biome lint & format
pnpm typecheck    # tsc --noEmit
```

## Cấu trúc

```
src/
  common/
    constants/        # word-bank, form defaults
    enum/             # AppRoute, QueryKey, LocalStorageKey, ApiEndPoints, MENU_ITEMS
  components/         # Sidebar, Loading, Skeleton, NoDataView (PascalCase + index.tsx)
  contexts/           # SidebarProvider (createContext + Provider + useXxx)
  hooks/queries/      # TanStack Query hooks
  layouts/MainLayout/ # header + menu icon + <Outlet/>
  models/             # *.model.ts
  pages/
    Learn/            # "Học từ vựng"  — index (lazy) + content + Hook + Skeleton
    Vocabulary/       # "Nạp từ vựng"  — + Sections (form, history-list)
    404Page/
  routes/             # file-based routes -> routeTree.gen.ts (KHÔNG sửa tay)
  services/           # ServiceBase + *.service.ts (singleton)
  utils/              # storageUtils, utils, plugins/axios
```

Quy ước chính (giống các dự án khác): import qua alias `@/…`; dùng enum thay cho
literal cho route/query-key/storage-key; mỗi service kế thừa `ServiceBase` và
export default singleton; mỗi page theo mẫu `index.tsx (lazy + Suspense +
Skeleton) → *-content.tsx → Hook/*.hook.ts`.

## Tính năng

- **Menu** (icon góc trái) → `Học từ vựng`, `Nạp từ vựng`.
- **Học từ vựng**: chỉ hiển thị từ ở giữa trang (font lớn, không in đậm, không
  hiện nghĩa), tự chạy theo `gapTime`, tự động đọc (Web Speech API), có nút
  play/pause · trước · sau · đọc lại.
- **Nạp từ vựng**: lịch sử nạp nhóm theo ngày, ô tìm kiếm, nút mở form; mỗi mục
  lịch sử có nút **sửa** (chỉnh lại số lượng / danh sách từ) và **xóa**.
  - Form: `Số lượng` (mặc định 10) — tự điền `Danh sách từ` từ kho từ vựng cho
    bé 3 tuổi, có thể **sửa thủ công**; `Gap time` (mặc định 1s); switch
    `Tự động đọc` / `Tự động play`.
- **Loading**: skeleton khi vào trang/tải dữ liệu; overlay chặn thao tác khi đang
  nạp; nút bị disable khi đang xử lý.

## Chuyển sang API

`services/vocabulary/vocabulary.service.ts` đã kế thừa `ServiceBase` và trả về
đúng shape mà API sẽ trả. Khi có backend:

1. Đặt `REACT_APP_API_BASE_URL` trong `.env`.
2. Bỏ interceptor auth vào `utils/plugins/axios.ts` nếu cần.
3. Thay phần đọc/ghi `localStorage` bằng `super.getAsync/postAsync/deleteAsync`
   trỏ tới `ApiEndPoints`. Các query hook và UI không cần đổi.
