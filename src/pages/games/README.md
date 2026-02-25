# Games Configuration Dashboard

A comprehensive games management system for the khela88 dashboard with a user-friendly interface.

## Features

### 1. **Game Categories Management**

- Create, read, update, and delete game categories
- Support for both English and Bangla names
- Category icons and images
- Display type selection (providers or games)
- Subcategory management

### 2. **Providers Management**

- Create, read, update, and delete game providers
- Upload and manage provider logos
- Active/inactive status toggle
- View games associated with each provider

### 3. **Games Management**

- Full CRUD operations for games
- Game UUID management
- Bilingual support (English & Bangla)
- Game image uploads
- Game flags:
  - Mark as Hot Game
  - Mark as New Game
  - Show in Lobby
- Search functionality
- Category and provider assignment

### 4. **Popular Games Management**

- Create featured games for homepage display
- Drag-and-drop ordering (via order field)
- Active/inactive status
- Redirect URL configuration
- Image uploads for game thumbnails

## File Structure

```
src/pages/games/
├── GamesConfigPage.tsx          # Main container with tabs
├── GameCategoriesPage.tsx       # Category management
├── ProvidersPage.tsx            # Provider management
├── GamesListPage.tsx            # Games management
├── PopularGamesPage.tsx         # Popular games management
├── index.ts                     # Exports
└── README.md                    # This file
```

## API Integration

All components connect to the backend API endpoints:

- `GET/POST /api/game-categories` - Category operations
- `GET/POST /api/providers` - Provider operations
- `GET/POST /api/games` - Game operations
- `GET/POST /api/popular-games` - Popular games operations

## UI/UX Features

### Design Elements

- **Gradient backgrounds** - Purple and blue gradient theme
- **Smooth animations** - Fade-in and slide-down effects
- **Responsive layout** - Works on desktop, tablet, and mobile
- **Dark theme** - Eye-friendly dark mode interface
- **Interactive cards** - Hover effects and transitions

### User-Friendly Features

- **Tabbed interface** - Easy navigation between sections
- **Modal dialogs** - Clean form submissions
- **Search functionality** - Quick game lookup
- **Image previews** - See uploads before saving
- **Status indicators** - Visual flags for game types
- **Loading states** - Spinner feedback during operations
- **Toast notifications** - Success/error messages
- **Bulk operations** - Support for multiple items

### Form Validation

- Required field validation
- File type checking
- Duplicate prevention
- Real-time feedback

## Usage

### Adding a Game Category

1. Click "Add Category" button
2. Fill in English and Bangla names
3. Add category icon URL
4. Select display type (providers or games)
5. Click "Save Category"

### Adding a Provider

1. Click "Add Provider" button
2. Enter provider name
3. Upload provider logo
4. Click "Save Provider"

### Adding a Game

1. Click "Add Game" button
2. Enter game UUID (unique identifier)
3. Fill in English and Bangla names
4. Select category
5. Upload game image
6. Set game flags (Hot, New, Lobby)
7. Click "Save Game"

### Adding a Popular Game

1. Click "Add Popular Game" button
2. Enter title
3. Add redirect URL
4. Set display order
5. Upload game image
6. Click "Save Popular Game"

## Dependencies

- React 18.3+
- React Query (TanStack Query) 5.83+
- Axios 1.12+
- React Hook Form 7.61+
- Tailwind CSS 3.4+
- Lucide React 0.462+
- Sonner (Toast notifications)

## Environment Variables

Ensure your `.env` file includes:

```
VITE_API_URL=http://localhost:5000/api
```

## Styling

All components use:

- Tailwind CSS for styling
- Custom gradient backgrounds
- Responsive grid layouts
- Smooth transitions and animations
- Dark theme color scheme

## Error Handling

- Network error messages
- Validation error feedback
- Duplicate prevention alerts
- User-friendly error toasts

## Future Enhancements

- Bulk import/export functionality
- Advanced filtering options
- Game analytics dashboard
- Provider performance metrics
- Batch operations
- Undo/redo functionality
