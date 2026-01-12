import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, Printer, TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";

interface IncomeCategory {
  name: string;
  items: { name: string; amount: number }[];
}

const revenueData: IncomeCategory[] = [];

const expenseData: IncomeCategory[] = [];

export const IncomeStatementTab = () => {
  const [period, setPeriod] = useState("december-2024");
  const [expandedRevenue, setExpandedRevenue] = useState<string[]>(["Operating Revenue", "Other Income"]);
  const [expandedExpenses, setExpandedExpenses] = useState<string[]>(["Cost of Goods Sold", "Operating Expenses", "Financial Expenses"]);

  const toggleRevenue = (name: string) => {
    setExpandedRevenue(prev => 
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const toggleExpense = (name: string) => {
    setExpandedExpenses(prev => 
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const totalRevenue = revenueData.reduce((sum, cat) => 
    sum + cat.items.reduce((s, item) => s + item.amount, 0), 0
  );

  const totalExpenses = expenseData.reduce((sum, cat) => 
    sum + cat.items.reduce((s, item) => s + item.amount, 0), 0
  );

  const grossProfit = (revenueData[0]?.items?.reduce((s, item) => s + item.amount, 0) || 0) - 
    (expenseData[0]?.items?.reduce((s, item) => s + item.amount, 0) || 0);

  const operatingIncome = grossProfit - (expenseData[1]?.items?.reduce((s, item) => s + item.amount, 0) || 0);

  const netIncome = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? ((netIncome / totalRevenue) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">Rs {totalRevenue.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">Rs {totalExpenses.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${netIncome >= 0 ? 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/20' : 'from-orange-500/10 to-orange-600/5 border-orange-500/20'} transition-all duration-300 hover:shadow-lg hover:scale-[1.02]`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Income</p>
                <p className={`text-2xl font-bold ${netIncome >= 0 ? 'text-emerald-600' : 'text-orange-600'}`}>
                  Rs {netIncome.toLocaleString()}
                </p>
              </div>
              <div className={`h-12 w-12 rounded-full ${netIncome >= 0 ? 'bg-emerald-500/20' : 'bg-orange-500/20'} flex items-center justify-center`}>
                <DollarSign className={`h-6 w-6 ${netIncome >= 0 ? 'text-emerald-600' : 'text-orange-600'}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Profit Margin</p>
                <p className="text-2xl font-bold text-purple-600">{profitMargin}%</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <PieChart className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Income Statement */}
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Income Statement
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Profit & Loss Statement</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-[180px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Select Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="december-2024">December 2024</SelectItem>
                  <SelectItem value="q4-2024">Q4 2024</SelectItem>
                  <SelectItem value="fy-2024">FY 2024</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="transition-all duration-200 hover:scale-105">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm" className="transition-all duration-200 hover:scale-105">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Revenue Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-green-600 border-b border-green-500/20 pb-2">Revenue</h3>
            {revenueData.map((category) => (
              <Collapsible 
                key={category.name} 
                open={expandedRevenue.includes(category.name)}
                onOpenChange={() => toggleRevenue(category.name)}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-all duration-200">
                  <div className="flex items-center gap-2">
                    {expandedRevenue.includes(category.name) ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <span className="font-semibold text-green-600">
                    Rs {category.items.reduce((s, item) => s + item.amount, 0).toLocaleString()}
                  </span>
                </CollapsibleTrigger>
                <CollapsibleContent className="animate-accordion-down">
                  <div className="pl-8 pr-4 py-2 space-y-2">
                    {category.items.map((item) => (
                      <div key={item.name} className="flex justify-between text-sm py-1 border-b border-border/30">
                        <span className="text-muted-foreground">{item.name}</span>
                        <span className="font-mono">Rs {item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
            <div className="flex justify-between p-3 bg-green-500/10 rounded-lg font-semibold">
              <span>Total Revenue</span>
              <span className="text-green-600">Rs {totalRevenue.toLocaleString()}</span>
            </div>
          </div>

          {/* Expenses Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-red-600 border-b border-red-500/20 pb-2">Expenses</h3>
            {expenseData.map((category) => (
              <Collapsible 
                key={category.name} 
                open={expandedExpenses.includes(category.name)}
                onOpenChange={() => toggleExpense(category.name)}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-all duration-200">
                  <div className="flex items-center gap-2">
                    {expandedExpenses.includes(category.name) ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <span className="font-semibold text-red-600">
                    Rs {category.items.reduce((s, item) => s + item.amount, 0).toLocaleString()}
                  </span>
                </CollapsibleTrigger>
                <CollapsibleContent className="animate-accordion-down">
                  <div className="pl-8 pr-4 py-2 space-y-2">
                    {category.items.map((item) => (
                      <div key={item.name} className="flex justify-between text-sm py-1 border-b border-border/30">
                        <span className="text-muted-foreground">{item.name}</span>
                        <span className="font-mono">Rs {item.amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
            <div className="flex justify-between p-3 bg-red-500/10 rounded-lg font-semibold">
              <span>Total Expenses</span>
              <span className="text-red-600">Rs {totalExpenses.toLocaleString()}</span>
            </div>
          </div>

          {/* Summary Section */}
          <div className="space-y-3 pt-4 border-t-2 border-primary/20">
            <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
              <span className="font-medium">Gross Profit</span>
              <span className="font-semibold text-blue-600">Rs {grossProfit.toLocaleString()}</span>
            </div>
            <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
              <span className="font-medium">Operating Income</span>
              <span className="font-semibold text-purple-600">Rs {operatingIncome.toLocaleString()}</span>
            </div>
            <div className={`flex justify-between p-4 rounded-lg font-bold text-lg ${netIncome >= 0 ? 'bg-emerald-500/20 text-emerald-700' : 'bg-red-500/20 text-red-700'}`}>
              <span>Net Income</span>
              <span>Rs {netIncome.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
