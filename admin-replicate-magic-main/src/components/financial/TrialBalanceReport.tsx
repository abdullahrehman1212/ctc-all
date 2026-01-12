import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users } from "lucide-react";

interface TrialBalanceAccount {
  code: string;
  name: string;
  debit: number;
  credit: number;
  isSubgroup?: boolean;
  level?: number;
}

// Trial balance data - starts empty
const trialBalanceData: TrialBalanceAccount[] = [];

export const TrialBalanceReport = () => {
  const [fromDate, setFromDate] = useState("2025-12-01");
  const [toDate, setToDate] = useState("2025-12-26");

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-PK');
  };

  // Calculate totals
  const totalDebit = trialBalanceData.reduce((sum, acc) => sum + acc.debit, 0);
  const totalCredit = trialBalanceData.reduce((sum, acc) => sum + acc.credit, 0);

  const getIndent = (level: number = 0) => {
    return { paddingLeft: `${(level + 1) * 16}px` };
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-destructive" />
          Trial Balance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filter */}
        <div>
          <p className="text-sm font-medium mb-2">Filter</p>
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
          </div>
        </div>

        {/* Trial Balance Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold underline w-1/2">Account</TableHead>
                <TableHead className="font-semibold underline text-right">Dr</TableHead>
                <TableHead className="font-semibold underline text-right">Cr</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trialBalanceData.map((account, index) => (
                <TableRow 
                  key={index} 
                  className={`${account.isSubgroup ? 'bg-muted/20' : 'hover:bg-muted/30'}`}
                >
                  <TableCell 
                    className={account.isSubgroup ? 'font-medium' : ''}
                    style={getIndent(account.level || 0)}
                  >
                    {account.code}-{account.name}
                  </TableCell>
                  <TableCell className="text-right text-primary">
                    {account.isSubgroup ? '' : formatNumber(account.debit)}
                  </TableCell>
                  <TableCell className="text-right text-primary">
                    {account.isSubgroup ? '' : formatNumber(account.credit)}
                  </TableCell>
                </TableRow>
              ))}
              {/* Total Row */}
              <TableRow className="bg-muted/40 font-bold">
                <TableCell className="text-right">Total</TableCell>
                <TableCell className="text-right">{formatNumber(totalDebit)}</TableCell>
                <TableCell className="text-right">{formatNumber(totalCredit)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Balance Check */}
        <div className={`p-4 rounded-lg ${totalDebit === totalCredit ? 'bg-green-500/10 border border-green-500/30' : 'bg-destructive/10 border border-destructive/30'}`}>
          <p className={`font-medium ${totalDebit === totalCredit ? 'text-green-600' : 'text-destructive'}`}>
            {totalDebit === totalCredit 
              ? '✓ Trial Balance is balanced - Debits equal Credits'
              : `⚠ Trial Balance is not balanced - Difference: Rs ${formatNumber(Math.abs(totalDebit - totalCredit))}`
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
