"use client";

import Image from "next/image";
import Link from "next/link";
import { Package, TrendingUp, Ship } from "lucide-react"; // icons

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="min-h-screen flex flex-col">

        {/* Hero Section */}
        <section className="relative h-96 md:h-[500px] overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="https://wallpaperaccess.com/full/1911909.jpg"
              alt="Cargo ship"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          {/* Hero Content */}
          <div className="relative h-full flex flex-col items-center justify-center text-white text-center px-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Global Trade Made Simple
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mb-6 text-gray-100">
              TradeFlow AI connects importers and exporters worldwide, streamlining
              international commerce with trusted logistics solutions and
              real-time market insights.
            </p>
            <Link
              href="/register"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </section>

        {/* Feature Boxes Section */}
        <section className="py-12 md:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

              {/* Import Box */}
              <Link
                href="/import"
                className="group bg-white border border-slate-200 rounded-lg p-8 text-center hover:border-blue-400 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                    <Package className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Import</h3>
                <p className="text-slate-600 text-sm">
                  Find and import quality products from verified sellers worldwide
                  with our comprehensive import marketplace.
                </p>
              </Link>

              {/* Market Preview Box */}
              <Link
                href="/market-preview"
                className="group bg-white border border-slate-200 rounded-lg p-8 text-center hover:border-green-400 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Market Preview
                </h3>
                <p className="text-slate-600 text-sm">
                  Explore real-time market trends, pricing analytics, and trade
                  opportunities across all major commodities.
                </p>
              </Link>

              {/* Export Box */}
              <Link
                href="/export"
                className="group bg-white border border-slate-200 rounded-lg p-8 text-center hover:border-purple-400 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                    <Ship className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Export</h3>
                <p className="text-slate-600 text-sm">
                  List your products, connect with international buyers, and
                  expand your business globally.
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* Additional Info Section */}
        <section className="py-12 md:py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Why Choose TradeFLow AI?
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                We simplify global trade through technology, trust, and expertise.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg border border-slate-200">
                <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                <p className="text-slate-700 font-semibold mb-2">Active Exporters</p>
                <p className="text-slate-600 text-sm">Verified sellers from 50+ countries</p>
              </div>

              <div className="bg-white p-8 rounded-lg border border-slate-200">
                <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                <p className="text-slate-700 font-semibold mb-2">Support</p>
                <p className="text-slate-600 text-sm">Round-the-clock customer assistance</p>
              </div>

              <div className="bg-white p-8 rounded-lg border border-slate-200">
                <div className="text-3xl font-bold text-blue-600 mb-2">99%</div>
                <p className="text-slate-700 font-semibold mb-2">On-Time Delivery</p>
                <p className="text-slate-600 text-sm">Reliable logistics partners worldwide</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
