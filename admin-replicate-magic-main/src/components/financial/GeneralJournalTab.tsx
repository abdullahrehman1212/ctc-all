import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, ArrowUpDown, Search, Calendar, Filter } from "lucide-react";

interface JournalEntry {
  id: number;
  tId: number;
  voucherNo: string;
  date: string;
  account: string;
  description: string;
  debit: number;
  credit: number;
}

// Journal entries data - starts empty
const sampleEntries: JournalEntry[] = [];

export const GeneralJournalTab = () => {
  const [searchType, setSearchType] = useState("voucher");
  const [searchValue, setSearchValue] = useState("");
  const [fromDate, setFromDate] = useState("2025-12-01");
  const [toDate, setToDate] = useState("2025-12-26");
  const [entries, setEntries] = useState<JournalEntry[]>(sampleEntries);
  const [sortField, setSortField] = useState<keyof JournalEntry | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-PK');
  };

  const totalDebit = entries.reduce((sum, entry) => sum + entry.debit, 0);
  const totalCredit = entries.reduce((sum, entry) => sum + entry.credit, 0);


  const handleSort = (field: keyof JournalEntry) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortableHeader = ({ field, children }: { field: keyof JournalEntry; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 font-semibold text-primary hover:text-primary/80 transition-colors border-b-2 border-primary/30 hover:border-primary pb-1"
    >
      {children}
      <ArrowUpDown className="h-3 w-3 opacity-50" />
    </button>
  );

  return (
    <Card className="shadow-lg border-0 bg-card">
      <CardHeader className="pb-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            General Journal
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="px-3 py-1 bg-muted rounded-full">
              {entries.length} entries
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Enhanced Filters */}
        <div className="bg-muted/30 p-4 rounded-xl space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
            <Filter className="h-4 w-4" />
            Filters
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">Search By</Label>
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger className="w-40 bg-background">
                  <SelectValue placeholder="Search by" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="voucher">Voucher No</SelectItem>
                  <SelectItem value="account">Account</SelectItem>
                  <SelectItem value="description">Description</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[200px] space-y-2">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search entries..."
                  className="pl-10 bg-background"
                />
              </div>
            </div>
            <Button className="gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>

          <div className="flex flex-wrap items-end gap-4 pt-2 border-t border-border/30">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Calendar className="h-4 w-4" />
              Date Range
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">From</Label>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="w-44 bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">To</Label>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-44 bg-background"
              />
            </div>
          </div>
        </div>

        {/* Enhanced Table */}
        <div className="border border-border/50 rounded-xl overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-20">
                  <SortableHeader field="tId">T_Id</SortableHeader>
                </TableHead>
                <TableHead className="w-28">
                  <SortableHeader field="voucherNo">Voucher No</SortableHeader>
                </TableHead>
                <TableHead className="w-28">
                  <SortableHeader field="date">Date</SortableHeader>
                </TableHead>
                <TableHead className="w-48">
                  <SortableHeader field="account">Account</SortableHeader>
                </TableHead>
                <TableHead>
                  <SortableHeader field="description">Description</SortableHeader>
                </TableHead>
                <TableHead className="w-32 text-right">
                  <SortableHeader field="debit">Debit</SortableHeader>
                </TableHead>
                <TableHead className="w-32 text-right">
                  <SortableHeader field="credit">Credit</SortableHeader>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry, index) => (
                <TableRow 
                  key={entry.id} 
                  className={`
                    transition-colors hover:bg-muted/40
                    ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}
                  `}
                >
                  <TableCell className="font-medium text-foreground">{entry.tId}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm font-medium">
                      {entry.voucherNo}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{entry.date}</TableCell>
                  <TableCell className="font-medium text-foreground">{entry.account}</TableCell>
                  <TableCell className="max-w-md text-muted-foreground">
                    <span className="line-clamp-2">{entry.description}</span>
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold">
                    <span className={entry.debit > 0 ? "text-orange-500" : "text-muted-foreground/50"}>
                      {entry.debit > 0 ? formatNumber(entry.debit) : "0"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono font-semibold">
                    <span className={entry.credit > 0 ? "text-blue-500" : "text-muted-foreground/50"}>
                      {entry.credit > 0 ? formatNumber(entry.credit) : "0"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {/* Total Row */}
              <TableRow className="bg-muted/60 border-t-2 border-border font-bold hover:bg-muted/60">
                <TableCell colSpan={5} className="text-right text-base py-4">
                  Total
                </TableCell>
                <TableCell className="text-right font-mono text-base py-4">
                  <span className="text-orange-500">{formatNumber(totalDebit)}</span>
                </TableCell>
                <TableCell className="text-right font-mono text-base py-4">
                  <span className="text-blue-500">{formatNumber(totalCredit)}</span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Enhanced Pagination */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">
            Showing <span className="font-medium text-foreground">1</span> to{" "}
            <span className="font-medium text-foreground">{entries.length}</span> of{" "}
            <span className="font-medium text-foreground">{entries.length}</span> entries
          </span>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Rows per page:</span>
            <Select defaultValue="10">
              <SelectTrigger className="w-20 bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};