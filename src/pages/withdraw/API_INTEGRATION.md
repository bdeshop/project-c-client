# Withdrawal Methods - API Integration Documentation

This document describes how the frontend integrates with the Withdrawal Methods API.

## API Endpoints Configuration

All endpoints are configured in `src/lib/queries.ts` and use the base URL from environment variables.

### Base Configuration

```typescript
// From .env file
VITE_API_BASE_URL=http://localhost:8000/api
VITE_API_URL=http://localhost:8000
```

## Implemented Endpoints

### 1. Get All Methods (Public)

**Endpoint:** `GET /api/withdrawal-methods`

**Hook:** `useWithdrawMethods()`

**Usage:**

```typescript
const { data: withdrawMethodsData, isLoading } = useWithdrawMethods();
const withdrawMethods = withdrawMethodsData?.data?.data || [];
```

**Response Structure:**

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "...",
      "method_name_en": "Rocket",
      "method_name_bd": "Rocket",
      "min_withdrawal": 10,
      "max_withdrawal": 400000,
      "withdrawal_fee": 10,
      "fee_type": "fixed",
      "status": "Active",
      "user_inputs": [...],
      ...
    }
  ]
}
```

**Used In:**

- `WithdrawPage.tsx` - Display all methods in table

---

### 2. Get Single Method (Public)

**Endpoint:** `GET /api/withdrawal-methods/:id`

**Hook:** `useWithdrawMethod(id)`

**Usage:**

```typescript
const { data: withdrawMethodData, isLoading } = useWithdrawMethod(id!);
const method = withdrawMethodData?.data?.data;
```

**Used In:**

- `ViewWithdrawMethodPage.tsx` - Display method details
- `EditWithdrawMethodPage.tsx` - Load method data for editing

---

### 3. Create Method (Admin)

**Endpoint:** `POST /api/withdrawal-methods`

**Headers:**

- `Content-Type: multipart/form-data`
- `Authorization: Bearer <admin_token>` (auto-added by axios interceptor)

**Hook:** `useCreateWithdrawMethod()`

**Usage:**

```typescript
const createWithdrawMethod = useCreateWithdrawMethod();

const formData = new FormData();
formData.append("method_name_en", "bKash");
formData.append("min_withdrawal", "100");
formData.append("max_withdrawal", "50000");
formData.append("processing_time", "24 hours");
formData.append("withdrawal_fee", "10");
formData.append("fee_type", "fixed");
formData.append("text_color", "#000000");
formData.append("background_color", "#E2136E");
formData.append("button_color", "#E2136E");
formData.append("status", "Active");
formData.append("user_inputs", JSON.stringify([...]));

if (methodImage) {
  formData.append("method_image", methodImage);
}
if (withdrawalPageImage) {
  formData.append("withdrawal_page_image", withdrawalPageImage);
}

await createWithdrawMethod.mutateAsync(formData);
```

**Used In:**

- `AddWithdrawMethodPage.tsx` - Create new withdraw method

---

### 4. Update Method (Admin)

**Endpoint:** `PUT /api/withdrawal-methods/:id`

**Headers:**

- `Content-Type: multipart/form-data`
- `Authorization: Bearer <admin_token>` (auto-added by axios interceptor)

**Hook:** `useUpdateWithdrawMethod()`

**Usage:**

```typescript
const updateWithdrawMethod = useUpdateWithdrawMethod();

const formData = new FormData();
// Add only fields you want to update (all optional)
formData.append("min_withdrawal", "200");
formData.append("withdrawal_fee", "15");

await updateWithdrawMethod.mutateAsync({
  id: id!,
  data: formData,
});
```

**Used In:**

- `EditWithdrawMethodPage.tsx` - Update existing method

---

### 5. Delete Method (Admin)

**Endpoint:** `DELETE /api/withdrawal-methods/:id`

**Headers:**

- `Authorization: Bearer <admin_token>` (auto-added by axios interceptor)

**Hook:** `useDeleteWithdrawMethod()`

**Usage:**

```typescript
const deleteWithdrawMethod = useDeleteWithdrawMethod();

await deleteWithdrawMethod.mutateAsync(id);
```

**Used In:**

- `WithdrawPage.tsx` - Delete method from table actions

---

### 6. Toggle Status (Admin)

**Endpoint:** `PATCH /api/withdrawal-methods/:id/status`

**Headers:**

- `Authorization: Bearer <admin_token>` (auto-added by axios interceptor)

**Hook:** `useToggleWithdrawMethodStatus()`

**Usage:**

```typescript
const toggleStatus = useToggleWithdrawMethodStatus();

await toggleStatus.mutateAsync(id);
```

**Used In:**

- `WithdrawPage.tsx` - Toggle Active/Inactive status

---

## Form Data Fields

### Required Fields

- `method_name_en` - Method name in English
- `min_withdrawal` - Minimum withdrawal amount (number)
- `max_withdrawal` - Maximum withdrawal amount (number)
- `processing_time` - Processing time (string)
- `withdrawal_fee` - Fee amount (number)
- `fee_type` - "fixed" or "percentage"

### Optional Fields

- `method_name_bd` - Method name in Bangla
- `method_image` - Method image file
- `withdrawal_page_image` - Withdrawal page image file
- `text_color` - Hex color code (default: "#000000")
- `background_color` - Hex color code (default: "#E2136E")
- `button_color` - Hex color code (default: "#E2136E")
- `instruction_en` - English instruction text
- `instruction_bd` - Bangla instruction text
- `status` - "Active" or "Inactive" (default: "Active")
- `user_inputs` - JSON stringified array of user input fields

### User Inputs Format

```json
[
  {
    "name": "account_number",
    "type": "text",
    "label_en": "Account Number",
    "label_bd": "অ্যাকাউন্ট নম্বর",
    "isRequired": true,
    "instruction_en": "Enter 11 digit number",
    "instruction_bd": "১১ সংখ্যার নম্বর লিখুন"
  }
]
```

## Authentication

All admin endpoints (POST, PUT, DELETE, PATCH) require authentication. The authentication token is automatically added to requests by the axios interceptor configured in `src/lib/api.ts`:

```typescript
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Error Handling

All API calls include error handling with user-friendly toast notifications:

```typescript
try {
  await createWithdrawMethod.mutateAsync(formData);
  toast.success("Withdraw method created successfully!");
} catch (error) {
  const errorMessage =
    (error as { response?: { data?: { message?: string } } })?.response?.data
      ?.message || "Failed to create withdraw method";
  toast.error(errorMessage);
}
```

## Cache Management

React Query automatically manages cache and invalidation:

- **Create:** Invalidates `["withdrawMethods"]` cache
- **Update:** Invalidates `["withdrawMethods"]` and `["withdrawMethod", id]` cache
- **Delete:** Invalidates `["withdrawMethods"]` cache
- **Toggle Status:** Invalidates `["withdrawMethods"]` cache

This ensures the UI always shows the latest data after mutations.

## Image Handling

Images are displayed using the `API_URL` from environment variables:

```typescript
import { API_URL } from "../../lib/api";

// Display image
<img src={`${API_URL}/${method.method_image}`} alt={method.method_name_en} />;
```

## Pages Using API

1. **WithdrawPage.tsx**

   - GET all methods
   - DELETE method
   - PATCH toggle status

2. **AddWithdrawMethodPage.tsx**

   - POST create method

3. **ViewWithdrawMethodPage.tsx**

   - GET single method

4. **EditWithdrawMethodPage.tsx**
   - GET single method (load data)
   - PUT update method

## Testing API Integration

To test the API integration:

1. **List Methods:** Navigate to `/dashboard/withdraw`
2. **Create Method:** Click "Add Withdraw Method" button
3. **View Method:** Click "View Details" from actions menu
4. **Edit Method:** Click "Edit" from actions menu
5. **Toggle Status:** Click toggle icon in actions menu
6. **Delete Method:** Click "Delete" from actions menu

All operations will show success/error toast notifications.
