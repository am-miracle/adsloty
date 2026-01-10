"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NewsletterData } from "@/components/sponsor-dashboard/newsletter-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { Slider } from "@/components/ui/slider";
import { Search, Users, Mail, CheckCircle2 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function NewslettersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("all");
  const [minSubscribers, setMinSubscribers] = useState(0);
  const [maxSubscribers, setMaxSubscribers] = useState(100000);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState("recommended");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [newsletters] = useState<NewsletterData[]>([
    {
      id: "1",
      name: "The Daily Tech",
      description:
        "Daily insights for software engineers and tech leaders. Covering AI, Cloud, and DevTools.",
      category: "Technology",
      subscribers: 45000,
      openRate: 42,
      clickRate: 3.8,
      pricePerSlot: 450,
      availableSlots: 3,
      nextAvailableDate: "Nov 15",
      featured: true,
    },
    {
      id: "2",
      name: "Finance Weekly",
      description:
        "Stock market analysis, crypto trends, and personal finance tips for the modern investor.",
      category: "Finance",
      subscribers: 120000,
      openRate: 35,
      clickRate: 4.1,
      pricePerSlot: 1200,
      availableSlots: 2,
      nextAvailableDate: "Nov 12",
      featured: true,
    },
    {
      id: "3",
      name: "Healthy Living",
      description:
        "Wellness hacks, nutritional advice, and mindfulness exercises for busy professionals.",
      category: "Lifestyle",
      subscribers: 8500,
      openRate: 55,
      clickRate: 5.2,
      pricePerSlot: 150,
      availableSlots: 5,
      nextAvailableDate: "Nov 8",
    },
    {
      id: "4",
      name: "Product Launch",
      description:
        "The #1 newsletter for product managers and indie makers shipping new products.",
      category: "Business",
      subscribers: 62000,
      openRate: 38,
      clickRate: 3.5,
      pricePerSlot: 800,
      availableSlots: 4,
      nextAvailableDate: "Nov 20",
    },
    {
      id: "5",
      name: "Crypto Insider",
      description: "Deep dive into DeFi, NFTs, and the future of Web3 money.",
      category: "Finance",
      subscribers: 15000,
      openRate: 48,
      clickRate: 3.9,
      pricePerSlot: 300,
      availableSlots: 0,
      featured: false,
    },
    {
      id: "6",
      name: "Design Digest",
      description:
        "UI/UX trends, case studies, and resources for digital designers.",
      category: "Design",
      subscribers: 28000,
      openRate: 45,
      clickRate: 4.8,
      pricePerSlot: 350,
      availableSlots: 6,
      nextAvailableDate: "Nov 10",
      featured: true,
    },
  ]);

  const niches = [
    { value: "all", label: "All Niches", icon: "grid_view" },
    { value: "Technology", label: "Tech & SaaS", icon: "terminal" },
    { value: "Finance", label: "Finance & Crypto", icon: "attach_money" },
    { value: "Lifestyle", label: "Lifestyle & Health", icon: "favorite" },
    { value: "Business", label: "Marketing & Sales", icon: "campaign" },
    { value: "Design", label: "Design & Creative", icon: "palette" },
  ];

  const filteredNewsletters = newsletters
    .filter((newsletter) => {
      const matchesSearch =
        newsletter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        newsletter.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesNiche =
        selectedNiche === "all" || newsletter.category === selectedNiche;
      const matchesSubscribers =
        newsletter.subscribers >= minSubscribers &&
        newsletter.subscribers <= maxSubscribers;
      const matchesPrice =
        newsletter.pricePerSlot >= minPrice &&
        newsletter.pricePerSlot <= maxPrice;
      const matchesAvailability =
        !availableOnly || newsletter.availableSlots > 0;

      return (
        matchesSearch &&
        matchesNiche &&
        matchesSubscribers &&
        matchesPrice &&
        matchesAvailability
      );
    })
    .sort((a, b) => {
      if (sortBy === "recommended") {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.subscribers - a.subscribers;
      } else if (sortBy === "price-low") {
        return a.pricePerSlot - b.pricePerSlot;
      } else if (sortBy === "subscribers") {
        return b.subscribers - a.subscribers;
      } else if (sortBy === "open-rate") {
        return b.openRate - a.openRate;
      }
      return 0;
    });

  const handleViewDetails = (id: string) => {
    router.push(`/newsletters/${id}`);
  };

  const totalPages = Math.ceil(filteredNewsletters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNewsletters = filteredNewsletters.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  return (
    <>
      <div className="">
        <div className="max-w-360 mx-auto px-4 sm:px-6 py-20 lg:py-24">
          <div className="relative rounded-2xl overflow-hidden min-h-75 flex flex-col items-center justify-center text-center p-6 gap-6">
            <div className="flex flex-col gap-3 max-w-2xl relative z-10">
              <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
                Find the perfect newsletter for your brand
              </h1>
              <p className="text-slate-200 dark:text-text-secondary text-base sm:text-lg">
                Connect with engaged audiences through our curated marketplace
                of premium newsletters.
              </p>
            </div>
            <div className="w-full max-w-xl relative z-10">
              <div className="flex w-full items-center rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-border p-1.5 shadow-lg focus-within:border-primary transition-colors">
                <div className="pl-3 pr-2 text-slate-400 dark:text-text-secondary flex items-center justify-center">
                  <Search className="w-5 h-5" />
                </div>
                <Input
                  className="w-full bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-text-secondary focus:ring-0 text-base"
                  placeholder="Search by keyword, topic, or writer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button className="rounded-lg px-6 py-2.5 font-bold text-sm whitespace-nowrap">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="grow w-full max-w-360 mx-auto px-4 sm:px-6 py-8 flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-72 shrink-0 space-y-6">
          <div className="flex items-center justify-between lg:hidden mb-4">
            <h2 className="text-xl font-bold">Filters</h2>
            <button
              onClick={() => {
                setSelectedNiche("all");
                setMinSubscribers(0);
                setMaxSubscribers(100000);
                setMinPrice(0);
                setMaxPrice(2000);
                setAvailableOnly(false);
              }}
              className="text-primary text-sm font-bold"
            >
              Reset All
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base">Niche</h3>
            </div>
            <div className="space-y-1">
              {niches.map((niche) => (
                <button
                  key={niche.value}
                  onClick={() => setSelectedNiche(niche.value)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                    selectedNiche === niche.value
                      ? "bg-primary/20 text-primary"
                      : "text-text-secondary hover:bg-surface-dark hover:text-white"
                  }`}
                >
                  <span className="text-sm ">{niche.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-200 dark:bg-border"></div>

          <div className="space-y-4">
            <h3 className="font-bold text-base">Subscriber Count</h3>
            <div className="px-1">
              <Slider
                min={0}
                max={150000}
                step={5000}
                value={[minSubscribers, maxSubscribers]}
                onValueChange={([min, max]) => {
                  setMinSubscribers(min);
                  setMaxSubscribers(max);
                  handleFilterChange();
                }}
                className="mb-4"
              />
              <div className="flex justify-between text-sm font-medium text-text-secondary">
                <span>
                  {minSubscribers >= 1000
                    ? `${Math.round(minSubscribers / 1000)}k`
                    : minSubscribers}
                </span>
                <span>
                  {maxSubscribers >= 1000
                    ? `${Math.round(maxSubscribers / 1000)}k+`
                    : maxSubscribers}
                </span>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-200 dark:bg-border"></div>

          <div className="space-y-4">
            <h3 className="font-bold text-base">Price per Slot</h3>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-text-secondary text-sm">
                  $
                </span>
                <Input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  className="pl-6"
                />
              </div>
              <span className="text-text-secondary">-</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-text-secondary text-sm">
                  $
                </span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="pl-6"
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-200 dark:bg-border"></div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Available slots only</span>
            <button
              onClick={() => setAvailableOnly(!availableOnly)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                availableOnly ? "bg-primary" : "bg-border"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  availableOnly ? "translate-x-6" : "translate-x-1"
                }`}
              ></span>
            </button>
          </div>
        </aside>

        <section className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold">Browse Newsletters</h2>
              <p className="text-text-secondary text-sm mt-1">
                Showing {filteredNewsletters.length} newsletters matching your
                criteria
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-text-secondary whitespace-nowrap">
                Sort by:
              </span>
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value)}
              >
                <SelectTrigger
                  className="bg-transparent border-none text-sm
                    text-white focus:ring-0
                    cursor-pointer"
                >
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>

                <SelectContent align="end">
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="price-low">Lowest Price</SelectItem>
                  <SelectItem value="subscribers">
                    Highest Subscribers
                  </SelectItem>
                  <SelectItem value="open-rate">Best Open Rate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredNewsletters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedNewsletters.map((newsletter) => (
                <article
                  key={newsletter.id}
                  className={`flex flex-col bg-white dark:bg-surface-dark border border-slate-200 dark:border-border rounded-xl overflow-hidden hover:shadow-xl hover:border-primary/50 transition-all duration-300 group ${
                    newsletter.availableSlots === 0 ? "opacity-75" : ""
                  }`}
                >
                  <div
                    className={`h-24 bg-slate-100 dark:bg-[#2a2435] relative ${
                      newsletter.availableSlots === 0 ? "grayscale" : ""
                    }`}
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-primary/20 to-purple-600/20"></div>
                    {newsletter.availableSlots === 0 && (
                      <div className="absolute inset-0 bg-slate-900/40 z-10 flex items-center justify-center">
                        <span className="bg-black/50 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                          Sold Out
                        </span>
                      </div>
                    )}
                    <div className="absolute -bottom-6 left-5 size-14 rounded-lg border-4 border-white dark:border-surface-dark bg-linear-to-br from-primary to-purple-600 shadow-sm flex items-center justify-center text-white font-bold text-2xl">
                      {newsletter.name.charAt(0)}
                    </div>
                  </div>

                  <div className="p-5 pt-8 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                        {newsletter.name}
                      </h3>
                      {newsletter.featured && (
                        <span className="bg-green-500/10 text-green-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-green-500/20 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                    </div>

                    <p className="text-slate-600 dark:text-text-secondary text-sm line-clamp-2 mb-4">
                      {newsletter.description}
                    </p>

                    <div className="flex gap-2 mb-5 flex-wrap">
                      <span className="px-2 py-1 rounded bg-slate-100 dark:bg-background-dark text-xs font-medium text-slate-600 dark:text-text-secondary border border-slate-200 dark:border-border">
                        {newsletter.category}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-slate-200 dark:border-border mb-5">
                      <div className="flex flex-col">
                        <span className="text-xs text-text-secondary flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" /> Subscribers
                        </span>
                        <span className="text-lg font-bold">
                          {newsletter.subscribers.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-text-secondary flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" /> Open Rate
                        </span>
                        <span className="text-lg font-bold text-green-400">
                          {newsletter.openRate}%
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex flex-col">
                        <span className="text-xs text-text-secondary">
                          Starting at
                        </span>
                        <span className="text-xl font-bold text-slate-900 dark:text-white">
                          ${newsletter.pricePerSlot}
                          <span className="text-sm font-normal text-text-secondary">
                            /slot
                          </span>
                        </span>
                      </div>
                      {newsletter.availableSlots > 0 ? (
                        <Button
                          onClick={() => handleViewDetails(newsletter.id)}
                          className="text-sm font-bold py-2 px-4 shadow-lg shadow-primary/20"
                        >
                          View Details
                        </Button>
                      ) : (
                        <Button
                          disabled
                          className="text-sm font-bold py-2 px-4 bg-slate-200 dark:bg-[#433b54] text-slate-400 dark:text-text-secondary cursor-not-allowed"
                        >
                          Fully Booked
                        </Button>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="glass-strong rounded-2xl p-12 border border-border text-center">
              <p className="text-text-secondary text-lg mb-2">
                No newsletters found
              </p>
              <p className="text-text-secondary text-sm">
                Try adjusting your filters to see more results
              </p>
            </div>
          )}

          <div className="mt-12">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </section>
      </main>
    </>
  );
}
