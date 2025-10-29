# Portfolio MongoDB Integration & Wallpaper Setup

## Tasks to Complete

### 1. Update Storage System
- [ ] Remove localStorage fallback from storage.ts
- [ ] Make MongoDB the primary and only storage method
- [ ] Update all data loading/saving to use MongoDB only

### 2. Update Image Handling
- [ ] Modify EditableImage component to only accept URLs
- [ ] Remove file upload functionality
- [ ] Update all image fields to use URL links instead of file uploads

### 3. Integrate Wallpapers
- [ ] Replace AnimatedBackground animations with HTML canvas wallpapers
- [ ] Integrate rain.html for dark mode background
- [ ] Integrate light.html for light mode background
- [ ] Ensure wallpapers adapt to theme changes

### 4. Add Server Validation
- [ ] Add basic validation in server/index.js for portfolio data
- [ ] Ensure data structure matches TypeScript interfaces

### 5. Update Components
- [ ] Update all page components to use MongoDB-only storage
- [ ] Remove localStorage dependencies
- [ ] Test data persistence across all sections

### 6. Testing & Deployment
- [ ] Test MongoDB connection and data operations
- [ ] Verify image URLs work properly
- [ ] Test wallpaper integration in both themes
- [ ] Deploy and verify all functionality
