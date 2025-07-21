---
title: REST API Response Format
description: Understanding the REST API response format in Strapi 5
---

# REST API Response Format

Strapi 5 introduces a simplified API response format that's easier to work with.

## Single Entry Response

### Basic Response
```json
{
  "data": {
    "documentId": "a1b2c3d4e5f6g7h8i9j0klm",
    "title": "Hello World",
    "content": "This is my content",
    "createdAt": "2025-01-21T10:00:00.000Z",
    "updatedAt": "2025-01-21T10:00:00.000Z",
    "publishedAt": "2025-01-21T10:00:00.000Z"
  },
  "meta": {}
}
```

### With Relations
```json
{
  "data": {
    "documentId": "a1b2c3d4e5f6g7h8i9j0klm",
    "title": "Hello World",
    "author": {
      "documentId": "x9y8z7w6v5u4t3s2r1q0plo",
      "name": "John Doe",
      "email": "john@example.com"
    }
  },
  "meta": {}
}
```

## Collection Response

```json
{
  "data": [
    {
      "documentId": "a1b2c3d4e5f6g7h8i9j0klm",
      "title": "First Article"
    },
    {
      "documentId": "b2c3d4e5f6g7h8i9j0klmn",
      "title": "Second Article"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 4,
      "total": 100
    }
  }
}
```

## Key Changes from v4

1. **No nested attributes**: Data fields are directly on the data object
2. **Document IDs**: Using string-based `documentId` instead of numeric `id`
3. **Flattened structure**: Easier to access nested data
4. **Consistent format**: Same structure for all content types

## Backward Compatibility

If you need v4-style responses during migration:

```
GET /api/articles
Headers: strapi.responseFormat: v4
```

This returns responses in the v4 format, giving you time to update your frontend.
