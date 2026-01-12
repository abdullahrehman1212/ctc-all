import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Users, Plus, Pencil, Trash2, MoreVertical, Save, RotateCcw, UserPlus, X } from "lucide-react";
import { toast } from "sonner";

interface Account {
  id: string;
  group: string;
  subGroup: string;
  code: string;
  name: string;
  status: "Active" | "Inactive";
  canDelete: boolean;
}

const mainGroupOptions = [
  "Current Assets",
  "Long Term Assets",
  "Current Liabilities",
  "Long Term Liabilities",
  "Capital",
  "Drawings",
  "Revenues",
  "Expenses",
  "Cost",
];

const subGroupMapping: Record<string, string[]> = {
  "Current Assets": ["101-Inventory", "102-Cash", "103-Bank", "104-Sales Customer Receivables", "108-BANK ACCOUNT"],
  "Long Term Assets": ["206-SHOP INVESTMENT"],
  "Current Liabilities": ["301-Purchase Orders Payables", "302-Purchase expenses Payables", "303-Salirys"],
  "Long Term Liabilities": ["304-Other Payables"],
  "Capital": ["501-Owner's Equity"],
  "Drawings": ["601-Owner Drawings"],
  "Revenues": ["701-Sales Revenue"],
  "Expenses": ["801-Operating Expenses"],
  "Cost": ["901-Cost of Goods Sold"],
};

const initialAccounts: Account[] = [];

export const AccountsTab = () => {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filterMainGroup, setFilterMainGroup] = useState<string>("all");
  const [filterSubGroup, setFilterSubGroup] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("active");
  const [pageSize, setPageSize] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);
  
  const [isAddAccountDialogOpen, setIsAddAccountDialogOpen] = useState(false);
  const [isAddPersonDialogOpen, setIsAddPersonDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  
  const [formData, setFormData] = useState({
    mainGroup: "",
    subGroup: "",
    name: "",
    description: "",
    accountName: "",
  });

  const filteredAccounts = accounts.filter((acc) => {
    const matchesGroup = filterMainGroup === "all" || acc.group.includes(filterMainGroup);
    const matchesSubGroup = filterSubGroup === "all" || acc.subGroup === filterSubGroup;
    const matchesStatus = filterStatus === "all" || acc.status.toLowerCase() === filterStatus;
    return matchesGroup && matchesSubGroup && matchesStatus;
  });

  const totalPages = Math.ceil(filteredAccounts.length / parseInt(pageSize));
  const paginatedAccounts = filteredAccounts.slice(
    (currentPage - 1) * parseInt(pageSize),
    currentPage * parseInt(pageSize)
  );

  const availableSubGroups = formData.mainGroup ? subGroupMapping[formData.mainGroup] || [] : [];

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(paginatedAccounts.map((a) => a.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    }
  };

  const handleAddAccount = () => {
    if (!formData.mainGroup || !formData.subGroup || !formData.name) {
      toast.error("Please fill all required fields");
      return;
    }
    const newCode = String(Math.max(...accounts.map((a) => parseInt(a.code))) + 1);
    const groupPrefix = mainGroupOptions.indexOf(formData.mainGroup) + 1;
    const newAccount: Account = {
      id: String(accounts.length + 1),
      group: `${groupPrefix}-${formData.mainGroup}`,
      subGroup: formData.subGroup,
      code: newCode,
      name: formData.name,
      status: "Active",
      canDelete: true,
    };
    setAccounts([...accounts, newAccount]);
    setIsAddAccountDialogOpen(false);
    resetForm();
    toast.success("Account added successfully!");
  };

  const handleAddPersonAccount = () => {
    if (!formData.mainGroup || !formData.subGroup || !formData.accountName) {
      toast.error("Please fill all required fields");
      return;
    }
    const newCode = String(Math.max(...accounts.map((a) => parseInt(a.code))) + 1);
    const groupPrefix = mainGroupOptions.indexOf(formData.mainGroup) + 1;
    const newAccount: Account = {
      id: String(accounts.length + 1),
      group: `${groupPrefix}-${formData.mainGroup}`,
      subGroup: formData.subGroup,
      code: newCode,
      name: formData.accountName,
      status: "Active",
      canDelete: true,
    };
    setAccounts([...accounts, newAccount]);
    setIsAddPersonDialogOpen(false);
    resetForm();
    toast.success("Person's account added successfully!");
  };

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
    const groupName = account.group.split("-").slice(1).join("-");
    setFormData({
      mainGroup: groupName,
      subGroup: account.subGroup,
      name: account.name,
      description: account.name,
      accountName: "",
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateAccount = () => {
    if (!editingAccount) return;
    const groupPrefix = mainGroupOptions.indexOf(formData.mainGroup) + 1;
    setAccounts(
      accounts.map((acc) =>
        acc.id === editingAccount.id
          ? {
              ...acc,
              group: `${groupPrefix}-${formData.mainGroup}`,
              subGroup: formData.subGroup,
              name: formData.name,
            }
          : acc
      )
    );
    setIsEditDialogOpen(false);
    setEditingAccount(null);
    resetForm();
    toast.success("Account updated successfully!");
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts(accounts.filter((acc) => acc.id !== id));
    toast.success("Account deleted successfully!");
  };

  const resetForm = () => {
    setFormData({
      mainGroup: "",
      subGroup: "",
      name: "",
      description: "",
      accountName: "",
    });
  };

  return (
    <>
      <Card className="border-border/50 shadow-sm transition-all duration-300 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-4 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-destructive" />
            <CardTitle className="text-lg font-semibold">Accounts</CardTitle>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              onClick={() => setIsAddAccountDialogOpen(true)}
              variant="outline"
              size="sm"
              className="transition-all duration-200 hover:scale-105"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add New Account
            </Button>
            <Button
              onClick={() => setIsAddPersonDialogOpen(true)}
              variant="outline"
              size="sm"
              className="transition-all duration-200 hover:scale-105"
            >
              <UserPlus className="h-4 w-4 mr-1" />
              Add New Person's Account
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card border-border z-50">
                <DropdownMenuItem>Export to CSV</DropdownMenuItem>
                <DropdownMenuItem>Print List</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Main Group</Label>
              <Select value={filterMainGroup} onValueChange={setFilterMainGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  <SelectItem value="all">All Groups</SelectItem>
                  {mainGroupOptions.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Sub Group</Label>
              <Select value={filterSubGroup} onValueChange={setFilterSubGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  <SelectItem value="all">All Subgroups</SelectItem>
                  {Object.values(subGroupMapping).flat().map((sg) => (
                    <SelectItem key={sg} value={sg}>
                      {sg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-3 text-left w-12">
                    <Checkbox
                      checked={selectedItems.length === paginatedAccounts.length && paginatedAccounts.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </th>
                  <th className="p-3 text-left w-12"></th>
                  <th className="p-3 text-left font-medium text-primary underline cursor-pointer hover:text-primary/80 transition-colors">
                    Group
                  </th>
                  <th className="p-3 text-left font-medium text-primary underline cursor-pointer hover:text-primary/80 transition-colors">
                    Sub Group
                  </th>
                  <th className="p-3 text-left font-medium text-primary underline cursor-pointer hover:text-primary/80 transition-colors">
                    Code
                  </th>
                  <th className="p-3 text-left font-medium text-primary underline cursor-pointer hover:text-primary/80 transition-colors">
                    Name
                  </th>
                  <th className="p-3 text-left font-medium text-primary underline cursor-pointer hover:text-primary/80 transition-colors">
                    Status
                  </th>
                  <th className="p-3 text-left font-medium text-primary underline cursor-pointer hover:text-primary/80 transition-colors">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedAccounts.map((account, index) => (
                  <tr
                    key={account.id}
                    className={`border-b border-border/50 transition-colors duration-200 hover:bg-muted/30 ${
                      index % 2 === 0 ? "bg-muted/10" : ""
                    }`}
                  >
                    <td className="p-3">
                      <Checkbox
                        checked={selectedItems.includes(account.id)}
                        onCheckedChange={(checked) =>
                          handleSelectItem(account.id, checked as boolean)
                        }
                      />
                    </td>
                    <td className="p-3">
                      <div className="w-3 h-3 rounded-full bg-success"></div>
                    </td>
                    <td className="p-3 text-primary font-medium">{account.group}</td>
                    <td className="p-3 text-primary font-medium">{account.subGroup}</td>
                    <td className="p-3 font-medium">{account.code}</td>
                    <td className="p-3 text-primary font-medium">{account.name}</td>
                    <td className="p-3">
                      <Badge
                        variant="outline"
                        className={`${
                          account.status === "Active"
                            ? "text-success border-success/30 bg-success/10"
                            : "text-muted-foreground border-border"
                        } transition-all duration-200`}
                      >
                        {account.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditAccount(account)}
                          className="text-primary hover:text-primary/80 transition-colors"
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        {account.canDelete && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAccount(account.id)}
                            className="text-destructive hover:text-destructive/80 transition-colors"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card border-border z-50">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>View Transactions</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
            <p className="text-sm text-muted-foreground">
              Showing <span className="text-primary">1</span> to{" "}
              <span className="text-primary">{Math.min(parseInt(pageSize), filteredAccounts.length)}</span> of{" "}
              <span className="text-primary">{filteredAccounts.length}</span> items
            </p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                  className="transition-all duration-200"
                >
                  {"<<"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="transition-all duration-200"
                >
                  {"<"}
                </Button>
                {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="transition-all duration-200"
                  >
                    {page}
                  </Button>
                ))}
                {totalPages > 3 && <span className="px-2">...</span>}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="transition-all duration-200"
                >
                  {">"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  className="transition-all duration-200"
                >
                  {">>"}
                </Button>
              </div>
              <Select value={pageSize} onValueChange={setPageSize}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Account Dialog */}
      <Dialog open={isAddAccountDialogOpen} onOpenChange={setIsAddAccountDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Main group</Label>
              <Select
                value={formData.mainGroup}
                onValueChange={(value) => setFormData({ ...formData, mainGroup: value, subGroup: "" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  {mainGroupOptions.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sub group</Label>
              <Select
                value={formData.subGroup}
                onValueChange={(value) => setFormData({ ...formData, subGroup: value })}
                disabled={!formData.mainGroup}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  {availableSubGroups.map((sg) => (
                    <SelectItem key={sg} value={sg}>
                      {sg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Account Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter account name"
              />
            </div>
            <div className="space-y-2">
              <Label>description</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description"
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={resetForm}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
            <Button onClick={handleAddAccount}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </DialogFooter>
          <Button
            variant="link"
            onClick={() => setIsAddAccountDialogOpen(false)}
            className="text-primary absolute bottom-4 right-4"
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>

      {/* Add Person's Account Dialog */}
      <Dialog open={isAddPersonDialogOpen} onOpenChange={setIsAddPersonDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Person's Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Main group</Label>
              <Select
                value={formData.mainGroup}
                onValueChange={(value) => setFormData({ ...formData, mainGroup: value, subGroup: "", accountName: "" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  {mainGroupOptions.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sub group</Label>
              <Select
                value={formData.subGroup}
                onValueChange={(value) => setFormData({ ...formData, subGroup: value })}
                disabled={!formData.mainGroup}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  {availableSubGroups.map((sg) => (
                    <SelectItem key={sg} value={sg}>
                      {sg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Account name</Label>
              <Select
                value={formData.accountName}
                onValueChange={(value) => setFormData({ ...formData, accountName: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  <SelectItem value="Customer A">Customer A</SelectItem>
                  <SelectItem value="Supplier B">Supplier B</SelectItem>
                  <SelectItem value="Employee C">Employee C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>description</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description"
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={resetForm}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
            <Button onClick={handleAddPersonAccount}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </DialogFooter>
          <Button
            variant="link"
            onClick={() => setIsAddPersonDialogOpen(false)}
            className="text-primary absolute bottom-4 right-4"
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>

      {/* Edit Account Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Pencil className="h-5 w-5 text-primary" />
              <div>
                <DialogTitle>Editing Account: {editingAccount?.name}</DialogTitle>
                <p className="text-sm text-muted-foreground">Account Code: {editingAccount?.code}</p>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Main group</Label>
              <div className="flex gap-2">
                <Select
                  value={formData.mainGroup}
                  onValueChange={(value) => setFormData({ ...formData, mainGroup: value, subGroup: "" })}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border z-50">
                    {mainGroupOptions.map((group) => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setFormData({ ...formData, mainGroup: "" })}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Sub group</Label>
              <Select
                value={formData.subGroup}
                onValueChange={(value) => setFormData({ ...formData, subGroup: value })}
                disabled={!formData.mainGroup}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent className="bg-card border-border z-50">
                  {availableSubGroups.map((sg) => (
                    <SelectItem key={sg} value={sg}>
                      {sg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Account Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter account name"
              />
            </div>
            <div className="space-y-2">
              <Label>description</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter description"
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={resetForm}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
            <Button onClick={handleUpdateAccount}>
              <Save className="h-4 w-4 mr-1" />
              Update
            </Button>
          </DialogFooter>
          <Button
            variant="ghost"
            onClick={() => setIsEditDialogOpen(false)}
            className="text-muted-foreground mt-2"
          >
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};
