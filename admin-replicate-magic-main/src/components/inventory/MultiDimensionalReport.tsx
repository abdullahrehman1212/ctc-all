import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  FileText, 
  Printer, 
  LayoutGrid,
  Package,
  Hash,
  DollarSign,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  RefreshCw
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ReportRow {
  id: string;
  dimension: string;
  items: number;
  quantity: number;
  value: number;
  percentOfTotal: number;
  avgCost: number;
}

// Sample data
const sampleData: ReportRow[] = [];

const dimensions = ["Category", "Brand", "Store", "Location", "UOM"];
const categories = ["All Categories", "Engine Parts", "Transmission", "Electrical", "Brake System", "Suspension", "Uncategorized"];
const brands = ["All Brands", "Bosch", "NGK", "Michelin", "Mann", "Continental"];
const sortOptions = ["Value", "Quantity", "Items", "Avg Cost", "Name"];

export const MultiDimensionalReport = () => {
  const [primaryDimension, setPrimaryDimension] = useState("Category");
  const [secondaryDimension, setSecondaryDimension] = useState("none");
  const [tertiaryDimension, setTertiaryDimension] = useState("none");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [brandFilter, setBrandFilter] = useState("All Brands");
  const [sortBy, setSortBy] = useState("Value");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const selectedDimensions = useMemo(() => {
    const dims = [primaryDimension];
    if (secondaryDimension !== "none") dims.push(secondaryDimension);
    if (tertiaryDimension !== "none") dims.push(tertiaryDimension);
    return dims;
  }, [primaryDimension, secondaryDimension, tertiaryDimension]);

  const sortedData = useMemo(() => {
    return [...sampleData].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "Value":
          comparison = a.value - b.value;
          break;
        case "Quantity":
          comparison = a.quantity - b.quantity;
          break;
        case "Items":
          comparison = a.items - b.items;
          break;
        case "Avg Cost":
          comparison = a.avgCost - b.avgCost;
          break;
        case "Name":
          comparison = a.dimension.localeCompare(b.dimension);
          break;
      }
      return sortDirection === "desc" ? -comparison : comparison;
    });
  }, [sortBy, sortDirection]);

  const totals = useMemo(() => {
    return sampleData.reduce(
      (acc, row) => ({
        items: acc.items + row.items,
        quantity: acc.quantity + row.quantity,
        value: acc.value + row.value,
      }),
      { items: 0, quantity: 0, value: 0 }
    );
  }, []);

  const handleExportCSV = () => {
    const headers = [primaryDimension.toUpperCase(), "ITEMS", "QUANTITY", "VALUE", "% OF TOTAL", "AVG COST"];
    const csvData = sortedData.map(row => [
      row.dimension,
      row.items,
      row.quantity,
      row.value,
      `${row.percentOfTotal}%`,
      row.avgCost.toFixed(2)
    ]);
    csvData.push(["TOTAL", totals.items, totals.quantity, totals.value, "100%", "-"]);
    
    const csvContent = [headers.join(","), ...csvData.map(row => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "multi-dimensional-report.csv";
    a.click();
    toast({ title: "Export Complete", description: "CSV file downloaded successfully" });
  };

  const handlePrint = () => {
    window.print();
    toast({ title: "Print", description: "Print dialog opened" });
  };

  const handleGenerateReport = () => {
    toast({ title: "Report Generated", description: `Report generated with ${selectedDimensions.join(", ")} dimensions` });
  };

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === "asc" ? "desc" : "asc");
  };

  const getProgressColor = (percent: number) => {
    if (percent >= 30) return "bg-destructive";
    if (percent >= 10) return "bg-primary";
    if (percent >= 1) return "bg-info";
    return "bg-muted";
  };

  const formatCurrency = (value: number) => {
    return `Rs ${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-start gap-2">
          <div className="w-1 h-12 bg-primary rounded-full" />
          <div>
            <h1 className="text-xl font-bold text-foreground">Multi-Dimensional Stock Report</h1>
            <p className="text-xs text-muted-foreground">Analyze stock by multiple dimensions</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8 border-primary text-primary hover:bg-primary/10 hover:text-primary" onClick={handleExportCSV}>
            <FileText className="w-3.5 h-3.5" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8 border-primary text-primary hover:bg-primary/10 hover:text-primary" onClick={handlePrint}>
            <Printer className="w-3.5 h-3.5" />
            Print PDF
          </Button>
        </div>
      </div>

      {/* Report Configuration */}
      <Card className="border-border">
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-primary" />
            Report Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 space-y-4">
          {/* Dimension Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-primary">Primary Dimension *</label>
              <Select value={primaryDimension} onValueChange={setPrimaryDimension}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dimensions.map(dim => (
                    <SelectItem key={dim} value={dim} className="text-xs">{dim}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Secondary Dimension</label>
              <Select value={secondaryDimension} onValueChange={setSecondaryDimension}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" className="text-xs">None</SelectItem>
                  {dimensions.filter(d => d !== primaryDimension).map(dim => (
                    <SelectItem key={dim} value={dim} className="text-xs">{dim}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-primary">Tertiary Dimension</label>
              <Select value={tertiaryDimension} onValueChange={setTertiaryDimension}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" className="text-xs">None</SelectItem>
                  {dimensions.filter(d => d !== primaryDimension && d !== secondaryDimension).map(dim => (
                    <SelectItem key={dim} value={dim} className="text-xs">{dim}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Filter by Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat} className="text-xs">{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Filter by Brand</label>
              <Select value={brandFilter} onValueChange={setBrandFilter}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {brands.map(brand => (
                    <SelectItem key={brand} value={brand} className="text-xs">{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Sort By</label>
              <div className="flex gap-1">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-8 text-xs flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(opt => (
                      <SelectItem key={opt} value={opt} className="text-xs">{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={toggleSortDirection}
                >
                  {sortDirection === "desc" ? <ArrowDown className="w-3.5 h-3.5" /> : <ArrowUp className="w-3.5 h-3.5" />}
                </Button>
              </div>
            </div>
          </div>

          {/* Selected Dimensions & Generate Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground">Dimensions:</span>
              {selectedDimensions.map(dim => (
                <Badge key={dim} variant="secondary" className="text-xs bg-primary/10 text-primary border-0">
                  {dim}
                </Badge>
              ))}
            </div>
            <Button size="sm" className="gap-1.5 text-xs h-8" onClick={handleGenerateReport}>
              <RefreshCw className="w-3.5 h-3.5" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-primary border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-primary">Total Groups</p>
                <p className="text-2xl font-bold text-foreground">{sortedData.length}</p>
                <p className="text-xs text-primary">{totals.items} total items</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-chart-blue border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-chart-blue">Total Quantity</p>
                <p className="text-2xl font-bold text-foreground">{totals.quantity.toLocaleString()}</p>
                <p className="text-xs text-chart-blue">across all groups</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-chart-blue/10 flex items-center justify-center">
                <Hash className="w-5 h-5 text-chart-blue" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-chart-green border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-chart-green">Total Value</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(totals.value)}</p>
                <p className="text-xs text-chart-green">inventory value</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-chart-green/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-chart-green" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Results */}
      <Card className="border-border">
        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">Report Results</CardTitle>
            <span className="text-xs text-muted-foreground">{sortedData.length} groups found</span>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase pl-4">{primaryDimension}</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase text-center">Items</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase text-center">Quantity</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase text-center">Value</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase text-center">% of Total</TableHead>
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase text-right pr-4">Avg Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((row) => (
                <TableRow key={row.id} className="hover:bg-muted/20">
                  <TableCell className="text-sm font-medium text-foreground pl-4">{row.dimension}</TableCell>
                  <TableCell className="text-sm text-muted-foreground text-center">{row.items}</TableCell>
                  <TableCell className="text-sm font-semibold text-foreground text-center">{row.quantity}</TableCell>
                  <TableCell className="text-sm font-medium text-chart-green text-center">{formatCurrency(row.value)}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getProgressColor(row.percentOfTotal)} rounded-full`}
                          style={{ width: `${Math.min(row.percentOfTotal, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-10">{row.percentOfTotal}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-foreground text-right pr-4">{formatCurrency(row.avgCost)}</TableCell>
                </TableRow>
              ))}
              {/* Total Row */}
              <TableRow className="bg-primary/5 border-t-2 border-primary hover:bg-primary/5">
                <TableCell className="text-sm font-bold text-foreground pl-4">TOTAL</TableCell>
                <TableCell className="text-sm font-bold text-foreground text-center">{totals.items}</TableCell>
                <TableCell className="text-sm font-bold text-foreground text-center">{totals.quantity}</TableCell>
                <TableCell className="text-sm font-bold text-chart-green text-center">{formatCurrency(totals.value)}</TableCell>
                <TableCell className="text-sm font-bold text-foreground text-center">100%</TableCell>
                <TableCell className="text-sm text-muted-foreground text-right pr-4">-</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};