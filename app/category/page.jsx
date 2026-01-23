import { Suspense } from "react";
import CategoryClient from "./CategoryClient";

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading category…</div>}>
      <CategoryClient />
    </Suspense>
  );
}
