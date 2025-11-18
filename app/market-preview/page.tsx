"use client"
import { useState, useRef, useEffect } from "react";
import { Search, BarChart3, TrendingUp, Menu, X, Send, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
interface ProductTrend {
  id: string;
  product: string;
  value: number;
  change: number;
  lastWeek: number;
  volume: number;
  trend: "up" | "down";
}

interface CategoryData {
  type: "import" | "export";
  products: ProductTrend[];
  totalValue: number;
  avgChange: number;
}

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
}

const exportProducts: ProductTrend[] = [
  {
    id: "e1",
    product: "Electronics",
    value: 2450,
    change: 12.5,
    lastWeek: 2180,
    volume: 1540,
    trend: "up",
  },
  {
    id: "e2",
    product: "Chemicals",
    value: 3200,
    change: -3.5,
    lastWeek: 3315,
    volume: 2100,
    trend: "down",
  },
  {
    id: "e3",
    product: "Pharmaceuticals",
    value: 2100,
    change: 8.7,
    lastWeek: 1931,
    volume: 980,
    trend: "up",
  },
];

const importProducts: ProductTrend[] = [
  {
    id: "i1",
    product: "Textiles",
    value: 1890,
    change: 8.2,
    lastWeek: 1745,
    volume: 890,
    trend: "up",
  },
  {
    id: "i2",
    product: "Machinery",
    value: 2800,
    change: 5.1,
    lastWeek: 2665,
    volume: 1200,
    trend: "up",
  },
  {
    id: "i3",
    product: "Raw Materials",
    value: 1650,
    change: -2.3,
    lastWeek: 1689,
    volume: 750,
    trend: "down",
  },
];

function SimpleBarChart() {
  return (
    <div className="flex items-end gap-1 h-12">
      {[65, 75, 45, 85, 60, 90, 70].map((height, i) => (
        <div
          key={i}
          className="flex-1 bg-gradient-to-t from-blue-500 to-blue-300 rounded-sm opacity-85 hover:opacity-100 transition"
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
}

function ProductCard({ product, onViewDetails }: { product: ProductTrend; onViewDetails: (p: ProductTrend) => void }) {
  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 hover:shadow-md transition cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">{product.product}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            ${product.value}M
          </p>
        </div>
        <span
          className={cn(
            "text-xs font-bold px-2 py-1 rounded",
            product.trend === "up"
              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
              : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
          )}
        >
          {product.trend === "up" ? "↑" : "↓"} {Math.abs(product.change)}%
        </span>
      </div>

      <SimpleBarChart />

      <button
        onClick={() => onViewDetails(product)}
        className="w-full mt-3 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
      >
        View Details →
      </button>
    </div>
  );
}

function CategoryCard({ category, title, products, onViewDetails }: { category: "import" | "export"; title: string; products: ProductTrend[]; onViewDetails: (p: ProductTrend) => void }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 px-6 py-4 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg", category === "export" ? "bg-blue-500" : "bg-green-500")}>
            {category === "export" ? (
              <span className="text-white text-lg">📤</span>
            ) : (
              <span className="text-white text-lg">📥</span>
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {products.length} products
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    </div>
  );
}

function GeminiSidebar({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content: "Hello! I'm your market intelligence assistant. Ask me about import/export trends, market data, or global trade news.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (response.ok) {
        const data = await response.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: data.response || "I couldn't process that request. Please try again.",
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: "Error connecting to AI service. Please try again later.",
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "Failed to get response. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className={cn(
          "fixed bottom-6 right-6 p-3 rounded-full shadow-lg transition-all hover:scale-110 z-40",
          isOpen
            ? "bg-gray-600 text-white"
            : "bg-blue-600 text-white hover:bg-blue-700"
        )}
        title={isOpen ? "Close Assistant" : "Open Assistant"}
      >
        {isOpen ? <X size={24} /> : <BarChart3 size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 right-0 h-screen w-96 bg-white dark:bg-slate-900 border-l border-gray-200 dark:border-slate-700 shadow-2xl flex flex-col transition-transform duration-300 z-50",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-200 dark:border-slate-700 flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Market Intelligence</h2>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Powered by Gemini AI</p>
          </div>
          <button
            onClick={onToggle}
            className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition"
          >
            <X size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-950">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex",
                msg.type === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-xs px-4 py-3 rounded-2xl text-sm shadow-sm",
                  msg.type === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-bl-none border border-gray-200 dark:border-slate-700"
                )}
              >
                <p className="leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-bl-none border border-gray-200 dark:border-slate-700">
                <Loader className="h-5 w-5 animate-spin text-blue-500" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !isLoading) {
                  handleSendMessage();
                }
              }}
              placeholder="Ask about market trends..."
              className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium flex items-center gap-2"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={onToggle}
        />
      )}
    </>
  );
}

export default function MarketPreview() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ProductTrend | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const filteredExport = searchQuery
    ? exportProducts.filter((p) =>
        p.product.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : exportProducts;

  const filteredImport = searchQuery
    ? importProducts.filter((p) =>
        p.product.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : importProducts;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900 flex flex-col">
      {/* Navbar */}
      {/* <Navbar /> */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header Section */}
        <div className="py-6 px-4 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              Market Preview
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Explore real-time import/export trends and market intelligence
            </p>
          </div>
        </div>

        {/* Search Section */}
        <div className="py-8 px-4 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center mb-2">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Search for products to filter by import/export category
              </p>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-2xl">
                <div className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 p-4 hover:shadow-xl transition">
                  <Search className="text-blue-500 flex-shrink-0" size={24} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="flex-1 outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-base"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="flex-1 py-12 px-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-950 dark:to-slate-900">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Export Card */}
            <CategoryCard
              category="export"
              title="Export Products"
              products={filteredExport}
              onViewDetails={setSelectedProduct}
            />

            {/* Import Card */}
            <CategoryCard
              category="import"
              title="Import Products"
              products={filteredImport}
              onViewDetails={setSelectedProduct}
            />

            {/* Details Panel */}
            {selectedProduct && (
              <div className="mt-8 p-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedProduct.product} - Detailed Analysis
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition"
                  >
                    <X size={24} className="text-gray-600 dark:text-gray-300" />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      Current Value
                    </p>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-300">
                      ${selectedProduct.value}M
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      Week Change
                    </p>
                    <p
                      className={cn(
                        "text-3xl font-bold",
                        selectedProduct.trend === "up"
                          ? "text-green-600 dark:text-green-300"
                          : "text-red-600 dark:text-red-300"
                      )}
                    >
                      {selectedProduct.trend === "up" ? "+" : ""}
                      {selectedProduct.change}%
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-900 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      Last Week
                    </p>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-300">
                      ${selectedProduct.lastWeek}M
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 dark:bg-orange-900 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                      Volume
                    </p>
                    <p className="text-3xl font-bold text-orange-600 dark:text-orange-300">
                      {selectedProduct.volume}K
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Summary
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <li>• <strong>Product:</strong> {selectedProduct.product}</li>
                    <li>• <strong>Market Direction:</strong> {selectedProduct.trend === "up" ? "Uptrend" : "Downtrend"}</li>
                    <li>• <strong>Week-over-Week:</strong> {selectedProduct.change > 0 ? "Growth" : "Decline"} of {Math.abs(selectedProduct.change)}%</li>
                    <li>• <strong>Trading Volume:</strong> {selectedProduct.volume}K units</li>
                    <li>• <strong>Price Range:</strong> ${Math.round(selectedProduct.lastWeek * 0.95)}M - ${Math.round(selectedProduct.value * 1.05)}M</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      {/* <Footer /> */}

      {/* Gemini Sidebar - Opens by default */}
      <GeminiSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
    </div>
  );
}
