---
title: Document Service API
description: The new Document Service API in Strapi 5
---

# Document Service API

The Document Service API is the new way to interact with content in Strapi 5, replacing the Entity Service API.

## Overview

The Document Service provides a more powerful and flexible API for content management, with built-in support for:
- Draft & Publish workflows
- Content versioning
- Document-based operations
- Improved performance

## Basic Usage

### Finding Documents

```javascript
// Find many documents
const articles = await strapi.documents('api::article.article').findMany({
  filters: {
    title: {
      $contains: 'Strapi'
    }
  },
  populate: ['author', 'categories'],
  status: 'published', // or 'draft'
  locale: 'en'
});

// Find one document
const article = await strapi.documents('api::article.article').findOne({
  documentId: 'a1b2c3d4e5f6g7h8i9j0klm',
  populate: '*'
});
```

### Creating Documents

```javascript
const newArticle = await strapi.documents('api::article.article').create({
  data: {
    title: 'My New Article',
    content: 'This is the content...',
    author: 'x9y8z7w6v5u4t3s2r1q0plo'
  }
});
```

### Updating Documents

```javascript
const updated = await strapi.documents('api::article.article').update({
  documentId: 'a1b2c3d4e5f6g7h8i9j0klm',
  data: {
    title: 'Updated Title'
  }
});
```

### Publishing and Unpublishing

```javascript
// Publish a document
await strapi.documents('api::article.article').publish({
  documentId: 'a1b2c3d4e5f6g7h8i9j0klm'
});

// Unpublish a document
await strapi.documents('api::article.article').unpublish({
  documentId: 'a1b2c3d4e5f6g7h8i9j0klm'
});

// Discard draft changes
await strapi.documents('api::article.article').discardDraft({
  documentId: 'a1b2c3d4e5f6g7h8i9j0klm'
});
```

### Counting Documents

```javascript
const count = await strapi.documents('api::article.article').count({
  filters: {
    publishedAt: {
      $notNull: true
    }
  }
});
```

## Advanced Features

### Working with Locales

```javascript
// Find documents in a specific locale
const frenchArticles = await strapi.documents('api::article.article').findMany({
  locale: 'fr'
});

// Create localized content
const localizedArticle = await strapi.documents('api::article.article').create({
  data: {
    title: 'Mon Article',
    content: 'Contenu en français...'
  },
  locale: 'fr'
});
```

### Pagination

```javascript
const paginatedResults = await strapi.documents('api::article.article').findMany({
  pagination: {
    page: 2,
    pageSize: 20
  }
});
```

## Migration from Entity Service

If you're migrating from v4's Entity Service:

1. Replace `strapi.entityService` with `strapi.documents(uid)`
2. Update method names (e.g., `findMany` remains the same)
3. Use `documentId` instead of `id`
4. Update status handling for Draft & Publish
