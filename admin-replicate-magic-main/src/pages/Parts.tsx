import { useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { PartEntryForm } from "@/components/parts/PartEntryForm";
import { CreateKitForm } from "@/components/parts/CreateKitForm";
import { PartsList, Part } from "@/components/parts/PartsList";
import { KitsList, Kit } from "@/components/parts/KitsList";
import { ItemsListView, Item } from "@/components/parts/ItemsListView";
import { AttributesPage } from "@/components/attributes/AttributesPage";
import { ModelsPage } from "@/components/models/ModelsPage";
import { cn } from "@/lib/utils";
import { Plus, Package, Settings, Layers } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

type TopTab = "parts-entry" | "items" | "attributes" | "models";
type LeftTab = "part-entry" | "create-kit";
type RightTab = "parts-list" | "kits-list";

const Parts = () => {
  const [topTab, setTopTab] = useState<TopTab>("parts-entry");
  const [leftTab, setLeftTab] = useState<LeftTab>("part-entry");
  const [rightTab, setRightTab] = useState<RightTab>("parts-list");
  const [showItemsForm, setShowItemsForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [parts, setParts] = useState<Part[]>([]);
  const [kits, setKits] = useState<Kit[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  const handleSavePart = (partData: any) => {
    const newPart: Part = {
      id: Date.now().toString(),
      partNo: partData.partNo,
      brand: partData.brand || "-",
      uom: partData.uom || "NOS",
      cost: parseFloat(partData.cost) || null,
      price: parseFloat(partData.priceA) || null,
      stock: 0,
    };
    setParts((prev) => [newPart, ...prev]);
  };

  const handleSaveKit = (kitData: any) => {
    const newKit: Kit = {
      id: Date.now().toString(),
      name: kitData.kitName,
      badge: kitData.status,
      itemsCount: kitData.items.length,
      totalCost: 0,
      price: parseFloat(kitData.sellingPrice) || 0,
    };
    setKits((prev) => [newKit, ...prev]);
  };

  const handleDeleteKit = (kit: Kit) => {
    setKits((prev) => prev.filter((k) => k.id !== kit.id));
  };

  const handleUpdateKit = (updatedKit: Kit) => {
    setKits((prev) => prev.map((k) => k.id === updatedKit.id ? updatedKit : k));
  };

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden ml-16">
        <Header />

        {/* Top Navigation Tabs */}
        <div className="bg-card border-b border-border px-4 py-2">
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={() => setTopTab("parts-entry")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all text-xs font-medium",
                topTab === "parts-entry"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Plus className="w-3.5 h-3.5" />
              Parts Entry
            </button>
            <button
              onClick={() => {
                setTopTab("items");
                setSelectedPart(null);
              }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all text-xs font-medium",
                topTab === "items"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Package className="w-3.5 h-3.5" />
              Items
            </button>
            <button
              onClick={() => {
                setTopTab("attributes");
                setSelectedPart(null);
              }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all text-xs font-medium",
                topTab === "attributes"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Settings className="w-3.5 h-3.5" />
              Attributes
            </button>
            <button
              onClick={() => {
                setTopTab("models");
                setSelectedPart(null);
              }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all text-xs font-medium",
                topTab === "models"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Layers className="w-3.5 h-3.5" />
              Models
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 overflow-auto">
          {topTab === "parts-entry" && (
            <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg">
              {/* Left Section - Forms */}
              <ResizablePanel defaultSize={60} minSize={20} maxSize={80}>
                <div className="h-full flex flex-col pr-3">
                  {/* Left Tabs */}
                  <div className="flex border-b border-border mb-3">
                    <button
                      onClick={() => {
                        setLeftTab("part-entry");
                        setRightTab("parts-list");
                      }}
                      className={cn(
                        "px-4 py-2 text-xs font-medium transition-all relative",
                        leftTab === "part-entry"
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Part Entry
                      {leftTab === "part-entry" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setLeftTab("create-kit");
                        setRightTab("kits-list");
                      }}
                      className={cn(
                        "px-4 py-2 text-xs font-medium transition-all relative",
                        leftTab === "create-kit"
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Create Kit
                      {leftTab === "create-kit" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                      )}
                    </button>
                  </div>

                  {/* Form Content */}
                  <div className="flex-1 overflow-auto">
                    {leftTab === "part-entry" ? (
                      <PartEntryForm 
                        onSave={handleSavePart} 
                        selectedPart={selectedPart}
                        onClearSelection={() => setSelectedPart(null)}
                      />
                    ) : (
                      <CreateKitForm onSave={handleSaveKit} />
                    )}
                  </div>
                </div>
              </ResizablePanel>

              {/* Resizable Handle */}
              <ResizableHandle withHandle className="mx-1 bg-border hover:bg-primary/50 transition-colors data-[resize-handle-active]:bg-primary" />

              {/* Right Section - Lists */}
              <ResizablePanel defaultSize={40} minSize={20} maxSize={80}>
                <div className="h-full flex flex-col pl-3">
                  {/* Right Tabs */}
                  <div className="flex border-b border-border mb-3">
                    <button
                      onClick={() => setRightTab("parts-list")}
                      className={cn(
                        "px-4 py-2 text-xs font-medium transition-all relative flex-1 text-center",
                        rightTab === "parts-list"
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Parts List
                      {rightTab === "parts-list" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                      )}
                    </button>
                    <button
                      onClick={() => setRightTab("kits-list")}
                      className={cn(
                        "px-4 py-2 text-xs font-medium transition-all relative flex-1 text-center",
                        rightTab === "kits-list"
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Kits List
                      {rightTab === "kits-list" && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                      )}
                    </button>
                  </div>

                  {/* List Content */}
                  <div className="flex-1 overflow-hidden">
                    {rightTab === "parts-list" ? (
                      <PartsList 
                        parts={parts} 
                        onSelectPart={(part) => {
                          setSelectedPart(part);
                          setLeftTab("part-entry");
                        }}
                      />
                    ) : (
                      <KitsList kits={kits} onDelete={handleDeleteKit} onUpdateKit={handleUpdateKit} />
                    )}
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          )}

          {topTab === "items" && (
            <ItemsListView 
              items={items}
              onEdit={(item) => {
                setEditingItem(item);
                setShowItemsForm(true);
              }}
              onDelete={(item) => setItems(prev => prev.filter(i => i.id !== item.id))}
              onAddNew={() => {
                setEditingItem(null);
                setShowItemsForm(true);
              }}
              onStatusChange={(item, newStatus) => {
                setItems(prev => prev.map(i => 
                  i.id === item.id ? { ...i, status: newStatus } : i
                ));
              }}
              showForm={showItemsForm}
              onCancelForm={() => {
                setShowItemsForm(false);
                setEditingItem(null);
              }}
              onSavePart={(partData, isEdit, editItemId) => {
                if (isEdit && editItemId) {
                  // Update existing item
                  setItems(prev => prev.map(i => 
                    i.id === editItemId ? {
                      ...i,
                      masterPartNo: partData.masterPartNo || i.masterPartNo,
                      partNo: partData.partNo,
                      brand: partData.brand || i.brand,
                      description: partData.description || i.description,
                      category: partData.category || i.category,
                      subCategory: partData.subCategory || i.subCategory,
                      application: partData.application || i.application,
                      status: partData.status === "A" ? "Active" : "Inactive",
                    } : i
                  ));
                } else {
                  // Create new item
                  const newItem: Item = {
                    id: Date.now().toString(),
                    masterPartNo: partData.masterPartNo || "",
                    partNo: partData.partNo,
                    brand: partData.brand || "",
                    description: partData.description || "",
                    category: partData.category || "",
                    subCategory: partData.subCategory || "",
                    application: partData.application || "",
                    status: "Active",
                    images: [],
                  };
                  setItems(prev => [newItem, ...prev]);
                }
                setEditingItem(null);
              }}
              editItem={editingItem}
              kits={kits}
              onDeleteKit={handleDeleteKit}
              onUpdateKit={handleUpdateKit}
            />
          )}

          {topTab === "attributes" && (
            <AttributesPage />
          )}

          {topTab === "models" && (
            <ModelsPage items={items} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Parts;
