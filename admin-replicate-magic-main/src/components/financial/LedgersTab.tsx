import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Users } from "lucide-react";

interface LedgerEntry {
  id: number;
  tId: number | null;
  voucherNo: string;
  timeStamp: string;
  description: string;
  debit: number | null;
  credit: number | null;
  balance: number;
}

// Sample ledger data
const sampleLedgerEntries: LedgerEntry[] = [
  { id: 1, tId: null, voucherNo: "-", timeStamp: "-", description: "Opening Balance", debit: null, credit: null, balance: 0 },
];

const mainGroups = [
  { id: "1", name: "1-Current Assets" },
  { id: "2", name: "2-Long Term Assets" },
  { id: "3", name: "3-Current Liabilities" },
  { id: "4", name: "4-Long Term Liabilities" },
  { id: "5", name: "5-Equity" },
  { id: "7", name: "7-Revenue" },
  { id: "8", name: "8-Expenses" },
  { id: "9", name: "9-Cost of Goods Sold" },
];

const subGroups = [
  { id: "101", name: "101-Inventory", mainGroup: "1" },
  { id: "102", name: "102-Cash", mainGroup: "1" },
  { id: "103", name: "103-Bank", mainGroup: "1" },
  { id: "104", name: "104-Sales Customer Receivables", mainGroup: "1" },
  { id: "301", name: "301-Purchase Orders Payables", mainGroup: "3" },
  { id: "302", name: "302-Purchase expenses Payables", mainGroup: "3" },
  { id: "501", name: "501-Owner Equity", mainGroup: "5" },
];

const accounts = [
  { id: "101001", name: "101001-Inventory", subGroup: "101" },
  { id: "102008", name: "102008-cash", subGroup: "102" },
  { id: "103015", name: "103015-JAZCASH", subGroup: "103" },
  { id: "104042", name: "104042-ammar", subGroup: "104" },
  { id: "301158", name: "301158-sakhawat", subGroup: "301" },
  { id: "302006", name: "302006-SHIPPING ACCOUNT", subGroup: "302" },
  { id: "501003", name: "501003-OWNER CAPITAL", subGroup: "501" },
];

export const LedgersTab = () => {
  const [selectedMainGroup, setSelectedMainGroup] = useState("");
  const [selectedSubGroup, setSelectedSubGroup] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [fromDate, setFromDate] = useState("2025-12-01");
  const [toDate, setToDate] = useState("2025-12-26");
  const [entries, setEntries] = useState<LedgerEntry[]>(sampleLedgerEntries);
  const [selectedEntries, setSelectedEntries] = useState<number[]>([]);

  const filteredSubGroups = selectedMainGroup 
    ? subGroups.filter(sg => sg.mainGroup === selectedMainGroup)
    : subGroups;

  const filteredAccounts = selectedSubGroup 
    ? accounts.filter(acc => acc.subGroup === selectedSubGroup)
    : accounts;

  const formatNumber = (num: number | null) => {
    if (num === null) return "-";
    return num.toLocaleString('en-PK');
  };

  const toggleSelectAll = () => {
    if (selectedEntries.length === entries.length) {
      setSelectedEntries([]);
    } else {
      setSelectedEntries(entries.map(e => e.id));
    }
  };

  const toggleEntry = (id: number) => {
    setSelectedEntries(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSearch = () => {
    // In real implementation, this would fetch data based on filters
    console.log("Searching with filters:", { selectedMainGroup, selectedSubGroup, selectedAccount, fromDate, toDate });
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-destructive" />
          Ledgers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Main Group</Label>
            <Select value={selectedMainGroup} onValueChange={(val) => {
              setSelectedMainGroup(val);
              setSelectedSubGroup("");
              setSelectedAccount("");
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {mainGroups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Sub Group</Label>
            <Select value={selectedSubGroup} onValueChange={(val) => {
              setSelectedSubGroup(val);
              setSelectedAccount("");
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {filteredSubGroups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Account</Label>
            <Select value={selectedAccount} onValueChange={setSelectedAccount}>
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {filteredAccounts.map((acc) => (
                  <SelectItem key={acc.id} value={acc.id}>
                    {acc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-2">
            <Label>From</Label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-40"
            />
          </div>
          <div className="space-y-2">
            <Label>To</Label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-40"
            />
          </div>
          <Button onClick={handleSearch}>Search</Button>
        </div>

        {/* Ledger Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectedEntries.length === entries.length && entries.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead className="font-semibold underline">T_Id</TableHead>
                <TableHead className="font-semibold underline">Voucher No</TableHead>
                <TableHead className="font-semibold underline">Time Stamp</TableHead>
                <TableHead className="font-semibold underline">Description</TableHead>
                <TableHead className="font-semibold underline text-right">Dr</TableHead>
                <TableHead className="font-semibold underline text-right">Cr</TableHead>
                <TableHead className="font-semibold underline text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id} className="hover:bg-muted/30">
                  <TableCell>
                    <Checkbox 
                      checked={selectedEntries.includes(entry.id)}
                      onCheckedChange={() => toggleEntry(entry.id)}
                    />
                  </TableCell>
                  <TableCell>{entry.tId ?? "-"}</TableCell>
                  <TableCell>{entry.voucherNo}</TableCell>
                  <TableCell>{entry.timeStamp}</TableCell>
                  <TableCell>{entry.description}</TableCell>
                  <TableCell className="text-right">{formatNumber(entry.debit)}</TableCell>
                  <TableCell className="text-right">{formatNumber(entry.credit)}</TableCell>
                  <TableCell className="text-right font-medium">{formatNumber(entry.balance)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Info */}
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Showing 1 to {entries.length} of {entries.length} items</span>
          <Select defaultValue="10">
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
