import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

// Types
interface Category {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  subcategoryCount: number;
}

interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  status: "Active" | "Inactive";
}

interface Brand {
  id: string;
  name: string;
  status: "Active" | "Inactive";
  createdAt: string;
}

// Initial data
const initialCategories: Category[] = [];

const initialSubcategories: Subcategory[] = [];

const initialBrands: Brand[] = [];

// Sample parts data to check subcategory usage
const samplePartsWithSubcategory: { id: string; partNo: string; subcategoryId: string; subcategoryName: string }[] = [];

export const AttributesPage = () => {
  // State
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [subcategories, setSubcategories] = useState<Subcategory[]>(initialSubcategories);
  const [brands, setBrands] = useState<Brand[]>(initialBrands);

  // Search and filter states
  const [categorySearch, setCategorySearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [subcategorySearch, setSubcategorySearch] = useState("");
  const [subcategoryCategoryFilter, setSubcategoryCategoryFilter] = useState("all");
  const [brandSearch, setBrandSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("all");

  // Dialog states
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [subcategoryDialogOpen, setSubcategoryDialogOpen] = useState(false);
  const [brandDialogOpen, setBrandDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<"category" | "subcategory" | "brand">("category");
  const [deleteId, setDeleteId] = useState<string>("");

  // Edit states
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  // Form states
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryStatus, setNewCategoryStatus] = useState<"Active" | "Inactive">("Active");
  const [newSubcategoryName, setNewSubcategoryName] = useState("");
  const [newSubcategoryCategoryId, setNewSubcategoryCategoryId] = useState("");
  const [newSubcategoryStatus, setNewSubcategoryStatus] = useState<"Active" | "Inactive">("Active");
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandStatus, setNewBrandStatus] = useState<"Active" | "Inactive">("Active");

  // Filtered data
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchesSearch = cat.name.toLowerCase().includes(categorySearch.toLowerCase());
      const matchesFilter = categoryFilter === "all" || cat.id === categoryFilter;
      return matchesSearch && matchesFilter;
    });
  }, [categories, categorySearch, categoryFilter]);

  const filteredSubcategories = useMemo(() => {
    return subcategories.filter((sub) => {
      const matchesSearch = sub.name.toLowerCase().includes(subcategorySearch.toLowerCase());
      const matchesCategory = subcategoryCategoryFilter === "all" || sub.categoryId === subcategoryCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [subcategories, subcategorySearch, subcategoryCategoryFilter]);

  const filteredBrands = useMemo(() => {
    return brands.filter((brand) => {
      const matchesSearch = brand.name.toLowerCase().includes(brandSearch.toLowerCase());
      const matchesFilter = brandFilter === "all" || brand.id === brandFilter;
      return matchesSearch && matchesFilter;
    });
  }, [brands, brandSearch, brandFilter]);

  // Handlers
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast({ title: "Error", description: "Category name is required", variant: "destructive" });
      return;
    }
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id ? { ...c, name: newCategoryName, status: newCategoryStatus } : c
        )
      );
      toast({ title: "Success", description: "Category updated successfully" });
    } else {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: newCategoryName,
        status: newCategoryStatus,
        subcategoryCount: 0,
      };
      setCategories((prev) => [newCategory, ...prev]);
      toast({ title: "Success", description: "Category added successfully" });
    }
    resetCategoryForm();
  };

  const handleAddSubcategory = () => {
    if (!newSubcategoryName.trim() || !newSubcategoryCategoryId) {
      toast({ title: "Error", description: "Subcategory name and category are required", variant: "destructive" });
      return;
    }
    const parentCategory = categories.find((c) => c.id === newSubcategoryCategoryId);
    if (editingSubcategory) {
      setSubcategories((prev) =>
        prev.map((s) =>
          s.id === editingSubcategory.id
            ? { ...s, name: newSubcategoryName, categoryId: newSubcategoryCategoryId, categoryName: parentCategory?.name || "", status: newSubcategoryStatus }
            : s
        )
      );
      toast({ title: "Success", description: "Subcategory updated successfully" });
    } else {
      const newSubcategory: Subcategory = {
        id: Date.now().toString(),
        name: newSubcategoryName,
        categoryId: newSubcategoryCategoryId,
        categoryName: parentCategory?.name || "",
        status: newSubcategoryStatus,
      };
      setSubcategories((prev) => [newSubcategory, ...prev]);
      setCategories((prev) =>
        prev.map((c) => (c.id === newSubcategoryCategoryId ? { ...c, subcategoryCount: c.subcategoryCount + 1 } : c))
      );
      toast({ title: "Success", description: "Subcategory added successfully" });
    }
    resetSubcategoryForm();
  };

  const handleAddBrand = () => {
    if (!newBrandName.trim()) {
      toast({ title: "Error", description: "Brand name is required", variant: "destructive" });
      return;
    }
    if (editingBrand) {
      setBrands((prev) =>
        prev.map((b) => (b.id === editingBrand.id ? { ...b, name: newBrandName, status: newBrandStatus } : b))
      );
      toast({ title: "Success", description: "Brand updated successfully" });
    } else {
      const newBrand: Brand = {
        id: Date.now().toString(),
        name: newBrandName,
        status: newBrandStatus,
        createdAt: new Date().toLocaleDateString("en-GB"),
      };
      setBrands((prev) => [newBrand, ...prev]);
      toast({ title: "Success", description: "Brand added successfully" });
    }
    resetBrandForm();
  };

  const handleDelete = () => {
    if (deleteType === "category") {
      // Check if category has subcategories
      const hasSubcategories = subcategories.some((s) => s.categoryId === deleteId);
      if (hasSubcategories) {
        toast({ 
          title: "Cannot Delete Category", 
          description: "This category has subcategories. Please delete all subcategories first before deleting this category.", 
          variant: "destructive" 
        });
        setDeleteDialogOpen(false);
        return;
      }
      setCategories((prev) => prev.filter((c) => c.id !== deleteId));
      toast({ title: "Success", description: "Category deleted successfully" });
    } else if (deleteType === "subcategory") {
      // Check if subcategory has parts
      const hasParts = samplePartsWithSubcategory.some((p) => p.subcategoryId === deleteId);
      if (hasParts) {
        const sub = subcategories.find((s) => s.id === deleteId);
        toast({ 
          title: "Cannot Delete Subcategory", 
          description: `Subcategory "${sub?.name}" has parts associated with it. Please remove or reassign the parts first.`, 
          variant: "destructive" 
        });
        setDeleteDialogOpen(false);
        return;
      }
      const sub = subcategories.find((s) => s.id === deleteId);
      setSubcategories((prev) => prev.filter((s) => s.id !== deleteId));
      if (sub) {
        setCategories((prev) =>
          prev.map((c) => (c.id === sub.categoryId ? { ...c, subcategoryCount: Math.max(0, c.subcategoryCount - 1) } : c))
        );
      }
      toast({ title: "Success", description: "Subcategory deleted successfully" });
    } else {
      setBrands((prev) => prev.filter((b) => b.id !== deleteId));
      toast({ title: "Success", description: "Brand deleted successfully" });
    }
    setDeleteDialogOpen(false);
  };

  const resetCategoryForm = () => {
    setNewCategoryName("");
    setNewCategoryStatus("Active");
    setEditingCategory(null);
    setCategoryDialogOpen(false);
  };

  const resetSubcategoryForm = () => {
    setNewSubcategoryName("");
    setNewSubcategoryCategoryId("");
    setNewSubcategoryStatus("Active");
    setEditingSubcategory(null);
    setSubcategoryDialogOpen(false);
  };

  const resetBrandForm = () => {
    setNewBrandName("");
    setNewBrandStatus("Active");
    setEditingBrand(null);
    setBrandDialogOpen(false);
  };

  const openEditCategory = (category: Category) => {
    setEditingCategory(category);
    setNewCategoryName(category.name);
    setNewCategoryStatus(category.status);
    setCategoryDialogOpen(true);
  };

  const openEditSubcategory = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory);
    setNewSubcategoryName(subcategory.name);
    setNewSubcategoryCategoryId(subcategory.categoryId);
    setNewSubcategoryStatus(subcategory.status);
    setSubcategoryDialogOpen(true);
  };

  const openEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
    setNewBrandName(brand.name);
    setNewBrandStatus(brand.status);
    setBrandDialogOpen(true);
  };

  const openDeleteDialog = (type: "category" | "subcategory" | "brand", id: string) => {
    setDeleteType(type);
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  // Status toggle handlers
  const toggleCategoryStatus = (category: Category) => {
    const newStatus = category.status === "Active" ? "Inactive" : "Active";
    
    // If trying to set inactive, check for active subcategories
    if (newStatus === "Inactive") {
      const activeSubcategories = subcategories.filter(
        (s) => s.categoryId === category.id && s.status === "Active"
      );
      if (activeSubcategories.length > 0) {
        toast({ 
          title: "Cannot Deactivate Category", 
          description: `This category has ${activeSubcategories.length} active subcategorie(s). Please deactivate all subcategories first before deactivating this category.`, 
          variant: "destructive" 
        });
        return;
      }
    }
    
    setCategories((prev) =>
      prev.map((c) => (c.id === category.id ? { ...c, status: newStatus } : c))
    );
    toast({ title: "Status Updated", description: `Category "${category.name}" is now ${newStatus}` });
  };

  const toggleSubcategoryStatus = (subcategory: Subcategory) => {
    const newStatus = subcategory.status === "Active" ? "Inactive" : "Active";
    
    // If trying to set inactive, check for parts using this subcategory
    if (newStatus === "Inactive") {
      const partsUsingSubcategory = samplePartsWithSubcategory.filter(
        (p) => p.subcategoryId === subcategory.id
      );
      if (partsUsingSubcategory.length > 0) {
        toast({ 
          title: "Cannot Deactivate Subcategory", 
          description: `This subcategory has ${partsUsingSubcategory.length} part(s) associated with it. Please remove or reassign the parts first.`, 
          variant: "destructive" 
        });
        return;
      }
    }
    
    setSubcategories((prev) =>
      prev.map((s) => (s.id === subcategory.id ? { ...s, status: newStatus } : s))
    );
    toast({ title: "Status Updated", description: `Subcategory "${subcategory.name}" is now ${newStatus}` });
  };

  const toggleBrandStatus = (brand: Brand) => {
    const newStatus = brand.status === "Active" ? "Inactive" : "Active";
    setBrands((prev) =>
      prev.map((b) => (b.id === brand.id ? { ...b, status: newStatus } : b))
    );
    toast({ title: "Status Updated", description: `Brand "${brand.name}" is now ${newStatus}` });
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-foreground">Attributes</h1>
        <p className="text-sm text-muted-foreground">Manage categories, subcategories, and brands for inventory organization</p>
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Categories List */}
        <div className="bg-card rounded-xl border border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="flex items-start justify-between mb-3 min-h-[40px]">
              <div>
                <h3 className="text-base font-semibold text-foreground">Categories List</h3>
                <p className="text-xs text-muted-foreground">Manage main categories</p>
              </div>
              <Button size="sm" className="gap-1 h-8 text-xs shrink-0" onClick={() => setCategoryDialogOpen(true)}>
                <Plus className="w-3.5 h-3.5" />
                Add New
              </Button>
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-32 h-8 text-xs border-border">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Search categories..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="h-8 text-xs flex-1"
              />
            </div>
          </div>
          <div className="px-4 py-2 border-b border-border">
            <p className="text-sm text-muted-foreground">All Categories ({filteredCategories.length})</p>
          </div>
          <div className="p-3 space-y-2">
            {filteredCategories.map((category) => (
              <div key={category.id} className="border border-border rounded-lg p-3 bg-background">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground text-sm">{category.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className={`px-1.5 py-0.5 text-xs rounded flex items-center gap-0.5 cursor-pointer hover:opacity-80 transition-opacity ${category.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {category.status}
                            <ChevronDown className="w-3 h-3" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem onClick={() => toggleCategoryStatus(category)}>
                            {category.status === "Active" ? "Set Inactive" : "Set Active"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <span className="text-xs text-muted-foreground">{category.subcategoryCount} subcategory</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => openEditCategory(category)}>
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs px-2 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={() => openDeleteDialog("category", category.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sub Category List */}
        <div className="bg-card rounded-xl border border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="flex items-start justify-between mb-3 min-h-[40px]">
              <div>
                <h3 className="text-base font-semibold text-foreground">Sub Category List</h3>
                <p className="text-xs text-muted-foreground">Manage sub categories</p>
              </div>
              <Button size="sm" className="gap-1 h-8 text-xs shrink-0" onClick={() => setSubcategoryDialogOpen(true)}>
                <Plus className="w-3.5 h-3.5" />
                Add New
              </Button>
            </div>
            <div className="flex gap-2">
              <Select value={subcategoryCategoryFilter} onValueChange={setSubcategoryCategoryFilter}>
                <SelectTrigger className="w-32 h-8 text-xs border-border">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Search sub categories..."
                value={subcategorySearch}
                onChange={(e) => setSubcategorySearch(e.target.value)}
                className="h-8 text-xs flex-1"
              />
            </div>
          </div>
          <div className="px-4 py-2 border-b border-border">
            <p className="text-sm text-muted-foreground">All Sub Categories ({filteredSubcategories.length})</p>
          </div>
          <div className="p-3 space-y-2">
            {filteredSubcategories.map((subcategory) => (
              <div key={subcategory.id} className="border border-border rounded-lg p-3 bg-background">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {subcategory.name} <span className="text-muted-foreground font-normal">(under {subcategory.categoryName})</span>
                    </p>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className={`px-1.5 py-0.5 text-xs rounded mt-1 inline-flex items-center gap-0.5 cursor-pointer hover:opacity-80 transition-opacity ${subcategory.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {subcategory.status}
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={() => toggleSubcategoryStatus(subcategory)}>
                          {subcategory.status === "Active" ? "Set Inactive" : "Set Active"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => openEditSubcategory(subcategory)}>
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs px-2 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={() => openDeleteDialog("subcategory", subcategory.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Brands List */}
        <div className="bg-card rounded-xl border border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="flex items-start justify-between mb-3 min-h-[40px]">
              <div>
                <h3 className="text-base font-semibold text-foreground">Brands List</h3>
                <p className="text-xs text-muted-foreground">Manage product brands</p>
              </div>
              <Button size="sm" className="gap-1 h-8 text-xs shrink-0" onClick={() => setBrandDialogOpen(true)}>
                <Plus className="w-3.5 h-3.5" />
                Add New
              </Button>
            </div>
            <div className="flex gap-2">
              <Select value={brandFilter} onValueChange={setBrandFilter}>
                <SelectTrigger className="w-32 h-8 text-xs border-border">
                  <SelectValue placeholder="All Brands" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>{brand.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Search brands..."
                value={brandSearch}
                onChange={(e) => setBrandSearch(e.target.value)}
                className="h-8 text-xs flex-1"
              />
            </div>
          </div>
          <div className="px-4 py-2 border-b border-border">
            <p className="text-sm text-muted-foreground">All Brands ({filteredBrands.length})</p>
          </div>
          <div className="p-3 space-y-2">
            {filteredBrands.map((brand) => (
              <div key={brand.id} className="border border-border rounded-lg p-3 bg-background">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground text-sm">{brand.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className={`px-1.5 py-0.5 text-xs rounded flex items-center gap-0.5 cursor-pointer hover:opacity-80 transition-opacity ${brand.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {brand.status}
                            <ChevronDown className="w-3 h-3" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem onClick={() => toggleBrandStatus(brand)}>
                            {brand.status === "Active" ? "Set Inactive" : "Set Active"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <span className="text-xs text-muted-foreground">{brand.createdAt}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" className="h-7 text-xs px-2" onClick={() => openEditBrand(brand)}>
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs px-2 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={() => openDeleteDialog("brand", brand.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={(open) => { if (!open) resetCategoryForm(); else setCategoryDialogOpen(true); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">Category Name *</label>
              <Input value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Enter category name" />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">Status</label>
              <Select value={newCategoryStatus} onValueChange={(v) => setNewCategoryStatus(v as "Active" | "Inactive")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetCategoryForm}>Cancel</Button>
            <Button onClick={handleAddCategory}>{editingCategory ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Subcategory Dialog */}
      <Dialog open={subcategoryDialogOpen} onOpenChange={(open) => { if (!open) resetSubcategoryForm(); else setSubcategoryDialogOpen(true); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSubcategory ? "Edit Subcategory" : "Add New Subcategory"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">Subcategory Name *</label>
              <Input value={newSubcategoryName} onChange={(e) => setNewSubcategoryName(e.target.value)} placeholder="Enter subcategory name" />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">Parent Category *</label>
              <Select value={newSubcategoryCategoryId} onValueChange={setNewSubcategoryCategoryId}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">Status</label>
              <Select value={newSubcategoryStatus} onValueChange={(v) => setNewSubcategoryStatus(v as "Active" | "Inactive")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetSubcategoryForm}>Cancel</Button>
            <Button onClick={handleAddSubcategory}>{editingSubcategory ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Brand Dialog */}
      <Dialog open={brandDialogOpen} onOpenChange={(open) => { if (!open) resetBrandForm(); else setBrandDialogOpen(true); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingBrand ? "Edit Brand" : "Add New Brand"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">Brand Name *</label>
              <Input value={newBrandName} onChange={(e) => setNewBrandName(e.target.value)} placeholder="Enter brand name" />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1.5">Status</label>
              <Select value={newBrandStatus} onValueChange={(v) => setNewBrandStatus(v as "Active" | "Inactive")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetBrandForm}>Cancel</Button>
            <Button onClick={handleAddBrand}>{editingBrand ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {deleteType}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this {deleteType}? This action cannot be undone.
              {deleteType === "category" && " All subcategories under this category will also be deleted."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};