import {
  categories,
  calculators,
  faqs,
  blogPosts,
  type Category,
  type Calculator,
  type Faq,
  type BlogPost,
  type CalculatorWithFaqs,
  type CategoryWithCalculators,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Categories
  getCategories(): Promise<CategoryWithCalculators[]>;

  // Calculators
  getCalculators(): Promise<(Calculator & { category: Category | null })[]>;
  getCalculatorBySlug(slug: string): Promise<CalculatorWithFaqs | undefined>;

  // Blog
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;

  // Seeding
  createCategory(category: any): Promise<Category>;
  createCalculator(calculator: any): Promise<Calculator>;
  createFaq(faq: any): Promise<Faq>;
  createBlogPost(post: any): Promise<BlogPost>;
}

export class DatabaseStorage implements IStorage {
  async getCategories(): Promise<CategoryWithCalculators[]> {
    return await db.query.categories.findMany({
      with: {
        calculators: true,
      },
    });
  }

  async getCalculators(): Promise<(Calculator & { category: Category | null })[]> {
    return await db.query.calculators.findMany({
      with: {
        category: true,
      },
    });
  }

  async getCalculatorBySlug(slug: string): Promise<CalculatorWithFaqs | undefined> {
    return await db.query.calculators.findFirst({
      where: eq(calculators.slug, slug),
      with: {
        faqs: true,
        category: {
          with: {
            calculators: true,
          },
        },
      },
    });
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(blogPosts.publishedAt);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  // Seed methods
  async createCategory(category: any): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async createCalculator(calculator: any): Promise<Calculator> {
    const [newCalculator] = await db.insert(calculators).values(calculator).returning();
    return newCalculator;
  }

  async createFaq(faq: any): Promise<Faq> {
    const [newFaq] = await db.insert(faqs).values(faq).returning();
    return newFaq;
  }

  async createBlogPost(post: any): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values(post).returning();
    return newPost;
  }
}

export const storage = new DatabaseStorage();
