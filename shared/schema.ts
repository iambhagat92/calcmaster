import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// === CATEGORIES ===
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
});

// === CALCULATORS ===
export const calculators = pgTable("calculators", {
  id: serial("id").primaryKey(),
  categoryId: serial("category_id").references(() => categories.id),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(), // Short description for cards
  content: text("content").notNull(), // Long form content (Rich Text)
  metaTitle: text("meta_title").notNull(),
  metaDescription: text("meta_description").notNull(),
  schemaMarkup: jsonb("schema_markup"), // For SEO Structured Data
  createdAt: timestamp("created_at").defaultNow(),
});

// === FAQS ===
export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  calculatorId: serial("calculator_id").references(() => calculators.id),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
});

// === BLOG POSTS ===
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  publishedAt: timestamp("published_at").defaultNow(),
});

// === RELATIONS ===
export const categoriesRelations = relations(categories, ({ many }) => ({
  calculators: many(calculators),
}));

export const calculatorsRelations = relations(calculators, ({ one, many }) => ({
  category: one(categories, {
    fields: [calculators.categoryId],
    references: [categories.id],
  }),
  faqs: many(faqs),
}));

export const faqsRelations = relations(faqs, ({ one }) => ({
  calculator: one(calculators, {
    fields: [faqs.calculatorId],
    references: [calculators.id],
  }),
}));

// === INFER TYPES ===
export const insertCategorySchema = createInsertSchema(categories);
export const insertCalculatorSchema = createInsertSchema(calculators);
export const insertFaqSchema = createInsertSchema(faqs);
export const insertBlogPostSchema = createInsertSchema(blogPosts);

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Calculator = typeof calculators.$inferSelect;
export type InsertCalculator = z.infer<typeof insertCalculatorSchema>;

export type Faq = typeof faqs.$inferSelect;
export type InsertFaq = z.infer<typeof insertFaqSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

// === API RESPONSE TYPES ===
export type CalculatorWithFaqs = Calculator & { faqs: Faq[]; category?: Category };
export type CategoryWithCalculators = Category & { calculators: Calculator[] };
