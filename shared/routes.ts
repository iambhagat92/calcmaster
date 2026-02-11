import { z } from 'zod';
import { insertCalculatorSchema, insertFaqSchema, insertBlogPostSchema, calculators, categories, blogPosts, faqs } from './schema';

export const api = {
  calculators: {
    list: {
      method: 'GET' as const,
      path: '/api/calculators' as const,
      responses: {
        200: z.array(z.custom<typeof calculators.$inferSelect>()),
      },
    },
    getBySlug: {
      method: 'GET' as const,
      path: '/api/calculators/:slug' as const,
      responses: {
        200: z.custom<typeof calculators.$inferSelect & { faqs: typeof faqs.$inferSelect[], category: typeof categories.$inferSelect & { calculators: typeof calculators.$inferSelect[] } }>(),
        404: z.object({ message: z.string() }),
      },
    },
  },
  categories: {
    list: {
      method: 'GET' as const,
      path: '/api/categories' as const,
      responses: {
        200: z.array(z.custom<typeof categories.$inferSelect & { calculators: typeof calculators.$inferSelect[] }>()),
      },
    },
  },
  blog: {
    list: {
      method: 'GET' as const,
      path: '/api/blog' as const,
      responses: {
        200: z.array(z.custom<typeof blogPosts.$inferSelect>()),
      },
    },
    getBySlug: {
      method: 'GET' as const,
      path: '/api/blog/:slug' as const,
      responses: {
        200: z.custom<typeof blogPosts.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
