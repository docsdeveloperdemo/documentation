---
title: Breaking Changes - Strapi v4 to v5
description: Complete list of breaking changes when migrating from Strapi v4 to v5
---

# Breaking Changes - Strapi v4 to v5

This document lists all breaking changes when migrating from Strapi v4 to v5.

## API Response Format

### Before (v4)
```json
{
  "data": {
    "id": 1,
    "attributes": {
      "title": "My Article",
      "content": "..."
    }
  }
}
```

### After (v5)
```json
{
  "data": {
    "documentId": "a1b2c3d4e5f6g7h8i9j0klm",
    "title": "My Article",
    "content": "..."
  }
}
```

## Entity Service → Document Service

The Entity Service API has been replaced with the Document Service API:

### Before (v4)
```javascript
strapi.entityService.findMany('api::article.article', {
  filters: { title: 'Hello' },
  populate: ['author']
});
```

### After (v5)
```javascript
strapi.documents('api::article.article').findMany({
  filters: { title: 'Hello' },
  populate: ['author']
});
```

## Draft & Publish Changes

- Content now has separate draft and published versions
- New API endpoints for publishing/unpublishing
- Different UI with tabs for draft/published content

## Plugin Compatibility

Many v4 plugins need updates for v5:
- Check plugin documentation for v5 support
- Some plugins may have breaking API changes
- Community plugins may need time to update

## Node.js Requirements

- Minimum Node.js version: 18.x
- Recommended: Node.js 20.x
- Node.js 16.x is no longer supported

## Database Changes

- New document-based structure
- Migration scripts required for existing data
- Backup your database before migrating

## Configuration Changes

Some configuration options have changed:
- Review your `config/` files
- Update environment variables
- Check plugin configurations
