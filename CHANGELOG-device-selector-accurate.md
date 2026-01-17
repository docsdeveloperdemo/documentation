# Preview Device Selector Documentation Update

## Feature Overview

This update documents the new **device selector** functionality added to Strapi's Preview feature in PR #23985.

## What's New

The Preview interface now includes a device selector that allows users to:

- Switch between Mobile and Desktop viewports
- Test content responsiveness directly in the preview
- Ensure optimal display across different screen sizes

## Implementation Details

Based on the actual code changes in `packages/core/content-manager/admin/src/preview/pages/Preview.tsx`:

- Added device selection dropdown
- Supports Mobile and Desktop views  
- Integrated with existing preview functionality
- Includes proper internationalization support

## Documentation Updates

### Files Modified

1. **`docusaurus/docs/cms/features/preview.md`**
   - Added "Device Selector" section under "Using Preview"
   - Included usage instructions and benefits
   - Explained integration with responsive design testing

2. **`docusaurus/docs/cms/features/content-manager.md`**
   - Added "Preview with Device Selection" section
   - Documented integration between Content Manager and Preview
   - Emphasized responsive content creation workflow

## Accuracy

✅ Based on actual PR #23985 implementation  
✅ Verified against translation strings: `preview.device.select`, `preview.device.desktop`, `preview.device.mobile`  
✅ Reflects real functionality added to Preview.tsx  
✅ Integrated with existing documentation structure  

---
**Related Strapi PR**: [#23985](https://github.com/strapi/strapi/pull/23985) - feat: add preview device selector  
**Author**: remidej  
**Impact**: Content creators, developers using Preview feature
