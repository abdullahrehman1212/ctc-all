import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  X,
  Save,
  RotateCcw,
  Calendar,
  ArrowLeft,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DirectPurchaseOrderItem {
  id: string;
  partNo: string;
  description: string;
  brand: string;
  uom: string;
  quantity: number;
  purchasePrice: number;
  salePrice: number;
  amount: number;
  rack: string;
  shelf: string;
}

interface DirectPurchaseOrder {
  id: string;
  dpoNo: string;
  store: string;
  requestDate: string;
  description: string;
  grandTotal: number;
  status: "Draft" | "Completed" | "Cancelled";
  items: DirectPurchaseOrderItem[];
  account: string;
}

interface Rack {
  id: string;
  name: string;
  shelves: string[];
}

// Sample stores
const stores = [
  "Main Warehouse",
  "Branch Store A",
  "Branch Store B",
  "Regional Depot",
];

// Sample suppliers
const suppliers = [
  "ABC Auto Parts Ltd.",
  "Global Motors Supply",
  "Premium Parts Co.",
  "AutoZone Distributors",
  "CarParts International",
];

// Sample accounts
const accounts = [
  "Cash Account",
  "Bank Account",
  "Credit Card",
  "Petty Cash",
  "Supplier Credit",
];

// Expense types
const expenseTypes = [
  "Freight",
  "Handling Charges",
  "Customs Duty",
  "Insurance",
  "Packaging",
  "Other",
];

// Payable accounts
const payableAccounts = [
  "Accounts Payable",
  "Freight Payable",
  "Customs Payable",
  "Other Payables",
];

// Sample racks
const sampleRacks: Rack[] = [
  { id: "1", name: "Rack A", shelves: ["Shelf 1", "Shelf 2", "Shelf 3"] },
  { id: "2", name: "Rack B", shelves: ["Shelf 1", "Shelf 2"] },
  { id: "3", name: "Rack C", shelves: ["Shelf 1", "Shelf 2", "Shelf 3", "Shelf 4"] },
];

// Sample parts for selection
const availableParts = [
  { id: "1", partNo: "ENG-1766039805979-002", description: "Performance Pistons Set", brand: "Bosch", uom: "SET", price: 550 },
  { id: "2", partNo: "ENG-001", description: "High Performance Engine Block", brand: "Bosch", uom: "SET", price: 1250 },
  { id: "3", partNo: "BRK-001", description: "Ceramic Brake Pad Set", brand: "Brembo", uom: "SET", price: 85 },
  { id: "4", partNo: "SUS-001", description: "Performance Shock Absorbers", brand: "Monroe", uom: "PAIR", price: 320 },
  { id: "5", partNo: "ELC-001", description: "Engine Wiring Harness", brand: "Delphi", uom: "SET", price: 180 },
  { id: "6", partNo: "TRM-001", description: "6-Speed Manual Transmission", brand: "ZF", uom: "UNIT", price: 950 },
  { id: "7", partNo: "FLT-001", description: "Air Filter Element", brand: "Mann", uom: "PCS", price: 15 },
  { id: "8", partNo: "FLT-002", description: "Oil Filter Premium", brand: "Mann", uom: "PCS", price: 25 },
];

// Sample orders
const sampleOrders: DirectPurchaseOrder[] = [];

type ViewMode = "list" | "create" | "edit";

interface OrderItemForm {
  id: string;
  partId: string;
  quantity: number;
  purchasePrice: number;
  salePrice: number;
  rack: string;
  shelf: string;
}

interface ExpenseForm {
  id: string;
  expenseType: string;
  payableAccount: string;
  description: string;
  amount: number;
}

export const DirectPurchaseOrder = () => {
  // Orders state
  const [orders, setOrders] = useState<DirectPurchaseOrder[]>(sampleOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // View mode state
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedOrder, setSelectedOrder] = useState<DirectPurchaseOrder | null>(null);

  // View dialog
  const [showViewDialog, setShowViewDialog] = useState(false);

  // Form state
  const [formStore, setFormStore] = useState("");
  const [formSupplier, setFormSupplier] = useState("");
  const [formRequestDate, setFormRequestDate] = useState<Date>(new Date());
  const [formDescription, setFormDescription] = useState("");
  const [formAccount, setFormAccount] = useState("");
  const [formItems, setFormItems] = useState<OrderItemForm[]>([]);
  const [formExpenses, setFormExpenses] = useState<ExpenseForm[]>([]);

  // Rack and shelf state
  const [racks, setRacks] = useState<Rack[]>(sampleRacks);
  const [newRackName, setNewRackName] = useState("");
  const [newShelfName, setNewShelfName] = useState("");
  const [showNewRackInput, setShowNewRackInput] = useState(false);
  const [showNewShelfInput, setShowNewShelfInput] = useState(false);
  const [selectedRackForShelf, setSelectedRackForShelf] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(25);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.dpoNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.store.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  // Generate new DPO number
  const generateDpoNo = () => {
    const year = new Date().getFullYear();
    const nextNum = orders.length + 1;
    return `DPO-${year}-${String(nextNum).padStart(3, "0")}`;
  };

  // Reset form
  const resetForm = () => {
    setFormStore("");
    setFormSupplier("");
    setFormRequestDate(new Date());
    setFormDescription("");
    setFormAccount("");
    setFormItems([]);
    setFormExpenses([]);
    setShowNewRackInput(false);
    setShowNewShelfInput(false);
    setNewRackName("");
    setNewShelfName("");
  };

  // Open create view
  const handleNewOrder = () => {
    resetForm();
    setViewMode("create");
  };

  // Open edit view
  const handleEdit = (order: DirectPurchaseOrder) => {
    setSelectedOrder(order);
    setFormStore(order.store);
    setFormDescription(order.description);
    setFormAccount(order.account);
    const dateParts = order.requestDate.split("/");
    if (dateParts.length === 3) {
      setFormRequestDate(new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0])));
    }
    setFormItems(
      order.items.map((item, idx) => ({
        id: String(idx + 1),
        partId: availableParts.find((p) => p.partNo === item.partNo)?.id || "",
        quantity: item.quantity,
        purchasePrice: item.purchasePrice,
        salePrice: item.salePrice,
        rack: item.rack,
        shelf: item.shelf,
      }))
    );
    setViewMode("edit");
  };

  // Open view dialog
  const handleView = (order: DirectPurchaseOrder) => {
    setSelectedOrder(order);
    setShowViewDialog(true);
  };

  // Back to list
  const handleBackToList = () => {
    setViewMode("list");
    setSelectedOrder(null);
    resetForm();
  };

  // Delete order
  const handleDelete = (order: DirectPurchaseOrder) => {
    setOrders((prev) => prev.filter((o) => o.id !== order.id));
    toast.success(`Direct Purchase Order ${order.dpoNo} deleted`);
  };

  // Add item to form
  const handleAddItem = () => {
    setFormItems((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        partId: "",
        quantity: 1,
        purchasePrice: 0,
        salePrice: 0,
        rack: "",
        shelf: "",
      },
    ]);
  };

  // Remove item from form
  const handleRemoveItem = (id: string) => {
    setFormItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Update form item
  const handleUpdateItem = (id: string, field: keyof OrderItemForm, value: string | number) => {
    setFormItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          // Reset shelf when rack changes
          if (field === "rack") {
            updated.shelf = "";
          }
          // Set sale price from part when part is selected
          if (field === "partId") {
            const part = availableParts.find((p) => p.id === value);
            if (part) {
              updated.salePrice = part.price;
            }
          }
          return updated;
        }
        return item;
      })
    );
  };

  // Add new rack
  const handleAddRack = () => {
    if (newRackName.trim()) {
      const newRack: Rack = {
        id: String(Date.now()),
        name: newRackName.trim(),
        shelves: [],
      };
      setRacks([...racks, newRack]);
      setNewRackName("");
      setShowNewRackInput(false);
      toast.success("Rack added successfully");
    }
  };

  // Add new shelf
  const handleAddShelf = () => {
    if (newShelfName.trim() && selectedRackForShelf) {
      setRacks((prev) =>
        prev.map((rack) =>
          rack.id === selectedRackForShelf
            ? { ...rack, shelves: [...rack.shelves, newShelfName.trim()] }
            : rack
        )
      );
      setNewShelfName("");
      setShowNewShelfInput(false);
      setSelectedRackForShelf("");
      toast.success("Shelf added successfully");
    }
  };

  // Calculate total
  const calculateTotal = () => {
    return formItems.reduce((sum, item) => {
      return sum + item.purchasePrice * item.quantity;
    }, 0);
  };

  // Calculate total expenses
  const calculateTotalExpenses = () => {
    return formExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  // Add expense
  const handleAddExpense = () => {
    setFormExpenses((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        expenseType: "",
        payableAccount: "",
        description: "",
        amount: 0,
      },
    ]);
  };

  // Remove expense
  const handleRemoveExpense = (id: string) => {
    setFormExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  // Update expense
  const handleUpdateExpense = (id: string, field: keyof ExpenseForm, value: string | number) => {
    setFormExpenses((prev) =>
      prev.map((expense) =>
        expense.id === id ? { ...expense, [field]: value } : expense
      )
    );
  };

  // Save order
  const handleSave = () => {
    if (!formStore) {
      toast.error("Please select a store");
      return;
    }
    if (!formAccount) {
      toast.error("Please select an account");
      return;
    }
    if (formItems.length === 0) {
      toast.error("Please add at least one item");
      return;
    }

    const validItems = formItems.filter((item) => item.partId);
    if (validItems.length === 0) {
      toast.error("Please select at least one part");
      return;
    }

    const orderItems: DirectPurchaseOrderItem[] = validItems.map((item) => {
      const part = availableParts.find((p) => p.id === item.partId)!;
      return {
        id: item.id,
        partNo: part.partNo,
        description: part.description,
        brand: part.brand,
        uom: part.uom,
        quantity: item.quantity,
        purchasePrice: item.purchasePrice,
        salePrice: item.salePrice,
        amount: item.purchasePrice * item.quantity,
        rack: item.rack,
        shelf: item.shelf,
      };
    });

    if (viewMode === "edit" && selectedOrder) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id
            ? {
                ...o,
                store: formStore,
                description: formDescription,
                account: formAccount,
                requestDate: format(formRequestDate, "dd/MM/yyyy"),
                grandTotal: calculateTotal(),
                items: orderItems,
              }
            : o
        )
      );
      toast.success("Direct Purchase Order updated successfully");
    } else {
      const newOrder: DirectPurchaseOrder = {
        id: String(Date.now()),
        dpoNo: generateDpoNo(),
        store: formStore,
        requestDate: format(formRequestDate, "dd/MM/yyyy"),
        description: formDescription,
        grandTotal: calculateTotal(),
        status: "Completed",
        items: orderItems,
        account: formAccount,
      };
      setOrders((prev) => [newOrder, ...prev]);
      toast.success("Direct Purchase Order created successfully");
    }

    handleBackToList();
  };

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">{status}</Badge>;
      case "Draft":
        return <Badge variant="secondary">{status}</Badge>;
      case "Cancelled":
        return <Badge variant="destructive">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Render list view
  const renderListView = () => (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Direct Purchase Orders</h1>
        <p className="text-muted-foreground text-sm">Manage direct purchase orders</p>
      </div>

      {/* New Order Button */}
      <Button onClick={handleNewOrder} className="bg-orange-500 hover:bg-orange-600 text-white">
        <Plus className="w-4 h-4 mr-2" />
        New Direct Purchase Order
      </Button>

      {/* Orders Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">
            All Direct Purchase Orders ({filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          {paginatedOrders.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">S.NO</TableHead>
                    <TableHead>DPO No.</TableHead>
                    <TableHead>Store</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Grand Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedOrders.map((order, index) => (
                    <TableRow key={order.id}>
                      <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                      <TableCell className="font-medium">{order.dpoNo}</TableCell>
                      <TableCell>{order.store}</TableCell>
                      <TableCell>{order.requestDate}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{order.description || "-"}</TableCell>
                      <TableCell className="text-right font-medium">
                        {order.grandTotal.toLocaleString("en-PK", { style: "currency", currency: "PKR" })}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleView(order)}
                            className="h-8 w-8"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(order)}
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(order)}
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No direct purchase orders found. Create one to get started.
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} entries
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  // Render create/edit view
  const renderCreateEditView = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handleBackToList}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {viewMode === "edit" ? "Edit Direct Purchase Order" : "Add Direct Purchase Order"}
            </h1>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={handleBackToList}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Form Card */}
      <Card>
        <CardContent className="pt-6">
          {/* Header Fields */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="space-y-2">
              <Label>PO NO</Label>
              <Input
                value={viewMode === "edit" && selectedOrder ? selectedOrder.dpoNo : generateDpoNo()}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label>Request Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formRequestDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {formRequestDate ? format(formRequestDate, "MM/dd/yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={formRequestDate}
                    onSelect={(date) => date && setFormRequestDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Supplier</Label>
              <Select value={formSupplier} onValueChange={setFormSupplier}>
                <SelectTrigger className={cn(!formSupplier && "border-orange-500")}>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((supplier) => (
                    <SelectItem key={supplier} value={supplier}>
                      {supplier}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Store</Label>
              <Select value={formStore} onValueChange={setFormStore}>
                <SelectTrigger className={cn(!formStore && "border-orange-500")}>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {stores.map((store) => (
                    <SelectItem key={store} value={store}>
                      {store}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Enter description..."
              />
            </div>
          </div>

          {/* Item Parts Section */}
          <Card className="mb-6">
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">Item Parts</CardTitle>
                <Button onClick={handleAddItem} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {formItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No items added yet</p>
                  <p className="text-sm">Click "Add New Item" to add items</p>
                </div>
              ) : (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">#</TableHead>
                        <TableHead>Part</TableHead>
                        <TableHead>Brand</TableHead>
                        <TableHead>UoM</TableHead>
                        <TableHead className="w-24">Qty</TableHead>
                        <TableHead className="w-32">Purchase Price</TableHead>
                        <TableHead className="w-32">Sale Price</TableHead>
                        <TableHead className="w-32">Rack</TableHead>
                        <TableHead className="w-32">Shelf</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {formItems.map((item, index) => {
                        const selectedPart = availableParts.find((p) => p.id === item.partId);
                        const selectedRack = racks.find((r) => r.id === item.rack);
                        return (
                          <TableRow key={item.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>
                              <Select
                                value={item.partId}
                                onValueChange={(value) => handleUpdateItem(item.id, "partId", value)}
                              >
                                <SelectTrigger className="w-[200px]">
                                  <SelectValue placeholder="Select part..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {availableParts.map((part) => (
                                    <SelectItem key={part.id} value={part.id}>
                                      {part.partNo} - {part.description}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>{selectedPart?.brand || "-"}</TableCell>
                            <TableCell>{selectedPart?.uom || "-"}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleUpdateItem(item.id, "quantity", parseInt(e.target.value) || 1)}
                                className="w-20"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                value={item.purchasePrice}
                                onChange={(e) => handleUpdateItem(item.id, "purchasePrice", parseFloat(e.target.value) || 0)}
                                className="w-28"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                value={item.salePrice}
                                onChange={(e) => handleUpdateItem(item.id, "salePrice", parseFloat(e.target.value) || 0)}
                                className="w-28"
                              />
                            </TableCell>
                            <TableCell>
                              <Select
                                value={item.rack}
                                onValueChange={(value) => handleUpdateItem(item.id, "rack", value)}
                              >
                                <SelectTrigger className="w-28">
                                  <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {racks.map((rack) => (
                                    <SelectItem key={rack.id} value={rack.id}>
                                      {rack.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={item.shelf}
                                onValueChange={(value) => handleUpdateItem(item.id, "shelf", value)}
                                disabled={!item.rack}
                              >
                                <SelectTrigger className="w-28">
                                  <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {selectedRack?.shelves.map((shelf) => (
                                    <SelectItem key={shelf} value={shelf}>
                                      {shelf}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {(item.purchasePrice * item.quantity).toLocaleString("en-PK")}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveItem(item.id)}
                                className="h-8 w-8 text-destructive hover:text-destructive"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Rack and Shelves Section */}
          <Card className="mb-6">
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">Rack and Shelves</CardTitle>
                <div className="flex gap-2">
                  {showNewRackInput ? (
                    <div className="flex gap-2">
                      <Input
                        value={newRackName}
                        onChange={(e) => setNewRackName(e.target.value)}
                        placeholder="Rack name..."
                        className="w-32"
                      />
                      <Button size="sm" onClick={handleAddRack}>
                        Add
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setShowNewRackInput(false)}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => setShowNewRackInput(true)}>
                      + Add New Rack
                    </Button>
                  )}
                  {showNewShelfInput ? (
                    <div className="flex gap-2">
                      <Select value={selectedRackForShelf} onValueChange={setSelectedRackForShelf}>
                        <SelectTrigger className="w-28">
                          <SelectValue placeholder="Rack..." />
                        </SelectTrigger>
                        <SelectContent>
                          {racks.map((rack) => (
                            <SelectItem key={rack.id} value={rack.id}>
                              {rack.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        value={newShelfName}
                        onChange={(e) => setNewShelfName(e.target.value)}
                        placeholder="Shelf name..."
                        className="w-32"
                      />
                      <Button size="sm" onClick={handleAddShelf} disabled={!selectedRackForShelf}>
                        Add
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setShowNewShelfInput(false)}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => setShowNewShelfInput(true)}>
                      + Add New Shelf
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Items Total - Before Expenses */}
          {formItems.length > 0 && (
            <div className="flex justify-end mb-6">
              <div className="bg-muted/30 border border-border rounded-lg px-4 py-2 text-right">
                <p className="text-xs text-muted-foreground">Items Total</p>
                <p className="text-lg font-bold text-primary">{calculateTotal().toLocaleString("en-PK")}</p>
              </div>
            </div>
          )}

          {/* Expense Section */}
          <Card className="mb-6">
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">Expenses</CardTitle>
                <Button onClick={handleAddExpense} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Expense
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {formExpenses.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  <p className="text-sm">No expenses added yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground pb-2 border-b">
                    <div className="col-span-3">Expense Type</div>
                    <div className="col-span-3">Payable Account</div>
                    <div className="col-span-3">Description</div>
                    <div className="col-span-2 text-right">Amount</div>
                    <div className="col-span-1"></div>
                  </div>
                  {formExpenses.map((expense) => (
                    <div key={expense.id} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-3">
                        <Select
                          value={expense.expenseType}
                          onValueChange={(value) => handleUpdateExpense(expense.id, "expenseType", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            {expenseTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-3">
                        <Select
                          value={expense.payableAccount}
                          onValueChange={(value) => handleUpdateExpense(expense.id, "payableAccount", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select..." />
                          </SelectTrigger>
                          <SelectContent>
                            {payableAccounts.map((account) => (
                              <SelectItem key={account} value={account}>
                                {account}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-3">
                        <Input
                          value={expense.description}
                          onChange={(e) => handleUpdateExpense(expense.id, "description", e.target.value)}
                          placeholder="Enter description..."
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          min="0"
                          value={expense.amount}
                          onChange={(e) => handleUpdateExpense(expense.id, "amount", parseFloat(e.target.value) || 0)}
                          className="text-right"
                        />
                      </div>
                      <div className="col-span-1 flex justify-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveExpense(expense.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end pt-2 border-t mt-2">
                    <div className="text-sm font-medium">
                      Total Expenses: <span className="text-primary">{calculateTotalExpenses().toLocaleString("en-PK")}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account and Total */}
          <div className="flex justify-end items-start gap-4 mb-6">
            <div className="space-y-2">
              <Label>Account</Label>
              <Select value={formAccount} onValueChange={setFormAccount}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account} value={account}>
                      {account}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!formAccount && <p className="text-orange-500 text-xs">Required</p>}
            </div>
            <div className="space-y-2">
              <Label>Total</Label>
              <Input value={calculateTotal().toFixed(2)} disabled className="w-32 text-right bg-muted" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="destructive" onClick={resetForm}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <div className="flex items-center gap-2">
              <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600 text-white">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button variant="link" onClick={handleBackToList} className="text-muted-foreground">
                Close
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Render view dialog
  const renderViewDialog = () => (
    <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Direct Purchase Order Details</DialogTitle>
          <DialogDescription>
            {selectedOrder?.dpoNo} - {selectedOrder?.requestDate}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-muted-foreground">DPO No</Label>
                  <p className="font-medium">{selectedOrder.dpoNo}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Store</Label>
                  <p className="font-medium">{selectedOrder.store}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Request Date</Label>
                  <p className="font-medium">{selectedOrder.requestDate}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div>{getStatusBadge(selectedOrder.status)}</div>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p className="font-medium">{selectedOrder.description || "-"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Account</Label>
                <p className="font-medium">{selectedOrder.account}</p>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Part No</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>UoM</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Purchase Price</TableHead>
                      <TableHead>Sale Price</TableHead>
                      <TableHead>Rack</TableHead>
                      <TableHead>Shelf</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">{item.partNo}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{item.brand}</TableCell>
                        <TableCell>{item.uom}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.purchasePrice.toLocaleString("en-PK")}</TableCell>
                        <TableCell>{item.salePrice.toLocaleString("en-PK")}</TableCell>
                        <TableCell>{item.rack || "-"}</TableCell>
                        <TableCell>{item.shelf || "-"}</TableCell>
                        <TableCell className="text-right font-medium">
                          {item.amount.toLocaleString("en-PK")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end">
                <div className="text-right">
                  <p className="text-muted-foreground">Grand Total</p>
                  <p className="text-2xl font-bold">
                    {selectedOrder.grandTotal.toLocaleString("en-PK", { style: "currency", currency: "PKR" })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowViewDialog(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-4">
      {viewMode === "list" && renderListView()}
      {(viewMode === "create" || viewMode === "edit") && renderCreateEditView()}
      {renderViewDialog()}
    </div>
  );
};
