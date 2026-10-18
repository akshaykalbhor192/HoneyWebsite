import { notFound } from "next/navigation";
import { getProduct, products } from "@/data/products";
import ProductDetail from "./ProductDetail";
import ProductCard from "@/components/ProductCard";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const related = products.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      <ProductDetail product={product} />
      <section className="bg-cream px-5 pb-28 pt-10 sm:px-10">
        <div className="mx-auto max-w-[1400px]">
          <h2 className="display mb-10 text-5xl sm:text-6xl">You may also love</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
