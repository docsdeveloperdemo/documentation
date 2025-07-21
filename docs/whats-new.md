---
title: What's New in Strapi 5
description: Discover the latest features and improvements in Strapi 5
---

# What's New in Strapi 5

Strapi 5 brings many new features and improvements. This page highlights the most important changes.

## 🚀 Major Features

### Draft & Publish System Rework
The Draft & Publish feature has been completely redesigned. The Content Manager now shows two separate tabs:
- **Draft tab**: For working on unpublished changes
- **Published tab**: Shows the currently published version

Both versions can contain different content, allowing for more flexible content workflows.

### Content History
The new Content History feature allows you to:
- View previous versions of your content
- Compare changes between versions
- Restore content to a previous state
- Track who made changes and when

*Note: This is a premium feature available with Enterprise licenses.*

### Preview Feature
Preview your content directly in your frontend application from Strapi's admin panel:
- Real-time preview of draft content
- Multiple device preview modes
- Seamless integration with your frontend

### Document Service API
Strapi 5 introduces the Document Service API, replacing the Entity Service API:
- Better support for the new Draft & Publish system
- New methods: `publish()`, `unpublish()`, `discardDraft()`
- Built-in `count()` method for document counting
- Uses string-based document IDs instead of numeric IDs

### Simplified API Response Format
API responses are now cleaner and easier to work with:
- No more nested `attributes` object
- Flattened data structure
- Reduced response size
- Better developer experience

### Enhanced TypeScript Support
- Improved type definitions throughout the codebase
- Better IDE support and autocomplete
- Reduced runtime errors
- First-class TypeScript support in plugins

### Releases Feature
Bundle multiple content changes and publish them together:
- Group related content updates
- Schedule releases for specific times
- Better content coordination across teams

## 🔧 Technical Improvements

- **Vite as the bundler**: Faster build times and better development experience
- **Performance optimizations**: Improved query performance and reduced memory usage
- **Better plugin SDK**: Easier plugin development with the new SDK
- **AI-powered documentation**: New chatbot for instant help

## 📚 Migration Resources

For detailed migration guides and breaking changes, see:
- [Migration Guide](/migration/v4-to-v5)
- [Breaking Changes](/migration/v4-to-v5/breaking-changes)
- [API Changes](/api/rest/api-response-format)
