# Withdraw Management System

Complete withdrawal method management system for the admin dashboard.

## Features

### Withdraw Method Management

- **View All Methods**: Grid display of all withdrawal methods
- **Search**: Filter methods by name (English/Bangla)
- **Add Method**: Create new withdrawal methods
- **Edit Method**: Update existing method details
- **Delete Method**: Remove withdrawal methods
- **Toggle Status**: Activate/deactivate methods
- **View Details**: See complete method information

### Method Information

- Method name (English & Bangla)
- Method image
- Payment page image
- Minimum withdraw amount
- Maximum withdraw amount
- Processing time
- Withdraw charge (percentage or fixed)
- Status (Active/Inactive)
- User input fields configuration
- Gateway configuration

## Files

- `WithdrawPage.tsx` - Main withdraw methods listing page
- `README.md` - This documentation file

## API Integration

Uses the following API endpoints from `/api/withdraw-methods`:

- `GET /api/withdraw-methods` - Fetch all withdraw methods
- `GET /api/withdraw-methods/:id` - Fetch single method
- `POST /api/withdraw-methods` - Create new method
- `PUT /api/withdraw-methods/:id` - Update method
- `DELETE /api/withdraw-methods/:id` - Delete method
- `PATCH /api/withdraw-methods/:id/toggle-status` - Toggle active status

## Usage

Navigate to `/dashboard/withdraw` to access the Withdraw Methods page.

## State Management

Uses React Query hooks:

- `useWithdrawMethods()` - Fetch all methods
- `useWithdrawMethod(id)` - Fetch single method
- `useCreateWithdrawMethod()` - Create new method
- `useUpdateWithdrawMethod()` - Update method
- `useDeleteWithdrawMethod()` - Delete method
- `useToggleWithdrawMethodStatus()` - Toggle status

## Components Used

- Card, CardContent, CardHeader, CardTitle
- Button, Input, Badge
- Icons: TrendingUp, Plus, Search, Edit, Trash2, Eye, ToggleLeft, ToggleRight
- Toast notifications for feedback

## Withdraw Method Structure

```typescript
interface WithdrawMethod {
  _id: string;
  method_name_en: string;
  method_name_bd: string;
  method_image: string;
  payment_page_image: string;
  min_withdraw: number;
  max_withdraw: number;
  processing_time: string;
  withdraw_charge: number;
  withdraw_charge_type: "percentage" | "fixed";
  status: "Active" | "Inactive";
  user_inputs: UserInput[];
  gateways: string[];
  createdAt: string;
  updatedAt: string;
}
```

## Features in Detail

### Grid Display

- Responsive grid layout (1/2/3 columns)
- Method image thumbnail
- Status badge (green for active, gray for inactive)
- Min/max withdraw amounts
- Processing time
- Withdraw charge display
- Gateway badges

### Search Functionality

- Real-time search
- Searches both English and Bangla names
- Case-insensitive

### Status Toggle

- Quick toggle button
- Visual feedback (green/gray icons)
- Instant update with toast notification

### Delete Confirmation

- Confirmation dialog before deletion
- Shows method name in confirmation
- Success/error toast notifications

### Empty State

- Friendly message when no methods exist
- Search-specific empty state
- Call-to-action button to add first method

## Styling

- Dark mode compatible
- Glass-effect cards
- Gradient primary buttons
- Hover effects
- Responsive design
- Color-coded status badges

## Permissions

- **View**: All authenticated users
- **Add/Edit/Delete**: Admin users only (enforced by API)

## Future Enhancements

- Bulk operations
- Export/import methods
- Method analytics
- Withdraw request management
- Processing time tracking
- Charge calculator
- Method usage statistics
