"use client"
import { useState } from "react";
import { Ship, Plane, Copy } from "lucide-react";
import { createProduct } from "@/lib/Product";
import { useSession } from "next-auth/react";

export default function Page() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    productName: "",
    productType: "",
    totalQuantity: "",
    minimumOrderQuantity: "",
    hsCode: "",
    condition: "new",
    transportMode: "sea",
    expectedShipmentTime: "",
    price:"",
  });

  const [listingType, setListingType] = useState("global");
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [privateKey, setPrivateKey] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const productTypes = [
    "Electronics",
    "Textiles & Apparel",
    "Machinery & Equipment",
    "Raw Materials",
    "Chemicals & Polymers",
    "Automotive Parts",
    "Furniture",
    "Agricultural Products",
    "Metals & Alloys",
    "Other",
  ];

  const countries = [
    "United States",
    "Canada",
    "United Kingdom",
    "Germany",
    "France",
    "Japan",
    "Australia",
    "India",
    "Singapore",
    "UAE",
    "Mexico",
    "Brazil",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleCountry = (country: string) => {
    setSelectedCountries((prev) =>
      prev.includes(country)
        ? prev.filter((c) => c !== country)
        : [...prev, country]
    );
  };

  const generatePrivateKey = () => {
    const key = `PKY-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 11)
      .toUpperCase()}`;
    setPrivateKey(key);
  };

  const copyPrivateKey = () => {
    if (privateKey) {
      navigator.clipboard.writeText(privateKey);
      alert("Private key copied to clipboard!");
    }
  };

  const handleSubmit = async (isDraft: boolean) => {
    if (!isDraft) {
      if (
        !formData.productName ||
        !formData.productType ||
        !formData.totalQuantity ||
        !formData.minimumOrderQuantity ||
        !formData.hsCode||
        !formData.price
      ) {
        alert("Please fill in all required fields");
        return;
      }
      if (listingType === "selected" && selectedCountries.length === 0) {
        alert("Please select at least one country");
        return;
      }
      if (listingType === "private" && !privateKey) {
        alert("Please generate a private key");
        return;
      }
    }
  const id = session?.user?.id 
  if (!id) {
    alert("You must be logged in to submit a product");
    return;
  }
  // TODO: Replace with actual logged-in user ID
    // Convert frontend → Prisma
    const prismaPayload = {
      name: formData.productName,
      userId: id, // TODO: Replace with actual logged-in user ID
      price: parseFloat(formData.price), // ❗ YOU need to add a "price" field in your form
      description: "No description", // ❗ or add textarea in UI
      total_quantity: Number(formData.totalQuantity),
      min_order_quantity: Number(formData.minimumOrderQuantity),
      hsn_code: formData.hsCode,
      condition: formData.condition,
      category: formData.productType,
      preference:
        listingType === "global"
          ? "public"
          : listingType === "selected"
          ? "selected_countries"
          : "private",
      preferred_countries: selectedCountries,
    };
  
    try {
      const response = await createProduct(prismaPayload);
      console.log("Product created:", response);
      alert("Product listing submitted!");
    } catch (error) {
      console.error(error);
      alert("Error submitting product");
    }
  };
  

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Export Your Products
          </h1>
          <p className="text-slate-600">
            List your products and connect with international buyers worldwide
          </p>
        </div>
      </div>

      {/* Main Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* First Card - Product Details */}
        <div className="bg-white rounded-lg border border-slate-200 p-8 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Product Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div>
               <label className="block text-sm font-semibold text-slate-700 mb-2">
                USER ID :{session && session.user && session?.user.id} <span className="text-red-500">*</span>
              </label>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                placeholder="Enter product name"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Product Type */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Product Type <span className="text-red-500">*</span>
              </label>
              <select
                name="productType"
                value={formData.productType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              >
                <option value="">Select product type</option>
                {productTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Total Quantity */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Total Quantity Available <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="totalQuantity"
                value={formData.totalQuantity}
                onChange={handleInputChange}
                placeholder="Enter total quantity"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
                 <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
               Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Enter total price in USD"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>


            {/* Minimum Order Quantity */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Minimum Order Quantity{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="minimumOrderQuantity"
                value={formData.minimumOrderQuantity}
                onChange={handleInputChange}
                placeholder="Enter minimum order quantity"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* HS Code */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                HS Code of Product <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="hsCode"
                value={formData.hsCode}
                onChange={handleInputChange}
                placeholder="Enter HS code (e.g., 8517.62)"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Product Condition */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Product Condition <span className="text-red-500">*</span>
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
              >
                <option value="new">New</option>
                <option value="used">used</option>
                <option value="refurbished">Refurbished</option>
              </select>
            </div>

            {/* Transportation Mode */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Transportation Mode <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      transportMode: "sea",
                    }))
                  }
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border font-medium transition-colors ${
                    formData.transportMode === "sea"
                      ? "bg-blue-100 border-blue-300 text-blue-700"
                      : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Ship className="w-5 h-5" />
                  Sea
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      transportMode: "air",
                    }))
                  }
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border font-medium transition-colors ${
                    formData.transportMode === "air"
                      ? "bg-blue-100 border-blue-300 text-blue-700"
                      : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Plane className="w-5 h-5" />
                  Air
                </button>
              </div>
            </div>

            {/* Expected Shipment Time */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Expected Shipment Time (days){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="expectedShipmentTime"
                value={formData.expectedShipmentTime}
                onChange={handleInputChange}
                placeholder="Enter expected days"
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Second Card - Listing Options */}
        <div className="bg-white rounded-lg border border-slate-200 p-8 mb-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Listing Preferences
          </h2>

          {/* Option 1: Global Listing */}
          <div className="mb-6 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <input
                type="radio"
                id="global"
                name="listingType"
                value="global"
                checked={listingType === "global"}
                onChange={(e) => setListingType(e.target.value)}
                className="w-4 h-4 cursor-pointer"
              />
              <label htmlFor="global" className="cursor-pointer flex-1">
                <p className="font-semibold text-slate-900">
                  Globally Publish
                </p>
                <p className="text-sm text-slate-600">
                  List your product details globally and make them visible to
                  all international buyers
                </p>
              </label>
            </div>
          </div>

          {/* Option 2: Selected Countries */}
          <div className="mb-6 pb-6 border-b border-slate-200">
            <div className="flex items-start gap-3">
              <input
                type="radio"
                id="selected"
                name="listingType"
                value="selected"
                checked={listingType === "selected"}
                onChange={(e) => setListingType(e.target.value)}
                className="w-4 h-4 cursor-pointer mt-1"
              />
              <div className="flex-1">
                <label htmlFor="selected" className="cursor-pointer">
                  <p className="font-semibold text-slate-900">
                    List to Selected Countries Only
                  </p>
                  <p className="text-sm text-slate-600 mb-3">
                    Choose specific countries where you want your products to
                    be visible
                  </p>
                </label>

                {listingType === "selected" && (
                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowCountryDropdown(!showCountryDropdown)
                      }
                      className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      {selectedCountries.length === 0
                        ? "Select countries..."
                        : (`${selectedCountries.length.toString()+ countries+ " selected"}`)}
                    </button>

                    {showCountryDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-300 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                        {countries.map((country) => (
                          <label
                            key={country}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                          >
                            <input
                              type="checkbox"
                              checked={selectedCountries.includes(country)}
                              onChange={() => toggleCountry(country)}
                              className="w-4 h-4 cursor-pointer"
                            />
                            <span className="text-sm text-slate-700">
                              {country}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}

                    {selectedCountries.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedCountries.map((country) => (
                          <span
                            key={country}
                            className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm border border-blue-200"
                          >
                            {country}
                            <button
                              onClick={() => toggleCountry(country)}
                              className="ml-1 font-semibold hover:text-blue-900"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Option 3: Private Trade */}
          <div className="mb-6">
            <div className="flex items-start gap-3">
              <input
                type="radio"
                id="private"
                name="listingType"
                value="private"
                checked={listingType === "private"}
                onChange={(e) => setListingType(e.target.value)}
                className="w-4 h-4 cursor-pointer mt-1"
              />
              <div className="flex-1">
                <label htmlFor="private" className="cursor-pointer">
                  <p className="font-semibold text-slate-900">
                    Private Trade (Generate Private Key)
                  </p>
                  <p className="text-sm text-slate-600 mb-3">
                    Generate a private key to share with specific buyers. Your
                    product details will not be publicly visible
                  </p>
                </label>

                {listingType === "private" && (
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    {!privateKey ? (
                      <button
                        onClick={generatePrivateKey}
                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                      >
                        Generate Private Key
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-slate-900">
                          Your Private Key:
                        </p>
                        <div className="flex items-center gap-2 bg-white border border-blue-300 rounded-lg p-3">
                          <code className="flex-1 font-mono text-sm text-slate-800 break-all">
                            {privateKey}
                          </code>
                          <button
                            onClick={copyPrivateKey}
                            className="p-2 hover:bg-slate-100 rounded transition-colors"
                            title="Copy private key"
                          >
                            <Copy className="w-4 h-4 text-blue-600" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-600">
                          Share this key with buyers who need access to your
                          product details
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Section */}
        <div className="flex justify-center gap-4 py-8">
          <button
            onClick={() => handleSubmit(true)}
            className="px-8 py-3 bg-white border-2 border-slate-900 text-slate-900 font-semibold rounded-lg hover:bg-slate-50 transition-colors"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSubmit(false)}
            className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}