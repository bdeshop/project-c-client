# APK Management Settings Component

A comprehensive interface for managing Android APK files within the admin dashboard.

## Features

### Upload Management

- **File Upload**: Drag and drop or select APK files (max 200MB)
- **Version Control**: Specify app version for each upload
- **Custom Naming**: Set custom filenames for uploaded APKs
- **Descriptions**: Add release notes or descriptions
- **File Validation**: Only .apk files accepted

### APK Management

- **View All APKs**: List all uploaded APK files with details
- **Edit Metadata**: Update version and description
- **Toggle Status**: Activate/deactivate APKs for public download
- **Download Tracking**: Automatic download counter
- **Delete APKs**: Remove unwanted files

### Display Information

- Filename and original name
- Version number
- File size (in MB)
- Download count
- Active/Inactive status
- Upload date
- Description/release notes

## API Integration

Uses the following API endpoints:

- `GET /api/apk` - Fetch all APK files
- `GET /api/apk/latest` - Get latest active APK
- `POST /api/apk/upload` - Upload new APK (admin only)
- `PUT /api/apk/:id` - Update APK metadata (admin only)
- `PATCH /api/apk/:id/toggle` - Toggle active status (admin only)
- `DELETE /api/apk/:id` - Delete APK (admin only)
- `GET /api/apk/download/:id` - Download APK file (public)

## Usage

The component is integrated into the Settings page as a tab:

```tsx
import { APKManagementSettings } from "./components/APKManagementSettings";

// In your settings page
<APKManagementSettings />;
```

## State Management

Uses React Query hooks:

- `useAPKFiles()` - Fetch all APK files
- `useUploadAPK()` - Upload new APK
- `useUpdateAPK()` - Update APK metadata
- `useToggleAPKStatus()` - Toggle active/inactive
- `useDeleteAPK()` - Delete APK file

## Components Used

- Card, CardContent, CardHeader, CardTitle, CardDescription
- Button, Input, Label, Textarea
- Badge for status display
- Icons: Upload, Download, Trash2, Edit, Power, FileText, CheckCircle, XCircle
- Toast notifications for feedback

## File Upload Process

1. User selects .apk file
2. Optionally enters version, description, custom name
3. File is validated (must be .apk, max 200MB)
4. FormData is created with file and metadata
5. Uploaded to server via multipart/form-data
6. Success/error toast notification
7. APK list refreshes automatically

## Edit Mode

- Click "Edit" button on any APK
- Inline form appears with current values
- Update version and/or description
- Save or cancel changes
- List refreshes on successful update

## Status Toggle

- Active APKs are available for public download
- Inactive APKs are hidden from public endpoints
- Toggle button switches between states
- Badge shows current status (green = active, gray = inactive)

## Delete Confirmation

- Confirmation dialog before deletion
- Permanent action - cannot be undone
- File is removed from server storage
- List updates automatically

## Download Functionality

- Download button opens APK in new tab
- Uses API_URL from environment config
- Download count increments automatically
- Works for both active and inactive APKs (admin view)

## Styling

- Dark mode compatible
- Glass-effect cards
- Responsive grid layout
- Color-coded status badges
- Hover effects on buttons
- Loading states for async operations

## Permissions

- **View**: All authenticated users can view the page
- **Upload/Edit/Delete**: Only admin users (enforced by API)

## Error Handling

- File type validation
- File size validation (client-side preview)
- API error messages displayed via toast
- Network error handling
- Loading states during operations

## Future Enhancements

- Drag and drop file upload
- Bulk upload support
- APK version comparison
- Download analytics/charts
- QR code generation for downloads
- Email notifications on new uploads
