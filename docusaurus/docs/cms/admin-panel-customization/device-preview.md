# Device Preview Feature

## Overview

The admin panel now includes a device preview feature that allows content creators to preview how their content will appear on different device types.

## Supported Devices

- **Desktop** - Full-width view for desktop computers
- **Tablet** - Medium-width view for tablet devices  
- **Mobile** - Narrow-width view for mobile phones

## Usage

1. Navigate to the content you want to preview in the admin panel
2. Look for the device preview selector in the interface
3. Select between Desktop, Tablet, or Mobile views
4. The content area will adjust to show how it appears on the selected device type

## Implementation Details

### Components Added

- `PreviewDeviceButton` - Button component for device selection
- `PreviewDeviceSelect` - Dropdown selector for device types

### Hooks Added

- `usePreviewDevice` - Hook for managing device preview state

### Assets Added

- Device icons for desktop, mobile, and tablet views

This feature enhances the content editing experience by providing immediate visual feedback on how content will appear across different screen sizes.

## Related Changes

This documentation corresponds to Strapi PR #23997 which introduced the device preview functionality to the admin panel.
