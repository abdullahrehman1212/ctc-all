import { useState, useMemo } from "react";
import { TrendingUp, BarChart2, Clock, Ban, Search, Download, Printer, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface StockItem {
  id: string;
  partNo: string;
  description: string;
  category: string;
  quantity: number;
  value: number;
  daysIdle: number;
  turnover: number;
}

// Sample data with more items for pagination
const sampleData: StockItem[] = [];

type Classification = "Fast" | "Normal" | "Slow" | "Dead";

export const StockAnalysis = () => {
  // Configuration state
  const [fastMovingDays, setFastMovingDays] = useState(30);
  const [slowMovingDays, setSlowMovingDays] = useState(90);
  const [deadStockDays, setDeadStockDays] = useState(180);
  const [analysisPeriod, setAnalysisPeriod] = useState(6);

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | Classification>("All");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(sampleData.map(item => item.category))];
    return cats.sort();
  }, []);

  // Classify items based on configuration
  const classifyItem = (item: StockItem): Classification => {
    if (item.daysIdle >= deadStockDays || item.turnover === 0) return "Dead";
    if (item.daysIdle >= slowMovingDays) return "Slow";
    if (item.daysIdle <= fastMovingDays && item.turnover >= 5) return "Fast";
    return "Normal";
  };

  // Calculate classified data
  const classifiedData = useMemo(() => {
    return sampleData.map(item => ({
      ...item,
      classification: classifyItem(item),
    }));
  }, [fastMovingDays, slowMovingDays, deadStockDays]);

  // Calculate summary stats
  const stats = useMemo(() => {
    const totalValue = classifiedData.reduce((sum, item) => sum + item.value, 0);
    const fastItems = classifiedData.filter(i => i.classification === "Fast");
    const normalItems = classifiedData.filter(i => i.classification === "Normal");
    const slowItems = classifiedData.filter(i => i.classification === "Slow");
    const deadItems = classifiedData.filter(i => i.classification === "Dead");

    return {
      fast: {
        count: fastItems.length,
        value: fastItems.reduce((sum, i) => sum + i.value, 0),
        percentage: totalValue > 0 ? ((fastItems.reduce((sum, i) => sum + i.value, 0) / totalValue) * 100).toFixed(1) : "0",
      },
      normal: {
        count: normalItems.length,
        value: normalItems.reduce((sum, i) => sum + i.value, 0),
        percentage: totalValue > 0 ? ((normalItems.reduce((sum, i) => sum + i.value, 0) / totalValue) * 100).toFixed(1) : "0",
      },
      slow: {
        count: slowItems.length,
        value: slowItems.reduce((sum, i) => sum + i.value, 0),
        percentage: totalValue > 0 ? ((slowItems.reduce((sum, i) => sum + i.value, 0) / totalValue) * 100).toFixed(1) : "0",
      },
      dead: {
        count: deadItems.length,
        value: deadItems.reduce((sum, i) => sum + i.value, 0),
        percentage: totalValue > 0 ? ((deadItems.reduce((sum, i) => sum + i.value, 0) / totalValue) * 100).toFixed(1) : "0",
      },
    };
  }, [classifiedData]);

  // Filter items
  const filteredItems = useMemo(() => {
    return classifiedData.filter((item) => {
      const matchesSearch =
        item.partNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab = activeTab === "All" || item.classification === activeTab;
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
      return matchesSearch && matchesTab && matchesCategory;
    });
  }, [classifiedData, searchTerm, activeTab, categoryFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  // Reset page when filters change
  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setCategoryFilter(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  // Export functions
  const handleExportCSV = () => {
    const headers = ["SR", "Part No", "Description", "Category", "Quantity", "Value (Rs)", "Days Idle", "Turnover", "Status"];
    const csvContent = [
      headers.join(","),
      ...filteredItems.map((item, index) => 
        [index + 1, item.partNo, `"${item.description}"`, `"${item.category}"`, item.quantity, item.value, item.daysIdle, `${item.turnover}/mo`, classifyItem(item)].join(",")
      ),
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stock-analysis-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const classificationColors: Record<Classification, string> = {
    Fast: "bg-emerald-50 text-emerald-600 border-emerald-200",
    Normal: "bg-blue-50 text-blue-600 border-blue-200",
    Slow: "bg-amber-50 text-amber-600 border-amber-200",
    Dead: "bg-red-50 text-red-600 border-red-200",
  };

  const formatCurrency = (value: number) => {
    return `Rs ${value.toLocaleString("en-PK")}.00`;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Stock Movement Analysis</h2>
            <p className="text-sm text-muted-foreground">Fast, Slow, and Dead Stock Analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleExportCSV}>
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-primary border-primary hover:bg-primary/10" onClick={handlePrintPDF}>
            <Printer className="w-4 h-4" />
            Print PDF
          </Button>
        </div>
      </div>

      {/* Analysis Configuration */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-4 h-4 text-orange-600" />
          <h3 className="text-sm font-medium text-orange-800">Analysis Configuration</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-medium text-orange-700 block mb-1.5">Fast Moving (≤ days)</label>
            <Input
              type="number"
              value={fastMovingDays}
              onChange={(e) => setFastMovingDays(Number(e.target.value))}
              className="h-9 bg-background"
            />
            <p className="text-xs text-muted-foreground mt-1">Items with activity within these days</p>
          </div>
          <div>
            <label className="text-xs font-medium text-orange-700 block mb-1.5">Slow Moving (≥ days)</label>
            <Input
              type="number"
              value={slowMovingDays}
              onChange={(e) => setSlowMovingDays(Number(e.target.value))}
              className="h-9 bg-background"
            />
            <p className="text-xs text-muted-foreground mt-1">Items idle for these many days</p>
          </div>
          <div>
            <label className="text-xs font-medium text-orange-700 block mb-1.5">Dead Stock (≥ days)</label>
            <Input
              type="number"
              value={deadStockDays}
              onChange={(e) => setDeadStockDays(Number(e.target.value))}
              className="h-9 bg-background"
            />
            <p className="text-xs text-muted-foreground mt-1">Items with no movement</p>
          </div>
          <div>
            <label className="text-xs font-medium text-orange-700 block mb-1.5">Analysis Period (months)</label>
            <Input
              type="number"
              value={analysisPeriod}
              onChange={(e) => setAnalysisPeriod(Number(e.target.value))}
              className="h-9 bg-background"
            />
            <p className="text-xs text-muted-foreground mt-1">Period for turnover calculation</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Fast Moving */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-green-600 mb-1">Fast Moving</p>
              <p className="text-2xl font-bold text-foreground">{stats.fast.count}</p>
              <p className="text-sm text-green-600 font-medium">{formatCurrency(stats.fast.value)}</p>
              <p className="text-xs text-green-600">{stats.fast.percentage}% of value</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        {/* Normal Moving */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-yellow-600 mb-1">Normal Moving</p>
              <p className="text-2xl font-bold text-foreground">{stats.normal.count}</p>
              <p className="text-sm text-yellow-600 font-medium">{formatCurrency(stats.normal.value)}</p>
              <p className="text-xs text-yellow-600">{stats.normal.percentage}% of value</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <BarChart2 className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Slow Moving */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-orange-600 mb-1">Slow Moving</p>
              <p className="text-2xl font-bold text-foreground">{stats.slow.count}</p>
              <p className="text-sm text-orange-600 font-medium">{formatCurrency(stats.slow.value)}</p>
              <p className="text-xs text-orange-600">{stats.slow.percentage}% of value</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Dead Stock */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-red-600 mb-1">Dead Stock</p>
              <p className="text-2xl font-bold text-foreground">{stats.dead.count}</p>
              <p className="text-sm text-red-600 font-medium">{formatCurrency(stats.dead.value)}</p>
              <p className="text-xs text-red-600">{stats.dead.percentage}% of value</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <Ban className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Stock Details Section */}
      <div className="bg-card border border-border rounded-lg">
        {/* Filters Row */}
        <div className="p-4 border-b border-border">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Tabs */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Stock Details</span>
              <div className="flex items-center gap-1 ml-2">
                {(["All", "Fast", "Normal", "Slow", "Dead"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                      activeTab === tab
                        ? tab === "All"
                          ? "bg-primary text-primary-foreground"
                          : tab === "Fast"
                          ? "bg-green-500 text-white"
                          : tab === "Normal"
                          ? "bg-blue-500 text-white"
                          : tab === "Slow"
                          ? "bg-amber-500 text-white"
                          : "bg-red-500 text-white"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Search and Category Filter */}
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search..."
                  className="pl-9 h-9"
                />
              </div>
              <Select value={categoryFilter} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full lg:w-40 h-9">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="text-xs font-medium w-12">SR.</TableHead>
                <TableHead className="text-xs font-medium">PART NO</TableHead>
                <TableHead className="text-xs font-medium">DESCRIPTION</TableHead>
                <TableHead className="text-xs font-medium">CATEGORY</TableHead>
                <TableHead className="text-xs font-medium text-right">QUANTITY</TableHead>
                <TableHead className="text-xs font-medium text-right">VALUE</TableHead>
                <TableHead className="text-xs font-medium text-right">DAYS IDLE</TableHead>
                <TableHead className="text-xs font-medium text-right">TURNOVER</TableHead>
                <TableHead className="text-xs font-medium text-center">STATUS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedItems.map((item, index) => (
                <TableRow key={item.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="text-sm text-muted-foreground">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                  <TableCell className="text-sm font-medium text-foreground">{item.partNo}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.description}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.category}</TableCell>
                  <TableCell className="text-sm font-medium text-foreground text-right">{item.quantity}</TableCell>
                  <TableCell className="text-sm font-medium text-green-600 text-right">{formatCurrency(item.value)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground text-right">{item.daysIdle}</TableCell>
                  <TableCell className="text-sm text-muted-foreground text-right">{item.turnover}/mo</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={cn("text-xs", classificationColors[item.classification])}>
                      {item.classification === "Fast" ? "Fast Moving" : item.classification === "Slow" ? "Slow Moving" : item.classification}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                    No items found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length} items
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Prev
            </Button>
            <span className="px-3 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded">
              {currentPage} / {totalPages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </Button>
            <Select value={String(itemsPerPage)} onValueChange={(v) => { setItemsPerPage(Number(v)); setCurrentPage(1); }}>
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
