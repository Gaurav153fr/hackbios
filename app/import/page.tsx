"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, TrendingUp } from "lucide-react";
import { getAllProducts } from "@/lib/Product";
import { Condition, Preference } from "../generated/prisma";

export type Product = {
  id: number;
  name: string;
  userId: string;
  price: number;
  description: string;
  inStock: boolean;
  total_quantity: number;
  min_order_quantity: number;
  hsn_code: string;
  condition: Condition;
  category: string;
  preference: Preference;
  preferred_countries: string[];
  createdAt: Date;
  updatedAt: Date;

  user: {
    id: string;
    fullName: string;
    workEmail: string;
    country: string;
    image?: string | null;
  };
};

export default function Import() {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceSort, setPriceSort] = useState<"asc" | "desc" | null>(null);
  const [selectedCountry, setSelectedCountry] = useState("All Countries");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [showPriceComparison, setShowPriceComparison] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const response = await getAllProducts();
        if (response.success) {
          setProducts(response.data as Product[]);
        } else {
          setError("Unable to fetch products");
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        setError(e.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  /** ---------------- FILTERED PRODUCT LIST ------------------ */
  const filteredProducts = useMemo(() => {
    let data = [...products];

    // Search filter (name or ID)
    data = data.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toString().includes(searchQuery)
    );

    // Country filter (exporter country)
    if (selectedCountry !== "All Countries") {
      data = data.filter((p) => p.user.country === selectedCountry);
    }

    // Condition filter
    if (selectedCondition !== "all") {
      data = data.filter((p) => p.condition === selectedCondition);
    }

    // Price sorting
    if (priceSort) {
      data.sort((a, b) =>
        priceSort === "asc" ? a.price - b.price : b.price - a.price
      );
    }

    return data;
  }, [products, searchQuery, selectedCountry, selectedCondition, priceSort]);

  /** ---------------- PRICE ANALYSIS ---------------- */
  const minPrice = products.length ? Math.min(...products.map((p) => p.price)) : 0;
  const maxPrice = products.length ? Math.max(...products.map((p) => p.price)) : 0;
  const avgPrice =
    filteredProducts.length > 0
      ? (filteredProducts.reduce((sum, p) => sum + p.price, 0) / filteredProducts.length).toFixed(2)
      : "0.00";

  const countryList = [
    "All Countries",
    ...Array.from(new Set(products.map((p) => p.user.country))).sort(),
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ------------ Header ------------- */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-slate-900">Import Marketplace</h1>
          <p className="text-slate-600">
            Buy products directly from verified exporters
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* ------------ Search -------------- */}
        <div className="flex justify-center mb-12">
          <div className="w-full md:w-1/2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* ------------ Filters -------------- */}
        <div className="bg-white border rounded-lg p-6 mb-8 flex flex-wrap gap-6 justify-center">
          {/* Price Sort */}
          <div>
            <p className="font-semibold text-sm mb-2">Price</p>
            <div className="flex gap-2">
              <button
                onClick={() => setPriceSort(priceSort === "asc" ? null : "asc")}
                className={`px-3 py-2 rounded border ${
                  priceSort === "asc" ? "bg-blue-100 border-blue-300" : ""
                }`}
              >
                Low → High
              </button>
              <button
                onClick={() => setPriceSort(priceSort === "desc" ? null : "desc")}
                className={`px-3 py-2 rounded border ${
                  priceSort === "desc" ? "bg-blue-100 border-blue-300" : ""
                }`}
              >
                High → Low
              </button>
            </div>
          </div>

          {/* Country */}
          <div>
            <p className="font-semibold text-sm mb-2">Country</p>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-3 py-2 border rounded"
            >
              {countryList.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <div>
            <p className="font-semibold text-sm mb-2">Condition</p>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="px-3 py-2 border rounded"
            >
              <option value="all">All</option>
              <option value="new">New</option>
              <option value="used">Used</option>
              <option value="refurbished">Refurbished</option>
            </select>
          </div>
        </div>

        {/* ------------ Price Comparison Toggle ------------- */}
        <div className="mb-8 flex justify-end">
          <button
            onClick={() => setShowPriceComparison(!showPriceComparison)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg"
          >
            <TrendingUp className="w-4 h-4" />
            Price Comparison
          </button>
        </div>

        {/* ------------ Price Comparison Panel ------------- */}
        {showPriceComparison && (
          <div className="bg-white border rounded-lg p-6 mb-8">
            <h3 className="text-lg font-bold mb-4">Price Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 border-blue-200 border p-4 rounded">
                <p className="text-sm text-slate-600">Minimum Price</p>
                <p className="text-2xl font-bold text-blue-600">${minPrice}</p>
              </div>
              <div className="bg-green-50 border-green-200 border p-4 rounded">
                <p className="text-sm text-slate-600">Average Price</p>
                <p className="text-2xl font-bold text-green-600">${avgPrice}</p>
              </div>
              <div className="bg-purple-50 border-purple-200 border p-4 rounded">
                <p className="text-sm text-slate-600">Maximum Price</p>
                <p className="text-2xl font-bold text-purple-600">${maxPrice}</p>
              </div>
            </div>
          </div>
        )}

        {/* ------------ PRODUCT LIST ------------- */}
        <div className="space-y-4">
          {loading && (
            <div className="text-center text-slate-600 py-10">Loading...</div>
          )}

          {error && (
            <div className="text-center text-red-500 py-10">{error}</div>
          )}

          {!loading && !error && filteredProducts.length === 0 && (
            <div className="text-center bg-white border rounded-lg p-10">
              No products found.
            </div>
          )}

          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border rounded-lg p-6 hover:shadow-lg transition"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-2">
                  <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                  <p className="text-sm mb-1">
                    <span className="font-semibold">Quantity:</span>{" "}
                    {product.total_quantity}
                  </p>
                  <p className="text-sm mb-1">
                    <span className="font-semibold">Min Order:</span>{" "}
                    {product.min_order_quantity}
                  </p>
                  <p className="text-sm mb-1">
                    <span className="font-semibold">HSN:</span> {product.hsn_code}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Condition:</span>{" "}
                    <span className="px-2 py-1 bg-slate-100 rounded text-xs">
                      {product.condition}
                    </span>
                  </p>
                </div>

                {/* Exporter + Price */}
                <div>
                  <p className="text-sm font-semibold">Exporter</p>
                  <div className="bg-slate-50 p-3 rounded mb-4 text-sm">
                    <p className="font-semibold">{product.user.fullName}</p>
                    <p className="text-xs text-slate-600">{product.user.country}</p>
                  </div>

                  <p className="text-sm text-slate-600">Price</p>
                  <p className="text-2xl font-bold text-blue-600 mb-4">
                    ${product.price}
                  </p>

                  <button className="w-full py-2 bg-blue-600 text-white rounded">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        {filteredProducts.length > 0 && (
          <p className="text-center text-slate-600 mt-10">
            Showing <strong>{filteredProducts.length}</strong> of{" "}
            <strong>{products.length}</strong> products
          </p>
        )}
      </div>
    </div>
  );
}

