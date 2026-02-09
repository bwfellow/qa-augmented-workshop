import { useEffect, useState } from "react";
import { remult } from "remult";
import { Product } from "../shared/Product";

type SortOption = "name" | "price-asc" | "price-desc";

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState<"all" | "in-stock" | "out-of-stock">("all");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [categories, setCategories] = useState<string[]>([]);

  const productRepo = remult.repo(Product);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const result = await productRepo.find();
    setProducts(result);
    const cats = [...new Set(result.map((p) => p.category).filter(Boolean))];
    cats.sort();
    setCategories(cats);
  }

  const filteredProducts = products
    .filter((p) => {
      if (
        search &&
        !p.name.toLowerCase().includes(search.toLowerCase()) &&
        !p.description.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      if (categoryFilter && p.category !== categoryFilter) return false;
      if (stockFilter === "in-stock" && !p.inStock) return false;
      if (stockFilter === "out-of-stock" && p.inStock) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });

  return (
    <div className="page">
      <div className="page-header">
        <h2>Products</h2>
        <span className="badge">{filteredProducts.length} products</span>
      </div>

      <div className="toolbar">
        <input
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value as "all" | "in-stock" | "out-of-stock")}
          aria-label="Filter by stock status"
        >
          <option value="all">All Stock</option>
          <option value="in-stock">In Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          aria-label="Sort products"
        >
          <option value="name">Sort by Name</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      <div className="product-grid">
        {filteredProducts.length === 0 && (
          <p className="empty-state">No products match your filters.</p>
        )}
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-header">
              <h3>{product.name}</h3>
              <span
                className={`stock-badge ${product.inStock ? "in-stock" : "out-of-stock"}`}
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
            <p className="product-description">{product.description}</p>
            <div className="product-footer">
              <span className="product-price">
                ${product.price.toFixed(2)}
              </span>
              <span className="product-category">{product.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
