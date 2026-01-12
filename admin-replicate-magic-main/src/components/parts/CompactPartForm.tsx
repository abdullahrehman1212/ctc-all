import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Image as ImageIcon, X, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Item } from "./ItemsListView";

interface PartFormData {
  masterPartNo: string;
  partNo: string;
  brand: string;
  description: string;
  category: string;
  subCategory: string;
  application: string;
  hsCode: string;
  uom: string;
  weight: string;
  reOrderLevel: string;
  cost: string;
  priceA: string;
  priceB: string;
  priceM: string;
  rackNo: string;
  origin: string;
  grade: string;
  status: string;
  smc: string;
  size: string;
  remarks: string;
}

const initialFormData: PartFormData = {
  masterPartNo: "",
  partNo: "",
  brand: "",
  description: "",
  category: "",
  subCategory: "",
  application: "",
  hsCode: "",
  uom: "NOS",
  weight: "",
  reOrderLevel: "0",
  cost: "0.00",
  priceA: "0.00",
  priceB: "0.00",
  priceM: "0.00",
  rackNo: "",
  origin: "",
  grade: "B",
  status: "A",
  smc: "",
  size: "",
  remarks: "",
};

interface CompactPartFormProps {
  onSave: (part: PartFormData, isEdit: boolean) => void;
  onCancel: () => void;
  editItem?: Item | null;
}

export const CompactPartForm = ({ onSave, onCancel, editItem }: CompactPartFormProps) => {
  const [formData, setFormData] = useState<PartFormData>(initialFormData);
  const [imageP1, setImageP1] = useState<string | null>(null);
  const [imageP2, setImageP2] = useState<string | null>(null);
  const isEditing = !!editItem;

  // Pre-fill form when editing
  useEffect(() => {
    if (editItem) {
      setFormData({
        masterPartNo: editItem.masterPartNo || "",
        partNo: editItem.partNo || "",
        brand: editItem.brand || "",
        description: editItem.description || "",
        category: editItem.category || "",
        subCategory: editItem.subCategory || "",
        application: editItem.application || "",
        hsCode: "",
        uom: "NOS",
        weight: "",
        reOrderLevel: "0",
        cost: "0.00",
        priceA: "0.00",
        priceB: "0.00",
        priceM: "0.00",
        rackNo: "",
        origin: "",
        grade: "B",
        status: editItem.status === "Active" ? "A" : "N",
        smc: "",
        size: "",
        remarks: "",
      });
      // Set images from editItem
      if (editItem.images && editItem.images.length > 0) {
        setImageP1(editItem.images[0] || null);
        setImageP2(editItem.images[1] || null);
      } else {
        setImageP1(null);
        setImageP2(null);
      }
    } else {
      setFormData(initialFormData);
      setImageP1(null);
      setImageP2(null);
    }
  }, [editItem]);

  const handleInputChange = (field: keyof PartFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.partNo.trim()) {
      toast({
        title: "Validation Error",
        description: "Part No/SSP# is required",
        variant: "destructive",
      });
      return;
    }
    onSave(formData, isEditing);
    setFormData(initialFormData);
    toast({
      title: "Success",
      description: isEditing ? "Part updated successfully" : "Part saved successfully",
    });
  };

  const handleReset = () => {
    if (editItem) {
      // Restore original data from editItem
      setFormData({
        masterPartNo: editItem.masterPartNo || "",
        partNo: editItem.partNo || "",
        brand: editItem.brand || "",
        description: editItem.description || "",
        category: editItem.category || "",
        subCategory: editItem.subCategory || "",
        application: editItem.application || "",
        hsCode: "",
        uom: "NOS",
        weight: "",
        reOrderLevel: "0",
        cost: "0.00",
        priceA: "0.00",
        priceB: "0.00",
        priceM: "0.00",
        rackNo: "",
        origin: "",
        grade: "B",
        status: editItem.status === "Active" ? "A" : "N",
        smc: "",
        size: "",
        remarks: "",
      });
      // Restore original images
      if (editItem.images && editItem.images.length > 0) {
        setImageP1(editItem.images[0] || null);
        setImageP2(editItem.images[1] || null);
      } else {
        setImageP1(null);
        setImageP2(null);
      }
      toast({
        title: "Reset",
        description: "Form restored to original values",
      });
    } else {
      // Clear form for new entry
      setFormData(initialFormData);
      setImageP1(null);
      setImageP2(null);
    }
  };

  return (
    <div className="h-full flex flex-col bg-card rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-0.5 h-6 bg-primary rounded-full" />
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              {isEditing ? "Edit Part" : "Create New Part"}
            </h2>
            <p className="text-muted-foreground text-[10px]">
              {isEditing ? `Editing: ${editItem.partNo}` : "Add a new inventory part"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing && (
            <Button variant="outline" size="sm" className="h-7 text-xs px-3" onClick={handleReset}>
              New
            </Button>
          )}
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Scrollable Form Content */}
      <div className="flex-1 overflow-auto p-4">
        {/* Part Information Section */}
        <div className="flex items-center gap-1.5 mb-3">
          <span className="text-primary text-xs">•</span>
          <span className="text-[10px] font-medium text-foreground uppercase tracking-wide">PART INFORMATION</span>
        </div>

        {/* Row 1: Master Part, Part No, Brand */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-2">
          <div>
            <label className="block text-[10px] text-muted-foreground mb-0.5">Master Part #</label>
            <Input
              placeholder="Type to search or press Enter to add new"
              value={formData.masterPartNo}
              onChange={(e) => handleInputChange("masterPartNo", e.target.value)}
              className="h-7 text-xs"
            />
          </div>
          <div>
            <label className="block text-[10px] text-muted-foreground mb-0.5">
              Part No/SSP# <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="Select master part number first"
              value={formData.partNo}
              onChange={(e) => handleInputChange("partNo", e.target.value)}
              className="h-7 text-xs"
            />
          </div>
          <div>
            <label className="block text-[10px] text-muted-foreground mb-0.5">Brand</label>
            <Input
              placeholder="Enter Part No/SSP# first"
              value={formData.brand}
              onChange={(e) => handleInputChange("brand", e.target.value)}
              className="h-7 text-xs"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-2">
          <label className="block text-[10px] text-muted-foreground mb-0.5">Description</label>
          <Textarea
            placeholder="Enter part description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={2}
            className="text-xs min-h-[50px] resize-none"
          />
        </div>

        {/* Row 2: Category, Sub Category, Application */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-2">
          <div>
            <label className="block text-[10px] text-muted-foreground mb-0.5">Category</label>
            <Input
              placeholder="Type to search or press Enter to add new"
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="h-7 text-xs"
            />
          </div>
          <div>
            <label className="block text-[10px] text-muted-foreground mb-0.5">Sub Category</label>
            <Input
              placeholder="Select category first"
              value={formData.subCategory}
              onChange={(e) => handleInputChange("subCategory", e.target.value)}
              disabled={!formData.category}
              className="h-7 text-xs"
            />
          </div>
          <div>
            <label className="block text-[10px] text-muted-foreground mb-0.5">Application</label>
            <Input
              placeholder="Please select a sub-category first"
              value={formData.application}
              onChange={(e) => handleInputChange("application", e.target.value)}
              className="h-7 text-xs"
            />
          </div>
        </div>

        {/* Row 3: HS Code, UOM, Weight */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-2">
          <div>
            <label className="block text-[10px] text-muted-foreground mb-0.5">HS Code</label>
            <Input
              placeholder="Enter HS code"
              value={formData.hsCode}
              onChange={(e) => handleInputChange("hsCode", e.target.value)}
              className="h-7 text-xs"
            />
          </div>
          <div>
            <label className="block text-[10px] text-muted-foreground mb-0.5">UOM (A-Z)</label>
            <Select value={formData.uom} onValueChange={(v) => handleInputChange("uom", v)}>
              <SelectTrigger className="h-7 text-xs">
                <SelectValue placeholder="Select UOM" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NOS" className="text-xs">NOS</SelectItem>
                <SelectItem value="SET" className="text-xs">SET</SelectItem>
                <SelectItem value="KG" className="text-xs">KG</SelectItem>
                <SelectItem value="LTR" className="text-xs">LTR</SelectItem>
                <SelectItem value="MTR" className="text-xs">MTR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-[10px] text-muted-foreground mb-0.5">Weight (Kg)</label>
            <Input
              type="number"
              placeholder=""
              value={formData.weight}
              onChange={(e) => handleInputChange("weight", e.target.value)}
              className="h-7 text-xs"
            />
          </div>
        </div>

        {/* Row 4: Re-Order Level, Cost */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
          <div>
            <label className="block text-[10px] text-muted-foreground mb-0.5">Re-Order Level</label>
            <Input
              type="number"
              value={formData.reOrderLevel}
              onChange={(e) => handleInputChange("reOrderLevel", e.target.value)}
              className="h-7 text-xs"
            />
          </div>
          <div>
            <label className="block text-[10px] text-muted-foreground mb-0.5">Cost</label>
            <Input
              type="number"
              step="0.01"
              value={formData.cost}
              onChange={(e) => handleInputChange("cost", e.target.value)}
              className="h-7 text-xs"
            />
          </div>
        </div>

        {/* Row 5: Price-A, Price-B, Price-M */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-2">
          <div>
            <label className="block text-[10px] text-muted-foreground mb-0.5">Price-A</label>
            <Input
              type="number"
              step="0.01"
              value={formData.priceA}
              onChange={(e) => handleInputChange("priceA", e.target.value)}
              className="h-7 text-xs"
            />
          </div>
          <div>
            <label className="block text-[10px] text-muted-foreground mb-0.5">Price-B</label>
            <Input
              type="number"
              step="0.01"
              value={formData.priceB}
              onChange={(e) => handleInputChange("priceB", e.target.value)}
              className="h-7 text-xs"
            />
          </div>
          <div>
            <label className="block text-[10px] text-muted-foreground mb-0.5">Price-M</label>
            <Input
              type="number"
              step="0.01"
              value={formData.priceM}
              onChange={(e) => handleInputChange("priceM", e.target.value)}
              className="h-7 text-xs"
            />
          </div>
        </div>

        {/* Row 6: Rack No, Origin, Grade */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-2">
          <div>
            <label className="block text-[10px] text-muted-foreground mb-0.5">Rack No</label>
            <Input
              placeholder="Enter rack number"
              value={formData.rackNo}
              onChange={(e) => handleInputChange("rackNo", e.target.value)}
              className="h-7 text-xs"
            />
          </div>
          <div>
            <label className="block text-[10px] text-muted-foreground mb-0.5">Origin</label>
            <Select value={formData.origin} onValueChange={(v) => handleInputChange("origin", v)}>
              <SelectTrigger className="h-7 text-xs">
                <SelectValue placeholder="Select Origin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="local" className="text-xs">Local</SelectItem>
                <SelectItem value="import" className="text-xs">Import</SelectItem>
                <SelectItem value="china" className="text-xs">China</SelectItem>
                <SelectItem value="japan" className="text-xs">Japan</SelectItem>
                <SelectItem value="germany" className="text-xs">Germany</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-[10px] text-muted-foreground mb-0.5">Grade (A/B/C/D)</label>
            <Select value={formData.grade} onValueChange={(v) => handleInputChange("grade", v)}>
              <SelectTrigger className="h-7 text-xs">
                <SelectValue placeholder="Select Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A" className="text-xs">A</SelectItem>
                <SelectItem value="B" className="text-xs">B</SelectItem>
                <SelectItem value="C" className="text-xs">C</SelectItem>
                <SelectItem value="D" className="text-xs">D</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Row 7: Status, SMC, Size */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-2">
          <div>
            <label className="block text-[10px] text-muted-foreground mb-0.5">Status (A/N)</label>
            <Select value={formData.status} onValueChange={(v) => handleInputChange("status", v)}>
              <SelectTrigger className="h-7 text-xs">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A" className="text-xs">A</SelectItem>
                <SelectItem value="N" className="text-xs">N</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-[10px] text-muted-foreground mb-0.5">SMC</label>
            <Input
              placeholder="Enter SMC"
              value={formData.smc}
              onChange={(e) => handleInputChange("smc", e.target.value)}
              className="h-7 text-xs"
            />
          </div>
          <div>
            <label className="block text-[10px] text-muted-foreground mb-0.5">Size</label>
            <Input
              placeholder="LxHxW"
              value={formData.size}
              onChange={(e) => handleInputChange("size", e.target.value)}
              className="h-7 text-xs"
            />
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label className="block text-[10px] text-muted-foreground mb-0.5">Image P1</label>
            {imageP1 ? (
              <div className="relative border border-border rounded p-1 h-16">
                <img 
                  src={imageP1} 
                  alt="Image P1" 
                  className="w-full h-full object-cover rounded"
                />
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="absolute top-1 right-1 h-4 w-4 p-0"
                  onClick={() => setImageP1(null)}
                >
                  <X className="w-2.5 h-2.5" />
                </Button>
              </div>
            ) : (
              <div className="border border-dashed border-border rounded p-1 flex flex-col items-center justify-center hover:border-primary transition-colors cursor-pointer h-16">
                <ImageIcon className="w-3 h-3 text-muted-foreground mb-0.5" />
                <span className="text-[8px] text-muted-foreground">Upload P1</span>
              </div>
            )}
          </div>
          <div>
            <label className="block text-[10px] text-muted-foreground mb-0.5">Image P2</label>
            {imageP2 ? (
              <div className="relative border border-border rounded p-1 h-16">
                <img 
                  src={imageP2} 
                  alt="Image P2" 
                  className="w-full h-full object-cover rounded"
                />
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="absolute top-1 right-1 h-4 w-4 p-0"
                  onClick={() => setImageP2(null)}
                >
                  <X className="w-2.5 h-2.5" />
                </Button>
              </div>
            ) : (
              <div className="border border-dashed border-border rounded p-1 flex flex-col items-center justify-center hover:border-primary transition-colors cursor-pointer h-16">
                <ImageIcon className="w-3 h-3 text-muted-foreground mb-0.5" />
                <span className="text-[8px] text-muted-foreground">Upload P2</span>
              </div>
            )}
          </div>
        </div>

        {/* Remarks */}
        <div className="mb-3">
          <label className="block text-[10px] text-muted-foreground mb-0.5">Remarks</label>
          <Textarea
            placeholder="Enter any additional remarks or notes..."
            value={formData.remarks}
            onChange={(e) => handleInputChange("remarks", e.target.value)}
            rows={2}
            className="text-xs min-h-[40px] resize-none"
          />
        </div>
      </div>

      {/* Fixed Save Button */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex justify-center gap-2">
          <Button className="gap-1.5 h-8 text-xs px-6" onClick={handleSave}>
            {isEditing ? <Save className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            {isEditing ? "Update Part" : "Save Part"}
          </Button>
          {isEditing && (
            <Button 
              variant="outline" 
              className="h-8 text-xs px-4" 
              onClick={handleReset}
            >
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
