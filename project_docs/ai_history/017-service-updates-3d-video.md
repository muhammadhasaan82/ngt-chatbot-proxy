# Service Updates: 3D Graphics & Video Editing

## Changes Overview

Removed three services and replaced them with two new creative services as requested.

### Removed Services
1. **Google Ads (PPC)** - `/services/google-ads`
2. **Outdoor Media Advertising** - `/services/outdoor-media`
3. **Blockchain Development** - `/services/blockchain`

### Added Services
1. **3D Graphics Designing** - `/services/3d-graphics`
   - **Route**: `/services/3d-graphics`
   - **Component**: `ThreeDGraphicsPage`
   - **Description**: Professional 3D modeling, rendering, and animation services.
   
2. **Video Editing** - `/services/video-editing`
   - **Route**: `/services/video-editing`
   - **Component**: `VideoEditingPage`
   - **Description**: Professional video editing for commercial and social media content.

## Technical Implementation

### 1. New Service Pages
Created two new page components with full content (features, benefits, process, pricing, FAQs):
- `src/pages/services/ThreeDGraphicsPage.tsx`
- `src/pages/services/VideoEditingPage.tsx`

### 2. Router Configuration
Updated `src/utils/routes.ts`:
- Removed routes for Google Ads, Outdoor Media, and Blockchain.
- Added routes for 3D Graphics and Video Editing.

### 3. Component Updates
- **`src/pages/Services.tsx`**: Updated the services grid to show the new services with appropriate icons and descriptions.
- **`src/components/Header.tsx`**: Updated the navigation dropdown menu.

### 4. Language & Translations
Updated `src/contexts/LanguageContext.tsx`:
- Removed translations for old services.
- Added translations for new services across all major languages (English, Urdu, etc.).

### 5. Chatbot Scraper
Updated `Chatbot/scraper.py`:
- Updated the list of known routes to ensure the chatbot scrapes the new service pages and stops looking for the deleted ones.

## Verification
- Verified all service routes are working.
- Verified navigation menu links.
- Verified translations are in place.
