import { useState } from "react";
import { ArrowLeftRight, Plus, Eye, Pencil, Trash2, X, Check, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TransferItem {
  id: string;
  partId: string;
  partName: string;
  availableQty: number;
  transferQty: number;
  fromStore: string;
  fromRack: string;
  fromShelf: string;
  toStore: string;
  toRack: string;
  toShelf: string;
}

interface Transfer {
  id: string;
  transferNumber: string;
  date: string;
  status: "Draft" | "Pending" | "In Transit" | "Completed" | "Cancelled";
  notes: string;
  items: TransferItem[];
  total: number;
}

const sampleParts: { id: string; name: string; qty: number }[] = [];

const stores = ["Main Warehouse", "Branch A", "Branch B"];

const sampleTransfers: Transfer[] = [];

const generateTransferNumber = () => {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return `STR-${year}${month}-${random}`;
};

export const StockTransfer = () => {
  const [transfers, setTransfers] = useState<Transfer[]>(sampleTransfers);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [editingTransfer, setEditingTransfer] = useState<Transfer | null>(null);
  const [viewingTransfer, setViewingTransfer] = useState<Transfer | null>(null);

  // Form state
  const [formData, setFormData] = useState<{
    transferNumber: string;
    date: string;
    status: Transfer["status"];
    notes: string;
    items: TransferItem[];
  }>({
    transferNumber: "",
    date: "",
    status: "Draft",
    notes: "",
    items: [],
  });

  const totalPages = Math.ceil(transfers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransfers = transfers.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedTransfers.map((t) => t.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    }
  };

  const openCreateForm = () => {
    const today = new Date().toISOString().split("T")[0];
    setFormData({
      transferNumber: generateTransferNumber(),
      date: today,
      status: "Draft",
      notes: "",
      items: [],
    });
    setEditingTransfer(null);
    setShowForm(true);
  };

  const openEditForm = (transfer: Transfer) => {
    setFormData({
      transferNumber: transfer.transferNumber,
      date: transfer.date.split("/").reverse().join("-"),
      status: transfer.status,
      notes: transfer.notes,
      items: [...transfer.items],
    });
    setEditingTransfer(transfer);
    setShowForm(true);
  };

  const handleAddItem = () => {
    const newItem: TransferItem = {
      id: Date.now().toString(),
      partId: "",
      partName: "",
      availableQty: 0,
      transferQty: 1,
      fromStore: "",
      fromRack: "",
      fromShelf: "",
      toStore: "",
      toRack: "",
      toShelf: "",
    };
    setFormData({ ...formData, items: [...formData.items, newItem] });
  };

  const handleRemoveItem = (itemId: string) => {
    setFormData({
      ...formData,
      items: formData.items.filter((item) => item.id !== itemId),
    });
  };

  const handleItemChange = (itemId: string, field: keyof TransferItem, value: string | number) => {
    setFormData({
      ...formData,
      items: formData.items.map((item) => {
        if (item.id === itemId) {
          if (field === "partId") {
            const part = sampleParts.find((p) => p.id === value);
            return {
              ...item,
              partId: value as string,
              partName: part?.name || "",
              availableQty: part?.qty || 0,
            };
          }
          return { ...item, [field]: value };
        }
        return item;
      }),
    });
  };

  const handleSave = () => {
    const total = formData.items.reduce((sum, item) => sum + item.transferQty, 0);
    const dateFormatted = formData.date.split("-").reverse().join("/");

    if (editingTransfer) {
      setTransfers(
        transfers.map((t) =>
          t.id === editingTransfer.id
            ? { ...t, ...formData, date: dateFormatted, total }
            : t
        )
      );
    } else {
      const newTransfer: Transfer = {
        id: Date.now().toString(),
        transferNumber: formData.transferNumber,
        date: dateFormatted,
        status: formData.status,
        notes: formData.notes,
        items: formData.items,
        total,
      };
      setTransfers([newTransfer, ...transfers]);
    }
    setShowForm(false);
    setEditingTransfer(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTransfer(null);
  };

  const handleDelete = (id: string) => {
    setTransfers(transfers.filter((t) => t.id !== id));
    setSelectedIds(selectedIds.filter((i) => i !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <ArrowLeftRight className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Stock Transfer Entry</h2>
            <p className="text-sm text-muted-foreground">Transfer stock between stores, racks, and shelves</p>
          </div>
        </div>
        <Button onClick={openCreateForm} className="gap-2">
          <Plus className="w-4 h-4" />
          Transfer
        </Button>
      </div>

      {/* Conditional: Show Form or Table */}
      {showForm ? (
        /* Create/Edit Form Section */
        <div className="bg-card border border-primary/30 rounded-lg overflow-hidden animate-fade-in">
          {/* Form Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20">
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">
                {editingTransfer ? "Edit Transfer" : "Create Stock Transfer"}
              </h3>
            </div>
            <Button variant="ghost" size="icon" onClick={handleCancel} className="h-8 w-8">
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            {/* Form Header Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Transfer Number</label>
                <Input
                  value={formData.transferNumber}
                  readOnly
                  className="bg-muted/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Transfer Date <span className="text-destructive">*</span>
                </label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => setFormData({ ...formData, status: v as Transfer["status"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Transit">In Transit</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Notes</label>
                <Input
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Transfer notes..."
                />
              </div>
            </div>

            {/* Transfer Items Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-foreground">Transfer Items</h3>
                <Button variant="outline" size="sm" onClick={handleAddItem} className="gap-1.5 border-primary text-primary hover:bg-primary/10">
                  <Plus className="w-4 h-4" />
                  Add Item
                </Button>
              </div>

              {formData.items.length === 0 ? (
                <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-12 flex flex-col items-center justify-center text-center">
                  <ArrowLeftRight className="w-10 h-10 text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">Click "Add Item" to add items for transfer</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {formData.items.map((item, index) => (
                    <div key={item.id} className="border border-border rounded-lg p-4 bg-muted/20 relative">
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                          Item #{index + 1}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(item.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Part Selection Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="text-sm font-medium text-foreground mb-1.5 block">
                            Part <span className="text-destructive">*</span>
                          </label>
                          <SearchableSelect
                            options={sampleParts.map((part) => ({ value: part.id, label: `${part.id} - ${part.name} (Qty: ${part.qty})` }))}
                            value={item.partId}
                            onValueChange={(v) => handleItemChange(item.id, "partId", v)}
                            placeholder="Select part"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground mb-1.5 block">Available Qty</label>
                          <Input value={item.availableQty} readOnly className="bg-muted/50" />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-foreground mb-1.5 block">
                            Transfer Qty <span className="text-destructive">*</span>
                          </label>
                          <Input
                            type="number"
                            min="1"
                            max={item.availableQty}
                            value={item.transferQty}
                            onChange={(e) => handleItemChange(item.id, "transferQty", parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>

                      {/* From Location */}
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">From Location</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm font-medium text-foreground mb-1.5 block">Store</label>
                            <SearchableSelect
                              options={stores.map((store) => ({ value: store, label: store }))}
                              value={item.fromStore}
                              onValueChange={(v) => handleItemChange(item.id, "fromStore", v)}
                              placeholder="Select store"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-foreground mb-1.5 block">Rack</label>
                            <Input
                              value={item.fromRack}
                              onChange={(e) => handleItemChange(item.id, "fromRack", e.target.value)}
                              placeholder="Rack No."
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-foreground mb-1.5 block">Shelf</label>
                            <Input
                              value={item.fromShelf}
                              onChange={(e) => handleItemChange(item.id, "fromShelf", e.target.value)}
                              placeholder="Shelf No."
                            />
                          </div>
                        </div>
                      </div>

                      {/* To Location */}
                      <div>
                        <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">To Location</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm font-medium text-foreground mb-1.5 block">Store</label>
                            <SearchableSelect
                              options={stores.filter((s) => s !== item.fromStore).map((store) => ({ value: store, label: store }))}
                              value={item.toStore}
                              onValueChange={(v) => handleItemChange(item.id, "toStore", v)}
                              placeholder="Select store"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-foreground mb-1.5 block">Rack</label>
                            <Input
                              value={item.toRack}
                              onChange={(e) => handleItemChange(item.id, "toRack", e.target.value)}
                              placeholder="Rack No."
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-foreground mb-1.5 block">Shelf</label>
                            <Input
                              value={item.toShelf}
                              onChange={(e) => handleItemChange(item.id, "toShelf", e.target.value)}
                              placeholder="Shelf No."
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-3 px-6 py-4 border-t border-border bg-muted/10">
            <Button onClick={handleSave} className="flex-1 gap-2">
              <Check className="w-4 h-4" />
              {editingTransfer ? "Update Transfer" : "Create Transfer"}
            </Button>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        /* Main Table Card */
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedIds.length === paginatedTransfers.length && paginatedTransfers.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="text-xs font-medium uppercase text-muted-foreground">ID</TableHead>
                <TableHead className="text-xs font-medium uppercase text-muted-foreground">Total</TableHead>
                <TableHead className="text-xs font-medium uppercase text-muted-foreground">Date</TableHead>
                <TableHead className="text-xs font-medium uppercase text-muted-foreground text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransfers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No transfers found. Click "+ Transfer" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTransfers.map((transfer) => (
                  <TableRow key={transfer.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(transfer.id)}
                        onCheckedChange={(checked) => handleSelectOne(transfer.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="font-medium text-foreground">{transfer.transferNumber}</TableCell>
                    <TableCell className="text-muted-foreground">{transfer.total.toFixed(2)}</TableCell>
                    <TableCell className="text-muted-foreground">{transfer.date}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => setViewingTransfer(transfer)}
                          className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button
                          onClick={() => openEditForm(transfer)}
                          className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(transfer.id)}
                          className="text-destructive hover:text-destructive/80 text-sm font-medium flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-border bg-muted/10">
            <p className="text-sm text-muted-foreground">
              Showing {transfers.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + itemsPerPage, transfers.length)} of {transfers.length} Records
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="h-8 px-2"
              >
                First
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-8 px-2"
              >
                Prev
              </Button>
              <div className="flex items-center gap-1">
                <span className="w-8 h-8 flex items-center justify-center rounded bg-primary text-primary-foreground text-sm font-medium">
                  {currentPage}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="h-8 px-2"
              >
                Next
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="h-8 px-2"
              >
                Last
              </Button>
              <Select value={String(itemsPerPage)} onValueChange={(v) => setItemsPerPage(Number(v))}>
                <SelectTrigger className="h-8 w-16">
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
      )}

      {/* View Dialog */}
      <Dialog open={!!viewingTransfer} onOpenChange={() => setViewingTransfer(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-primary" />
              <DialogTitle>Transfer Details - {viewingTransfer?.transferNumber}</DialogTitle>
            </div>
          </DialogHeader>

          {viewingTransfer && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Transfer Number</p>
                  <p className="font-medium text-foreground">{viewingTransfer.transferNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium text-foreground">{viewingTransfer.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant="secondary">{viewingTransfer.status}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Qty</p>
                  <p className="font-medium text-foreground">{viewingTransfer.total}</p>
                </div>
              </div>

              {viewingTransfer.notes && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Notes</p>
                  <p className="text-foreground">{viewingTransfer.notes}</p>
                </div>
              )}

              <div>
                <h3 className="text-base font-semibold text-foreground mb-3">Transfer Items</h3>
                <div className="space-y-3">
                  {viewingTransfer.items.map((item, index) => (
                    <div key={item.id} className="border border-border rounded-lg p-4 bg-muted/10">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                          Item #{index + 1}
                        </Badge>
                        <span className="text-sm font-medium text-foreground">Qty: {item.transferQty}</span>
                      </div>
                      <p className="font-medium text-foreground mb-2">{item.partId} - {item.partName}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">From</p>
                          <p className="text-foreground">{item.fromStore} {item.fromRack && `/ ${item.fromRack}`} {item.fromShelf && `/ ${item.fromShelf}`}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">To</p>
                          <p className="text-foreground">{item.toStore} {item.toRack && `/ ${item.toRack}`} {item.toShelf && `/ ${item.toShelf}`}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
