import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

// List all calculators
export function useCalculators() {
  return useQuery({
    queryKey: [api.calculators.list.path],
    queryFn: async () => {
      const res = await fetch(api.calculators.list.path);
      if (!res.ok) throw new Error("Failed to fetch calculators");
      return api.calculators.list.responses[200].parse(await res.json());
    },
  });
}

// Get a single calculator by slug with FAQs and category
export function useCalculator(slug: string) {
  return useQuery({
    queryKey: [api.calculators.getBySlug.path, slug],
    queryFn: async () => {
      const url = buildUrl(api.calculators.getBySlug.path, { slug });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch calculator");
      return api.calculators.getBySlug.responses[200].parse(await res.json());
    },
    enabled: !!slug,
  });
}

// List all categories with their calculators
export function useCategories() {
  return useQuery({
    queryKey: [api.categories.list.path],
    queryFn: async () => {
      const res = await fetch(api.categories.list.path);
      if (!res.ok) throw new Error("Failed to fetch categories");
      return api.categories.list.responses[200].parse(await res.json());
    },
  });
}
