# Contact Settings Management

This module provides a complete interface for managing contact URLs for customer support channels.

## Features

- **24/7 Service URL**: Configure your main support/help center URL
- **WhatsApp**: Direct WhatsApp chat link
- **Telegram**: Telegram user/channel/group link
- **Facebook**: Facebook page or Messenger link
- **URL Testing**: Test each URL before saving with the external link button
- **Real-time Updates**: Changes reflect immediately across the platform
- **Dark Mode Support**: Fully compatible with light/dark themes

## Files

- `ContactSettingsPage.tsx` - Main page component
- `index.ts` - Export file

## API Integration

The page uses the following API endpoints from `/api/contact`:

- `GET /api/contact` - Fetch current contact settings (public)
- `PUT /api/contact` - Update contact settings (admin only)

## Usage

Navigate to `/dashboard/contact` to access the Contact Settings page.

### URL Format Examples

**24/7 Service:**

- `https://example.com/support`
- `https://support.yoursite.com`

**WhatsApp:**

- `https://wa.me/1234567890` (with country code, no + or spaces)
- `https://wa.me/1234567890?text=Hello` (with pre-filled message)

**Telegram:**

- `https://t.me/yourusername` (for user)
- `https://t.me/yourchannel` (for channel)
- `https://t.me/+groupinvitelink` (for group)

**Facebook:**

- `https://facebook.com/yourpage`
- `https://m.me/yourpage` (for Messenger)
- `https://www.facebook.com/messages/t/yourpage` (direct message)

## Components Used

- Card, CardContent, CardHeader, CardTitle, CardDescription
- Button, Input, Label
- Icons: MessageCircle, Send, Facebook, Headphones, ExternalLink, Save
- Toast notifications for success/error feedback

## State Management

Uses React Query for:

- Fetching contact settings: `useContactSettings()`
- Updating settings: `useUpdateContactSettings()`

## Permissions

- **View**: All authenticated users can view the page
- **Edit**: Only admin users can update the settings (enforced by API)
