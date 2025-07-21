---
title: TypeScript in Strapi 5
description: Enhanced TypeScript support and best practices in Strapi 5
---

# TypeScript in Strapi 5

Strapi 5 brings significant improvements to TypeScript support, making it a first-class citizen in the ecosystem.

## What's New

### Improved Type Definitions

- Complete type coverage for core APIs
- Better IDE autocomplete support
- Stricter type checking
- Generated types for your content types

### Plugin Development

Creating TypeScript plugins is now easier:

```typescript
import { Strapi } from '@strapi/strapi';

export default {
  register({ strapi }: { strapi: Strapi }) {
    // Plugin registration logic with full type support
  },
  
  bootstrap({ strapi }: { strapi: Strapi }) {
    // Bootstrap logic
  }
};
```

### Content Type Definitions

Strapi can now generate TypeScript definitions for your content types:

```bash
npm run strapi ts:generate-types
```

This creates type definitions like:

```typescript
interface Article {
  documentId: string;
  title: string;
  content: string;
  author: Author;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}
```

## Configuration

### tsconfig.json

Recommended TypeScript configuration:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "./src/**/*",
    "./types/**/*"
  ],
  "exclude": [
    "node_modules",
    "build",
    ".cache"
  ]
}
```

## Best Practices

### Type Your Services

```typescript
import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => ({
  async findArticlesByAuthor(authorId: string): Promise<Article[]> {
    return strapi.documents('api::article.article').findMany({
      filters: {
        author: {
          documentId: authorId
        }
      }
    });
  }
});
```

### Type Your Controllers

```typescript
import { Context } from 'koa';

export default {
  async find(ctx: Context) {
    const { query } = ctx.request;
    
    const articles = await strapi
      .service('api::article.article')
      .find(query);
      
    ctx.body = articles;
  }
};
```

### Use Type Guards

```typescript
function isArticle(data: unknown): data is Article {
  return (
    typeof data === 'object' &&
    data !== null &&
    'documentId' in data &&
    'title' in data
  );
}
```

## Common Types

### Request Context

```typescript
import { Context } from 'koa';
import { Strapi } from '@strapi/strapi';

interface StrapiContext extends Context {
  state: {
    user?: User;
    auth?: Auth;
  };
}
```

### Service Types

```typescript
interface ArticleService {
  find(params?: FindParams): Promise<Article[]>;
  findOne(documentId: string): Promise<Article | null>;
  create(data: CreateArticleInput): Promise<Article>;
  update(documentId: string, data: UpdateArticleInput): Promise<Article>;
  delete(documentId: string): Promise<void>;
}
```

## Migration Tips

1. Start by enabling TypeScript in your existing project
2. Gradually convert files from `.js` to `.ts`
3. Use `// @ts-check` in JavaScript files for gradual adoption
4. Generate types for your content types regularly
5. Leverage IDE support for refactoring
