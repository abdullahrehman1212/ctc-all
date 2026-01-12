import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Users } from "lucide-react";

interface IncomeAccount {
  code: string;
  name: string;
  amount: number;
  isSubgroup?: boolean;
  isTotalRow?: boolean;
  level?: number;
}

// Sample income statement data
const revenueAccounts: IncomeAccount[] = [
  { code: "701001", name: "Goods Sold", amount: 0, level: 0 },
  { code: "701002", name: "Goods Sold (Discounts)", amount: 0, level: 0 },
];

const costAccounts: IncomeAccount[] = [
  { code: "901001", name: "Cost Inventory", amount: 0, level: 0 },
  { code: "901002", name: "Cost Inventory (Discounts)", amount: 0, level: 0 },
];

const expenseAccounts: IncomeAccount[] = [
  { code: "801002", name: "Purchase Tax Expense", amount: 0, level: 0 },
  { code: "801014", name: "Dispose Inventory", amount: 0, level: 0 },
];

export const IncomeStatementReport = () => {
  const [fromDate, setFromDate] = useState("2025-12-01");
  const [toDate, setToDate] = useState("2025-12-26");

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-PK');
  };

  // Calculate totals
  const totalRevenue = revenueAccounts.reduce((sum, acc) => sum + acc.amount, 0);
  const totalCost = costAccounts.reduce((sum, acc) => sum + acc.amount, 0);
  const grossProfit = totalRevenue - totalCost;
  const totalExpenses = expenseAccounts.reduce((sum, acc) => sum + acc.amount, 0);
  const netIncome = grossProfit - totalExpenses;

  const getIndent = (level: number = 0) => {
    return { paddingLeft: `${(level + 1) * 16}px` };
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5 text-destructive" />
          Income Statement
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

        {/* Income Statement Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableBody>
              {/* Header */}
              <TableRow className="bg-muted/50">
                <TableCell className="font-semibold underline w-3/4">Account</TableCell>
                <TableCell className="font-semibold underline text-right">Amount</TableCell>
              </TableRow>

              {/* Revenue Section */}
              {revenueAccounts.map((account, index) => (
                <TableRow key={`rev-${index}`} className="hover:bg-muted/30">
                  <TableCell style={getIndent(account.level || 0)}>
                    {account.code}-{account.name}
                  </TableCell>
                  <TableCell className="text-right">{formatNumber(account.amount)}</TableCell>
                </TableRow>
              ))}
              
              {/* Total Revenue */}
              <TableRow className="bg-muted/20">
                <TableCell className="text-right font-semibold">Total Revenue</TableCell>
                <TableCell className="text-right font-semibold">{formatNumber(totalRevenue)}</TableCell>
              </TableRow>

              {/* Empty row for spacing */}
              <TableRow><TableCell colSpan={2} className="py-2"></TableCell></TableRow>

              {/* Cost of Goods Sold Section */}
              {costAccounts.map((account, index) => (
                <TableRow key={`cost-${index}`} className="hover:bg-muted/30">
                  <TableCell style={getIndent(account.level || 0)}>
                    {account.code}-{account.name}
                  </TableCell>
                  <TableCell className="text-right">{formatNumber(account.amount)}</TableCell>
                </TableRow>
              ))}

              {/* Total Cost */}
              <TableRow className="bg-muted/20">
                <TableCell className="text-right font-semibold">Total Cost</TableCell>
                <TableCell className="text-right font-semibold">{formatNumber(totalCost)}</TableCell>
              </TableRow>

              {/* Gross Profit/Loss */}
              <TableRow className="bg-muted/30">
                <TableCell className="text-right font-bold">
                  {grossProfit >= 0 ? 'Gross Profit' : 'Gross Loss'}
                </TableCell>
                <TableCell className={`text-right font-bold ${grossProfit >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                  {formatNumber(Math.abs(grossProfit))}
                </TableCell>
              </TableRow>

              {/* Empty row for spacing */}
              <TableRow><TableCell colSpan={2} className="py-2"></TableCell></TableRow>

              {/* Operating Expenses Section */}
              {expenseAccounts.map((account, index) => (
                <TableRow key={`exp-${index}`} className="hover:bg-muted/30">
                  <TableCell style={getIndent(account.level || 0)}>
                    {account.code}-{account.name}
                  </TableCell>
                  <TableCell className="text-right">{formatNumber(account.amount)}</TableCell>
                </TableRow>
              ))}

              {/* Total Expenses */}
              <TableRow className="bg-muted/20">
                <TableCell className="text-right font-semibold">Total Expenses</TableCell>
                <TableCell className="text-right font-semibold">{formatNumber(totalExpenses)}</TableCell>
              </TableRow>

              {/* Net Income/Loss */}
              <TableRow className="bg-primary/10 border-t-2 border-primary">
                <TableCell className="text-right font-bold text-lg">
                  {netIncome >= 0 ? 'Net Income' : 'Net Loss'}
                </TableCell>
                <TableCell className={`text-right font-bold text-lg ${netIncome >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                  {formatNumber(Math.abs(netIncome))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-muted/30 border">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-xl font-bold">Rs {formatNumber(totalRevenue)}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/30 border">
            <p className="text-sm text-muted-foreground">Total Cost</p>
            <p className="text-xl font-bold">Rs {formatNumber(totalCost)}</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/30 border">
            <p className="text-sm text-muted-foreground">Gross {grossProfit >= 0 ? 'Profit' : 'Loss'}</p>
            <p className={`text-xl font-bold ${grossProfit >= 0 ? 'text-green-600' : 'text-destructive'}`}>
              Rs {formatNumber(Math.abs(grossProfit))}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-muted/30 border">
            <p className="text-sm text-muted-foreground">Net {netIncome >= 0 ? 'Income' : 'Loss'}</p>
            <p className={`text-xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-destructive'}`}>
              Rs {formatNumber(Math.abs(netIncome))}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
