import { useState } from "react";
import { 
  Search, 
  Calendar, 
  FileText, 
  FileSpreadsheet,
  Package
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface StockItem {
  id: string;
  srNo: number;
  oemPartNo: string;
  name: string;
  brand: string;
  model: string;
  uom: string;
  qty: number;
  type: "in" | "out";
  store: string;
  rack: string;
  shelf: string;
}

const sampleItems: StockItem[] = [];

const categories = ["All Categories", "Engine Parts", "Brake System", "Electrical", "Suspension", "Transmission"];
const subCategories = ["All Sub Categories", "Filters", "Belts", "Bearings", "Gaskets", "Sensors"];

export const StockInOut = () => {
  const [items] = useState<StockItem[]>(sampleItems);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [item, setItem] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const currentItems = items.slice(startIndex, endIndex);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(currentItems.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Package className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Inventory Stock</h2>
          <p className="text-sm text-muted-foreground">View and manage stock in/out movements</p>
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-card border border-border rounded-lg p-4 md:p-6 space-y-4">
        {/* Filter Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Category</label>
            <SearchableSelect
              options={categories.map(cat => ({ value: cat, label: cat }))}
              value={category}
              onValueChange={setCategory}
              placeholder="Select..."
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Sub Category</label>
            <SearchableSelect
              options={subCategories.map(sub => ({ value: sub, label: sub }))}
              value={subCategory}
              onValueChange={setSubCategory}
              placeholder="Select..."
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Item</label>
            <SearchableSelect
              options={sampleItems.slice(0, 5).map(i => ({ value: i.id, label: i.name }))}
              value={item}
              onValueChange={setItem}
              placeholder="Select..."
            />
          </div>
        </div>

        {/* Filter Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">From Date</label>
            <div className="relative">
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="h-10 bg-background pr-10"
                placeholder="dd/mm/yyyy"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">To Date</label>
            <div className="relative">
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="h-10 bg-background pr-10"
                placeholder="dd/mm/yyyy"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-2">
          <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Search className="w-4 h-4" />
            Search
          </Button>
          <Button variant="outline" className="gap-2 border-primary text-primary hover:bg-primary/10 hover:text-primary">
            <FileText className="w-4 h-4" />
            Print Report
          </Button>
          <Button variant="outline" className="gap-2 border-chart-green text-chart-green hover:bg-chart-green/10 hover:text-chart-green">
            <FileSpreadsheet className="w-4 h-4" />
            Print Excel
          </Button>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-card border border-border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedItems.length === currentItems.length && currentItems.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="text-xs font-semibold text-foreground whitespace-nowrap">Sr. No</TableHead>
              <TableHead className="text-xs font-semibold text-foreground whitespace-nowrap">OEM/ Part No</TableHead>
              <TableHead className="text-xs font-semibold text-foreground whitespace-nowrap">Name</TableHead>
              <TableHead className="text-xs font-semibold text-foreground whitespace-nowrap">Brand</TableHead>
              <TableHead className="text-xs font-semibold text-foreground whitespace-nowrap">Model</TableHead>
              <TableHead className="text-xs font-semibold text-foreground whitespace-nowrap">Uom</TableHead>
              <TableHead className="text-xs font-semibold text-foreground whitespace-nowrap text-center">Qty</TableHead>
              <TableHead className="text-xs font-semibold text-foreground whitespace-nowrap">Store</TableHead>
              <TableHead className="text-xs font-semibold text-foreground whitespace-nowrap">Racks</TableHead>
              <TableHead className="text-xs font-semibold text-foreground whitespace-nowrap">Shelf</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((stockItem) => (
              <TableRow 
                key={stockItem.id} 
                className={cn(
                  "hover:bg-muted/30 transition-colors",
                  selectedItems.includes(stockItem.id) && "bg-primary/5"
                )}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedItems.includes(stockItem.id)}
                    onCheckedChange={(checked) => handleSelectItem(stockItem.id, !!checked)}
                  />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{stockItem.srNo}</TableCell>
                <TableCell className="text-sm font-medium text-foreground whitespace-nowrap">{stockItem.oemPartNo}</TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{stockItem.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{stockItem.brand}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{stockItem.model}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{stockItem.uom}</TableCell>
                <TableCell className={cn(
                  "text-sm font-semibold text-center",
                  stockItem.type === "in" ? "text-green-600" : "text-red-600"
                )}>
                  {stockItem.type === "in" ? `+${stockItem.qty}` : `-${stockItem.qty}`}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{stockItem.store}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{stockItem.rack}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{stockItem.shelf}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-border bg-muted/20">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {endIndex} of {totalItems} Records
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(1)}
              disabled={currentPage === 1}
              className="h-8 px-3"
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 px-3"
            >
              Prev
            </Button>
            <div className="flex items-center gap-1">
              <Input
                type="number"
                value={currentPage}
                onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                className="w-12 h-8 text-center text-sm"
                min={1}
                max={totalPages}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-8 px-3"
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => goToPage(totalPages)}
              disabled={currentPage === totalPages}
              className="h-8 px-3"
            >
              Last
            </Button>
            <Select value={itemsPerPage.toString()} onValueChange={(v) => { setItemsPerPage(Number(v)); setCurrentPage(1); }}>
              <SelectTrigger className="w-16 h-8">
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
