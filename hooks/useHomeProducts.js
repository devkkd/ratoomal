"use client";
import { useState, useEffect } from "react";

// Singleton cache — fetched once, shared across all homepage components
let cache = null;
let fetchPromise = null;

function mapProduct(p) {
  return {
    id: p._id,
    name: p.name || "Unnamed Product",
    code: p.code || "",
    img: p.thumbnail || p.images?.[0] || "/images/placeholder.png",
  };
}

async function fetchHomeData() {
  if (cache) return cache;
  if (fetchPromise) return fetchPromise;

  // Fetch all 3 categories in parallel using category name search
  fetchPromise = Promise.all([
    fetch("/api/products?limit=5&categoryName=animal").then((r) => r.json()),
    fetch("/api/products?limit=5&categoryName=god").then((r) => r.json()),
    fetch("/api/products?limit=5&categoryName=utility").then((r) => r.json()),
  ])
    .then(([animalData, godData, utilityData]) => {
      // If API doesn't support categoryName param, fall back to fetching all
      const animalOk = animalData.success && animalData.data?.length > 0;
      const godOk = godData.success && godData.data?.length > 0;
      const utilityOk = utilityData.success && utilityData.data?.length > 0;

      if (animalOk || godOk || utilityOk) {
        cache = {
          animal: animalOk ? animalData.data.map(mapProduct) : [],
          god: godOk ? godData.data.map(mapProduct) : [],
          utility: utilityOk ? utilityData.data.map(mapProduct) : [],
        };
        return cache;
      }

      // Fallback: fetch all and filter client-side
      return fetchAllAndFilter();
    })
    .catch(() => fetchAllAndFilter());

  return fetchPromise;
}

async function fetchAllAndFilter() {
  try {
    const res = await fetch("/api/products");
    const data = await res.json();
    if (!data.success) return { animal: [], god: [], utility: [] };

    const products = data.data || [];

    const byKeyword = (keyword) =>
      products
        .filter((p) =>
          (p.category?.name || "").toLowerCase().includes(keyword)
        )
        .slice(0, 5)
        .map(mapProduct);

    cache = {
      animal: byKeyword("animal"),
      god: byKeyword("god"),
      utility: products
        .filter((p) => {
          const name = (p.category?.name || "").toLowerCase();
          return name.includes("utility") || name.includes("decor");
        })
        .slice(0, 5)
        .map(mapProduct),
    };
    return cache;
  } catch {
    return { animal: [], god: [], utility: [] };
  }
}

export function useHomeProducts(category) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData().then((data) => {
      setProducts(data[category] || []);
      setLoading(false);
    });
  }, [category]);

  return { products, loading };
}
