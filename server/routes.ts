import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // === API ROUTES ===
  app.get(api.categories.list.path, async (req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  app.get(api.calculators.list.path, async (req, res) => {
    const calculators = await storage.getCalculators();
    res.json(calculators);
  });

  app.get(api.calculators.getBySlug.path, async (req, res) => {
    const calculator = await storage.getCalculatorBySlug(req.params.slug);
    if (!calculator) {
      return res.status(404).json({ message: "Calculator not found" });
    }
    res.json(calculator);
  });

  app.get(api.blog.list.path, async (req, res) => {
    const posts = await storage.getBlogPosts();
    res.json(posts);
  });

  app.get(api.blog.getBySlug.path, async (req, res) => {
    const post = await storage.getBlogPostBySlug(req.params.slug);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  });

  // === SEO: SITEMAP ===
  app.get("/sitemap.xml", async (req, res) => {
    const calculators = await storage.getCalculators();
    const posts = await storage.getBlogPosts();
    const baseUrl = `https://${req.get("host")}`;

    const urls = [
      `${baseUrl}/`,
      `${baseUrl}/blog`,
      ...calculators.map((c) => `${baseUrl}/${c.category?.slug || 'calculators'}/${c.slug}`),
      ...posts.map((p) => `${baseUrl}/blog/${p.slug}`),
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
        .map(
          (url) => `
  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
        )
        .join("")}
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(sitemap);
  });

  // === SEO: ROBOTS.TXT ===
  app.get("/robots.txt", (req, res) => {
    res.type("text/plain");
    res.send(`User-agent: *
 Allow: /
 Sitemap: https://${req.get("host")}/sitemap.xml`);
  });

  // === SEED DATA ON STARTUP ===
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingCategories = await storage.getCategories();
  if (existingCategories.length > 0) return;

  console.log("Seeding database...");

  // 1. Categories
  const finance = await storage.createCategory({ name: "Financial", slug: "financial", description: "Money matters." });
  const health = await storage.createCategory({ name: "Health & Fitness", slug: "health", description: "Body metrics." });
  const math = await storage.createCategory({ name: "Math & Science", slug: "math", description: "Useful math tools." });
  const construction = await storage.createCategory({ name: "Construction", slug: "construction", description: "Builder tools." });
  const conversion = await storage.createCategory({ name: "Conversion", slug: "conversion", description: "Unit converters." });
  const education = await storage.createCategory({ name: "Education", slug: "education", description: "Student tools." });
  const time = await storage.createCategory({ name: "Time & Date", slug: "time-date", description: "Time management." });
  const tech = await storage.createCategory({ name: "Technology", slug: "tech", description: "Digital tools." });
  const common = await storage.createCategory({ name: "General", slug: "general", description: "Common daily calculators." });

  // 2. Calculators
  // Investment
  await storage.createCalculator({
    categoryId: finance.id,
    name: "Investment Calculator",
    slug: "investment-calculator",
    description: "Calculate the future value of your investments.",
    metaTitle: "Investment Calculator - Future Value & Compound Interest",
    metaDescription: "Plan your financial future with our investment calculator. See how compound interest grows your savings over time.",
    content: `
      <h2>How to Use the Investment Calculator</h2>
      <p>Enter your starting amount, monthly contribution, annual interest rate, and the number of years you plan to invest.</p>
      <h3>The Power of Compounding</h3>
      <p>This calculator shows how even small monthly contributions can grow into a significant nest egg over time thanks to compound interest.</p>
    `,
    schemaMarkup: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Investment Calculator",
      "applicationCategory": "FinanceApplication"
    }
  });

  // Age
  await storage.createCalculator({
    categoryId: common.id,
    name: "Age Calculator",
    slug: "age-calculator",
    description: "Calculate your exact age in years, months, and days.",
    metaTitle: "Age Calculator - How Old Are You Exactly?",
    metaDescription: "Calculate your exact age in years, months, days, hours, and minutes based on your birth date.",
    content: "<h2>Age Calculator</h2><p>Ever wondered exactly how many days old you are? This tool gives you a precise breakdown of your age.</p>",
    schemaMarkup: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Age Calculator",
      "applicationCategory": "UtilityApplication"
    }
  });

  // Scientific
  await storage.createCalculator({
    categoryId: common.id,
    name: "Scientific Calculator",
    slug: "scientific-calculator",
    description: "Full-featured scientific calculator for advanced math.",
    metaTitle: "Free Online Scientific Calculator - Advanced Functions",
    metaDescription: "A free online scientific calculator with trigonometric, logarithmic, and exponential functions.",
    content: "<h2>Scientific Calculator</h2><p>Perform advanced calculations including sin, cos, tan, log, and more directly in your browser.</p>",
    schemaMarkup: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Scientific Calculator",
      "applicationCategory": "EducationalApplication"
    }
  });

  // Tip
  await storage.createCalculator({
    categoryId: common.id,
    name: "Tip Calculator",
    slug: "tip-calculator",
    description: "Quickly calculate tips and split bills with friends.",
    metaTitle: "Tip Calculator - Split Bills & Calculate Gratuity",
    metaDescription: "Easily calculate the tip and split the bill among any number of people. Perfect for dining out.",
    content: "<h2>Tip Calculator</h2><p>Enter the bill amount, tip percentage, and number of people to see the total and individual shares.</p>",
    schemaMarkup: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Tip Calculator",
      "applicationCategory": "UtilityApplication"
    }
  });

  // Mortgage
  const mortgage = await storage.createCalculator({
    categoryId: finance.id,
    name: "Mortgage Calculator",
    slug: "mortgage-calculator",
    description: "Calculate your monthly mortgage payments.",
    metaTitle: "Free Mortgage Calculator - Estimate Monthly Payments",
    metaDescription: "Use our free mortgage calculator to estimate your monthly house payments, including principal and interest.",
    content: `
      <h2>How to Use This Mortgage Calculator</h2>
      <p>Enter the home price, your down payment, the loan term, and the interest rate to see your estimated monthly payment.</p>
      <h3>Understanding the Results</h3>
      <p>Your monthly payment includes principal and interest. Property taxes and insurance are not included in this simple calculation.</p>
    `,
    schemaMarkup: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Mortgage Calculator",
      "applicationCategory": "FinanceApplication"
    }
  });

  await storage.createFaq({ calculatorId: mortgage.id, question: "What is a good interest rate?", answer: "Interest rates vary by economy and credit score." });
  await storage.createFaq({ calculatorId: mortgage.id, question: "How much down payment do I need?", answer: "Typically 20% to avoid PMI, but many loans allow 3-5%." });

  // BMI
  const bmi = await storage.createCalculator({
    categoryId: health.id,
    name: "BMI Calculator",
    slug: "bmi-calculator",
    description: "Calculate your Body Mass Index (BMI).",
    metaTitle: "BMI Calculator - Check Your Body Mass Index",
    metaDescription: "Calculate your Body Mass Index (BMI) based on height and weight. Understand your weight category.",
    content: `
      <h2>About BMI</h2>
      <p>Body Mass Index (BMI) is a simple index of weight-for-height that is commonly used to classify underweight, overweight, and obesity in adults.</p>
      <h3>BMI Categories</h3>
      <ul>
        <li>Underweight: &lt; 18.5</li>
        <li>Normal weight: 18.5 – 24.9</li>
        <li>Overweight: 25 – 29.9</li>
        <li>Obesity: &ge; 30</li>
      </ul>
    `,
    schemaMarkup: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "BMI Calculator",
      "applicationCategory": "HealthApplication"
    }
  });

  // Loan
  await storage.createCalculator({
    categoryId: finance.id,
    name: "Loan Calculator",
    slug: "loan-calculator",
    description: "Calculate monthly payments for any loan.",
    metaTitle: "Loan Calculator - Personal & Auto Loans",
    metaDescription: "Simple loan calculator for personal loans, auto loans, and more.",
    content: "<h2>Loan Calculator</h2><p>Calculate the monthly payment and total interest for any fixed-term loan.</p>",
    schemaMarkup: {}
  });

  // Auto Loan
  await storage.createCalculator({
    categoryId: finance.id,
    name: "Auto Loan Calculator",
    slug: "auto-loan-calculator",
    description: "Calculate your monthly car payments.",
    metaTitle: "Auto Loan Calculator - Estimate Monthly Car Payments",
    metaDescription: "Calculate your monthly auto loan payments, including interest and trade-in value.",
    content: "<h2>Auto Loan Calculator</h2><p>Find out how much your new car will cost you each month.</p>",
    schemaMarkup: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Auto Loan Calculator",
      "applicationCategory": "FinanceApplication"
    }
  });

  // Compound Interest
  await storage.createCalculator({
    categoryId: finance.id,
    name: "Compound Interest Calculator",
    slug: "compound-interest-calculator",
    description: "See how your money grows with compound interest.",
    metaTitle: "Compound Interest Calculator - Growth Over Time",
    metaDescription: "Calculate the future value of your investments with compound interest.",
    content: "<h2>Compound Interest Calculator</h2><p>Visualize the power of compound interest over time.</p>",
    schemaMarkup: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Compound Interest Calculator",
      "applicationCategory": "FinanceApplication"
    }
  });

  // Retirement
  await storage.createCalculator({
    categoryId: finance.id,
    name: "Retirement Calculator",
    slug: "retirement-calculator",
    description: "Plan your retirement savings and goals.",
    metaTitle: "Retirement Calculator - 401k & IRA Planning",
    metaDescription: "Calculate how much you need to save for retirement based on your current age, savings, and goals.",
    content: "<h2>Retirement Calculator</h2><p>Planning for retirement is one of the most important financial steps you can take. Use this tool to see if you are on track.</p>",
    schemaMarkup: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Retirement Calculator",
      "applicationCategory": "FinanceApplication"
    }
  });

  // Calorie
  await storage.createCalculator({
    categoryId: health.id,
    name: "Calorie Calculator",
    slug: "calorie-calculator",
    description: "Estimate your daily calorie needs.",
    metaTitle: "Calorie Calculator - Daily Calorie Needs",
    metaDescription: "Calculate how many calories you need to maintain, lose, or gain weight.",
    content: "<h2>Calorie Calculator</h2><p>Use the Mifflin-St Jeor equation to estimate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE).</p>",
    schemaMarkup: {}
  });

  // Body Fat
  await storage.createCalculator({
    categoryId: health.id,
    name: "Body Fat Calculator",
    slug: "body-fat-calculator",
    description: "Estimate your body fat percentage.",
    metaTitle: "Body Fat Calculator - US Navy Method",
    metaDescription: "Calculate your body fat percentage using the US Navy method based on your measurements.",
    content: "<h2>Body Fat Calculator</h2><p>Track your fitness progress by keeping an eye on your body fat percentage.</p>",
    schemaMarkup: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Body Fat Calculator",
      "applicationCategory": "HealthApplication"
    }
  });

  // Pregnancy
  await storage.createCalculator({
    categoryId: health.id,
    name: "Pregnancy Calculator",
    slug: "pregnancy-calculator",
    description: "Calculate your due date based on LMP.",
    metaTitle: "Pregnancy Due Date Calculator",
    metaDescription: "Estimate your baby's due date and significant pregnancy milestones.",
    content: "<h2>Pregnancy Due Date Calculator</h2><p>Find out when your baby is due and key dates for your pregnancy journey.</p>",
    schemaMarkup: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Pregnancy Calculator",
      "applicationCategory": "HealthApplication"
    }
  });



  // Scientific
  await storage.createCalculator({
    categoryId: math.id,
    name: "Scientific Calculator",
    slug: "scientific-calculator",
    description: "Advanced calculator with scientific functions.",
    metaTitle: "Scientific Calculator - Online Math Tool",
    metaDescription: "Perform advanced calculations including trigonometry, logarithms, and more.",
    content: "<h2>Scientific Calculator</h2><p>A powerful tool for complex mathematical operations.</p>",
    schemaMarkup: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Scientific Calculator",
      "applicationCategory": "MathApplication"
    }
  });

  // Statistics
  await storage.createCalculator({
    categoryId: math.id,
    name: "Statistics Calculator",
    slug: "statistics-calculator",
    description: "Calculate mean, median, mode, and more.",
    metaTitle: "Statistics Calculator - Mean, Median, Mode",
    metaDescription: "Analyze your dataset with our comprehensive statistics calculator.",
    content: "<h2>Statistics Calculator</h2><p>Enter your data set to calculate common statistical properties.</p>",
    schemaMarkup: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Statistics Calculator",
      "applicationCategory": "MathApplication"
    }
  });

  // Percentage
  await storage.createCalculator({
    categoryId: math.id,
    name: "Percentage Calculator",
    slug: "percentage-calculator",
    description: "Solve common percentage problems.",
    metaTitle: "Percentage Calculator - 3-in-1 Tool",
    metaDescription: "Easily calculate percentages, percentage changes, and more.",
    content: "<h2>Percentage Calculator</h2><p>Reference tool for all your percentage calculation needs.</p>",
    schemaMarkup: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Percentage Calculator",
      "applicationCategory": "MathApplication"
    }
  });



  // Concrete
  await storage.createCalculator({
    categoryId: construction.id,
    name: "Concrete Calculator",
    slug: "concrete-calculator",
    description: "Estimate bags of concrete needed.",
    metaTitle: "Concrete Calculator - Slabs & Footings",
    metaDescription: "Calculate concrete volume and bags needed for your project.",
    content: "<h2>Concrete Calculator</h2><p>Plan your pour with accurate volume and bag estimates.</p>",
    schemaMarkup: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Concrete Calculator",
      "applicationCategory": "ConstructionApplication"
    }
  });

  // Paint
  await storage.createCalculator({
    categoryId: construction.id,
    name: "Paint Calculator",
    slug: "paint-calculator",
    description: "Estimate paint gallons for walls.",
    metaTitle: "Paint Calculator - Room Coverage",
    metaDescription: "Find out how much paint you need for your room dimensions.",
    content: "<h2>Paint Calculator</h2><p>Don't buy too much or too little paint. Calculate coverage here.</p>",
    schemaMarkup: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Paint Calculator",
      "applicationCategory": "ConstructionApplication"
    }
  });

  // Unit Converter
  await storage.createCalculator({
    categoryId: conversion.id,
    name: "Unit Converter",
    slug: "unit-converter",
    description: "Convert length, weight, volume, and temp.",
    metaTitle: "Universal Unit Converter",
    metaDescription: "Convert between metric and imperial units easily.",
    content: "<h2>Unit Converter</h2><p>A simple tool for all your conversion needs.</p>",
    schemaMarkup: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Unit Converter",
      "applicationCategory": "UtilityApplication"
    }
  });



  // Grade
  await storage.createCalculator({
    categoryId: education.id,
    name: "Grade Calculator",
    slug: "grade-calculator",
    description: "Calculate what you need on your final exam.",
    metaTitle: "Grade Calculator - Final Exam Score",
    metaDescription: "Determine the score you need on your final exam to achieve your target grade.",
    content: "<h2>Grade Calculator</h2><p>Stay on top of your studies. find out exactly what score you need.</p>",
    schemaMarkup: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Grade Calculator",
      "applicationCategory": "EducationalApplication"
    }
  });

  // GPA
  await storage.createCalculator({
    categoryId: education.id,
    name: "GPA Calculator",
    slug: "gpa-calculator",
    description: "Calculate your semester GPA.",
    metaTitle: "GPA Calculator - College & High School",
    metaDescription: "Easy to use GPA calculator for high school and college students.",
    content: "<h2>GPA Calculator</h2><p>Track your academic performance semester by semester.</p>",
    schemaMarkup: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "GPA Calculator",
      "applicationCategory": "EducationalApplication"
    }
  });

  // Age
  await storage.createCalculator({
    categoryId: time.id,
    name: "Age Calculator",
    slug: "age-calculator",
    description: "Calculate age in years, months, days.",
    metaTitle: "Age Calculator - Date of Birth",
    metaDescription: "Calculate your exact age in years, months, and days based on your date of birth.",
    content: "<h2>Age Calculator</h2><p>Find out exactly how old you are down to the day.</p>",
    schemaMarkup: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Age Calculator",
      "applicationCategory": "UtilityApplication"
    }
  });

  // Date
  await storage.createCalculator({
    categoryId: time.id,
    name: "Date Calculator",
    slug: "date-calculator",
    description: "Days between dates or add to date.",
    metaTitle: "Date Calculator - Days Between Dates",
    metaDescription: "Calculate the duration between two dates or add days to a specific date.",
    content: "<h2>Date Calculator</h2><p>Planning an event? Calculate days remaining or past dates easily.</p>",
    schemaMarkup: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Date Calculator",
      "applicationCategory": "UtilityApplication"
    }
  });

  // Bandwidth
  await storage.createCalculator({
    categoryId: tech.id,
    name: "Bandwidth Calculator",
    slug: "bandwidth-calculator",
    description: "Estimate file download time.",
    metaTitle: "Bandwidth Calculator - Download Speed",
    metaDescription: "Calculate how long it will take to download a file based on your internet speed.",
    content: "<h2>Bandwidth Calculator</h2><p>Estimate download times for files of any size.</p>",
    schemaMarkup: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Bandwidth Calculator",
      "applicationCategory": "UtilityApplication"
    }
  });

  // File Size
  await storage.createCalculator({
    categoryId: tech.id,
    name: "File Size Calculator",
    slug: "file-size-calculator",
    description: "Convert between KB, MB, GB, TB.",
    metaTitle: "File Size Converter - Bytes to GB",
    metaDescription: "Convert computer data storage units easily.",
    content: "<h2>File Size Converter</h2><p>Quickly convert between different digital storage units.</p>",
    schemaMarkup: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "File Size Converter",
      "applicationCategory": "UtilityApplication"
    }
  });

  // 3. Blog Posts
  await storage.createBlogPost({
    title: "The Ultimate Guide to Mastering Your Personal Finances in 2024",
    slug: "personal-finance-mastery-2024",
    excerpt: "Learn how to manage your debt, save for a home, and invest wisely using our suite of financial tools.",
    content: `
      <p>Managing personal finances is more critical than ever in today's fluctuating economy. Whether you're planning for a home or looking to grow your wealth, having the right tools is half the battle won.</p>
      
      <h3>Planning for Your Dream Home</h3>
      <p>For most people, a home is the largest purchase they will ever make. Understanding the long-term impact of interest rates and down payments is essential. Our <a href="/calculators/mortgage-calculator">Mortgage Calculator</a> allows you to visualize your monthly commitments and plan your budget accordingly. By experimenting with different scenarios, you can find the perfect balance between your dream home and financial stability.</p>

      <h3>Managing Debt Effectively</h3>
      <p>Whether it's a student loan or a car purchase, debt is a tool that needs careful handling. Before taking on new liabilities, use our <a href="/calculators/loan-calculator">Loan Calculator</a> to see exactly how much interest you'll be paying over the life of the loan. Knowing the total cost of borrowing empowers you to make smarter decisions and potentially save thousands of dollars.</p>

      <h3>The Secret to Wealth: Compound Interest</h3>
      <p>The earlier you start, the more time your money has to grow. Our <a href="/calculators/investment-calculator">Investment Calculator</a> demonstrates the incredible power of compound interest. Even modest monthly contributions can turn into a significant nest egg over 20 or 30 years. It's not just about how much you save, but how consistently you do it.</p>

      <h3>Summary</h3>
      <p>Financial freedom isn't about how much money you make, but how well you manage what you have. By using our integrated financial suite, you're taking the first step towards a more secure future.</p>
    `,
    metaTitle: "Financial Planning Guide 2024 - Mortgage, Loans & Investments",
    metaDescription: "A comprehensive guide on using financial calculators to plan your home purchase, manage debt, and grow your investments."
  });

  await storage.createBlogPost({
    title: "Holistic Health: Balancing BMI, Calories, and Lifestyle",
    slug: "holistic-health-guide",
    excerpt: "Understand how your body metrics like BMI and caloric needs work together for a healthier you.",
    content: `
      <p>Achieving your fitness goals requires more than just willpower; it requires data. Understanding your body's specific needs is the foundation of any successful health journey.</p>

      <h3>Decoding Your Body Mass Index</h3>
      <p>Your weight relative to your height is a key indicator of potential health risks. Using a <a href="/calculators/bmi-calculator">BMI Calculator</a> is a great starting point to see where you stand on the health spectrum. While it doesn't measure body fat percentage directly, it provides a universally accepted baseline for most adults.</p>

      <h3>Energy Balance: The Science of Weight Management</h3>
      <p>Weight loss or gain is ultimately a matter of calories in versus calories out. But how many calories does your body actually need? Our <a href="/calculators/calorie-calculator">Calorie Calculator</a> takes the guesswork out of the equation by estimating your Basal Metabolic Rate (BMR) and accounting for your activity level. This data is crucial for creating a sustainable meal plan that works for your unique physiology.</p>

      <h3>Practical Tips for Everyday Health</h3>
      <p>Small changes lead to big results. From taking the stairs to splitting a heavy restaurant bill (use our <a href="/calculators/tip-calculator">Tip Calculator</a> for that!), mindfulness in daily activities adds up. Don't forget to track your progress and stay consistent with your routine.</p>

      <h3>Conclusion</h3>
      <p>Health is a marathon, not a sprint. By understanding your metrics and caloric requirements, you are equipping yourself with the knowledge needed to thrive.</p>
    `,
    metaTitle: "Holistic Health & Fitness Guide - BMI and Calorie Tracking",
    metaDescription: "Learn how to use BMI and calorie calculators to create a personalized health plan and achieve your fitness goals."
  });

  await storage.createBlogPost({
    title: "The Mathematical Side of Daily Life: From Ages to Expenses",
    slug: "math-in-daily-life",
    excerpt: "How simple math tools can simplify your daily routines and decision-making.",
    content: `
      <p>We use math every day, often without realizing it. From calculating a fair tip to knowing exactly how many days old we are, math tools make our lives more organized.</p>

      <h3>The Precision of Time</h3>
      <p>Knowing your age in years is standard, but have you ever wanted to know your age in exact days? Our <a href="/calculators/age-calculator">Age Calculator</a> provides a fun and precise way to look at the passage of time. It's a great tool for milestones and celebrations.</p>

      <h3>Dining Out Without the Stress</h3>
      <p>There's nothing more awkward than trying to do mental math at the end of a great meal. Our <a href="/calculators/tip-calculator">Tip Calculator</a> simplifies splitting the bill and ensures everyone pays their fair share, including a proper gratuity for your server. It's efficiency at your fingertips.</p>

      <h3>Advanced Calculations Made Easy</h3>
      <p>For students and professionals, basic math isn't always enough. When you need trigonometric or logarithmic functions, our <a href="/calculators/scientific-calculator">Scientific Calculator</a> is ready in your browser. No need to carry a separate device when you have a full-featured tool online.</p>

      <h3>Closing Thoughts</h3>
      <p>Math shouldn't be a source of stress. With the right online tools, you can handle any calculation with confidence and speed.</p>
    `,
    metaTitle: "Daily Math Tools - Age, Tips, and Scientific Calculations",
    metaDescription: "Explore how utility calculators can simplify your daily life, from dining out to advanced math problems."
  });

  await storage.createBlogPost({
    title: "Understanding Mortgage Rates in 2024",
    slug: "mortgage-rates-2024",
    excerpt: "Everything you need to know about current mortgage trends.",
    content: "<p>Mortgage rates fluctuate based on economic factors...</p>",
    metaTitle: "Mortgage Rates 2024 Guide",
    metaDescription: "A comprehensive guide to understanding mortgage rates in 2024."
  });

  console.log("Seeding complete.");
}
