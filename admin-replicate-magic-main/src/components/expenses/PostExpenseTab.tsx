import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Upload, X } from "lucide-react";
import { toast } from "sonner";

const expenseTypes = [
  { id: "1", name: "Customs & Duties" },
  { id: "2", name: "Freight & Shipping" },
  { id: "3", name: "Clearing Agent Fees" },
  { id: "4", name: "Employee Salaries" },
  { id: "5", name: "Office Rent" },
  { id: "6", name: "Utilities" },
  { id: "7", name: "Office Supplies" },
  { id: "8", name: "Communication" },
  { id: "9", name: "Marketing & Advertising" },
  { id: "10", name: "Bank Charges" },
  { id: "11", name: "Interest Expense" },
  { id: "12", name: "Vehicle Maintenance" },
];

const paymentModes = ["Cash", "Bank Transfer", "Cheque", "Credit Card", "Online Payment"];

export const PostExpenseTab = () => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    expenseType: "",
    amount: "",
    paidTo: "",
    paymentMode: "Cash",
    referenceNumber: "",
    description: "",
  });
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSubmit = () => {
    if (!formData.expenseType || !formData.amount || !formData.paidTo) {
      toast.error("Please fill all required fields");
      return;
    }

    // Simulate posting expense
    toast.success("Expense posted successfully", {
      description: `Rs ${parseFloat(formData.amount).toLocaleString()} paid to ${formData.paidTo}`,
    });

    // Reset form
    setFormData({
      date: new Date().toISOString().split("T")[0],
      expenseType: "",
      amount: "",
      paidTo: "",
      paymentMode: "Cash",
      referenceNumber: "",
      description: "",
    });
    setAttachments([]);
  };

  const handleCancel = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      expenseType: "",
      amount: "",
      paidTo: "",
      paymentMode: "Cash",
      referenceNumber: "",
      description: "",
    });
    setAttachments([]);
    toast.info("Form cleared");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <Plus className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Post New Expense</h2>
          <p className="text-sm text-muted-foreground">Record a new expense transaction</p>
        </div>
      </div>

      {/* Form */}
      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expenseType">Expense Type *</Label>
            <Select value={formData.expenseType} onValueChange={(v) => setFormData({ ...formData, expenseType: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select Expense Type" />
              </SelectTrigger>
              <SelectContent>
                {expenseTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="paidTo">Paid To *</Label>
            <Input
              id="paidTo"
              value={formData.paidTo}
              onChange={(e) => setFormData({ ...formData, paidTo: e.target.value })}
              placeholder="Payee name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="paymentMode">Payment Mode</Label>
            <Select value={formData.paymentMode} onValueChange={(v) => setFormData({ ...formData, paymentMode: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {paymentModes.map((mode) => (
                  <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="referenceNumber">Reference Number</Label>
            <Input
              id="referenceNumber"
              value={formData.referenceNumber}
              onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
              placeholder="Receipt/Invoice number"
            />
          </div>
          <div className="space-y-2">
            <Label>Attachments</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors cursor-pointer relative">
              <input
                type="file"
                multiple
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
              <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload files</p>
            </div>
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-sm">
                    <span className="truncate max-w-[150px]">{file.name}</span>
                    <button onClick={() => removeAttachment(index)} className="text-muted-foreground hover:text-destructive">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter expense details..."
            rows={4}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSubmit} className="gap-2">
            <Plus className="w-4 h-4" />
            Post Expense
          </Button>
        </div>
      </div>
    </Card>
  );
};
