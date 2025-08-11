"use client";

import { ImageUpload } from "@/components/fileUpload";
import { FormField } from "@/components/form-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { VideoUpload } from "@/components/video-upload";
import { ArrowLeft, Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const steps = [
  { id: 1, title: "Basic Details", description: "Product information" },
  { id: 2, title: "Specifications", description: "Features and details" },
  { id: 3, title: "Pricing & Inventory", description: "Price and stock" },
  { id: 4, title: "Media Upload", description: "Images and videos" },
  { id: 5, title: "Shipping", description: "Delivery options" },
  { id: 6, title: "Policies", description: "Returns and warranty" },
];

// Mock product data - in real app, this would come from API
const mockProduct = {
  id: "PROD-001",
  title: "Premium Wireless Headphones",
  brand: "AudioTech",
  category: "Electronics",
  subcategory: "Audio",
  description:
    "High-quality wireless headphones with noise cancellation and premium sound quality.",
  features: [
    "Noise Cancellation",
    "Wireless",
    "Long Battery Life",
    "Premium Sound",
  ],
  specifications: {
    color: "Black",
    material: "Premium Plastic",
    model: "AT-WH-001",
    warranty: "2 Years",
  },
  sellingPrice: 299.99,
  comparePrice: 399.99,
  costPrice: 150.0,
  sku: "AT-WH-001-BLK",
  quantity: 50,
  trackInventory: true,
  images: [
    "/placeholder.svg?height=400&width=400",
    "/placeholder.svg?height=400&width=400",
    "/placeholder.svg?height=400&width=400",
  ],
  videos: [],
  weight: 0.5,
  dimensions: { length: 20, width: 18, height: 8 },
  shippingClass: "standard",
  returnPolicy: "30-day return policy",
  warranty: "2-year manufacturer warranty",
  additionalPolicies: "Free shipping on orders over $50",
};

interface EditProductPageProps {
  params: { id: string };
}

const EditProductPage = ({ params }: EditProductPageProps) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form data with mock product data
  const [formData, setFormData] = useState({
    title: mockProduct.title,
    brand: mockProduct.brand,
    category: mockProduct.category,
    subcategory: mockProduct.subcategory,
    description: mockProduct.description,
    features: mockProduct.features,
    specifications: mockProduct.specifications,
    sellingPrice: mockProduct.sellingPrice,
    comparePrice: mockProduct.comparePrice,
    costPrice: mockProduct.costPrice,
    sku: mockProduct.sku,
    quantity: mockProduct.quantity,
    trackInventory: mockProduct.trackInventory,
    images: mockProduct.images,
    videos: mockProduct.videos,
    weight: mockProduct.weight,
    dimensions: mockProduct.dimensions,
    shippingClass: mockProduct.shippingClass,
    returnPolicy: mockProduct.returnPolicy,
    warranty: mockProduct.warranty,
    additionalPolicies: mockProduct.additionalPolicies,
  });

  const [newFeature, setNewFeature] = useState("");
  const [newSpec, setNewSpec] = useState({ key: "", value: "" });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSpecificationChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      specifications: { ...prev.specifications, [key]: value },
    }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const addSpecification = () => {
    if (newSpec.key.trim() && newSpec.value.trim()) {
      setFormData((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [newSpec.key]: newSpec.value,
        },
      }));
      setNewSpec({ key: "", value: "" });
    }
  };

  const removeSpecification = (key: string) => {
    setFormData((prev) => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      return { ...prev, specifications: newSpecs };
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Product updated successfully!");
      router.push("/products");
    } catch (error) {
      toast.error("Failed to update product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this product?")) {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success("Product deleted successfully!");
        router.push("/products");
      } catch (error) {
        toast.error("Failed to delete product");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Product Title" required>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter product title"
                />
              </FormField>
              <FormField label="Brand">
                <Input
                  value={formData.brand}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                  placeholder="Enter brand name"
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Category" required>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Clothing">Clothing</SelectItem>
                    <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Books">Books</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Subcategory">
                <Select
                  value={formData.subcategory}
                  onValueChange={(value) =>
                    handleInputChange("subcategory", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Audio">Audio</SelectItem>
                    <SelectItem value="Mobile">Mobile</SelectItem>
                    <SelectItem value="Computers">Computers</SelectItem>
                    <SelectItem value="Gaming">Gaming</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>

            <FormField label="Product Description" required>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Describe your product..."
                rows={4}
              />
            </FormField>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Key Features</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Add key features that highlight your product
              </p>

              <div className="flex gap-2 mb-4">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Enter a feature"
                  onKeyPress={(e) => e.key === "Enter" && addFeature()}
                />
                <Button onClick={addFeature} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {feature}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeFeature(index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <Label className="text-base font-medium">
                Technical Specifications
              </Label>
              <p className="text-sm text-muted-foreground mb-4">
                Add detailed specifications
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
                <Input
                  value={newSpec.key}
                  onChange={(e) =>
                    setNewSpec((prev) => ({ ...prev, key: e.target.value }))
                  }
                  placeholder="Specification name"
                />
                <Input
                  value={newSpec.value}
                  onChange={(e) =>
                    setNewSpec((prev) => ({ ...prev, value: e.target.value }))
                  }
                  placeholder="Specification value"
                />
                <Button onClick={addSpecification} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {Object.entries(formData.specifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <span className="font-medium">{key}:</span>
                    <div className="flex items-center gap-2">
                      <span>{value}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSpecification(key)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Selling Price" required>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.sellingPrice}
                  onChange={(e) =>
                    handleInputChange(
                      "sellingPrice",
                      Number.parseFloat(e.target.value)
                    )
                  }
                  placeholder="0.00"
                />
              </FormField>
              <FormField label="Compare at Price">
                <Input
                  type="number"
                  step="0.01"
                  value={formData.comparePrice}
                  onChange={(e) =>
                    handleInputChange(
                      "comparePrice",
                      Number.parseFloat(e.target.value)
                    )
                  }
                  placeholder="0.00"
                />
              </FormField>
              <FormField label="Cost per Item">
                <Input
                  type="number"
                  step="0.01"
                  value={formData.costPrice}
                  onChange={(e) =>
                    handleInputChange(
                      "costPrice",
                      Number.parseFloat(e.target.value)
                    )
                  }
                  placeholder="0.00"
                />
              </FormField>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="SKU (Stock Keeping Unit)">
                <Input
                  value={formData.sku}
                  onChange={(e) => handleInputChange("sku", e.target.value)}
                  placeholder="Enter SKU"
                />
              </FormField>
              <FormField label="Quantity">
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    handleInputChange(
                      "quantity",
                      Number.parseInt(e.target.value)
                    )
                  }
                  placeholder="0"
                />
              </FormField>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.trackInventory}
                onCheckedChange={(checked) =>
                  handleInputChange("trackInventory", checked)
                }
              />
              <Label>Track inventory for this product</Label>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Product Images</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Add at least 5 high-quality images
              </p>
              <ImageUpload
                value={formData.images}
                onChange={(images) => handleInputChange("images", images)}
                maxFiles={10}
              />
            </div>

            <Separator />

            <div>
              <Label className="text-base font-medium">Product Videos</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Add videos to showcase your product
              </p>
              <VideoUpload
                value={formData.videos}
                onChange={(videos) => handleInputChange("videos", videos)}
                maxFiles={3}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormField label="Weight (kg)">
                <Input
                  type="number"
                  step="0.01"
                  value={formData.weight}
                  onChange={(e) =>
                    handleInputChange(
                      "weight",
                      Number.parseFloat(e.target.value)
                    )
                  }
                  placeholder="0.00"
                />
              </FormField>
              <FormField label="Length (cm)">
                <Input
                  type="number"
                  value={formData.dimensions.length}
                  onChange={(e) =>
                    handleInputChange("dimensions", {
                      ...formData.dimensions,
                      length: Number.parseInt(e.target.value),
                    })
                  }
                  placeholder="0"
                />
              </FormField>
              <FormField label="Width (cm)">
                <Input
                  type="number"
                  value={formData.dimensions.width}
                  onChange={(e) =>
                    handleInputChange("dimensions", {
                      ...formData.dimensions,
                      width: Number.parseInt(e.target.value),
                    })
                  }
                  placeholder="0"
                />
              </FormField>
              <FormField label="Height (cm)">
                <Input
                  type="number"
                  value={formData.dimensions.height}
                  onChange={(e) =>
                    handleInputChange("dimensions", {
                      ...formData.dimensions,
                      height: Number.parseInt(e.target.value),
                    })
                  }
                  placeholder="0"
                />
              </FormField>
            </div>

            <FormField label="Shipping Class">
              <Select
                value={formData.shippingClass}
                onValueChange={(value) =>
                  handleInputChange("shippingClass", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select shipping class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Shipping</SelectItem>
                  <SelectItem value="express">Express Shipping</SelectItem>
                  <SelectItem value="overnight">Overnight Shipping</SelectItem>
                  <SelectItem value="free">Free Shipping</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <FormField label="Return Policy">
              <Textarea
                value={formData.returnPolicy}
                onChange={(e) =>
                  handleInputChange("returnPolicy", e.target.value)
                }
                placeholder="Describe your return policy..."
                rows={3}
              />
            </FormField>

            <FormField label="Warranty Information">
              <Textarea
                value={formData.warranty}
                onChange={(e) => handleInputChange("warranty", e.target.value)}
                placeholder="Describe warranty terms..."
                rows={3}
              />
            </FormField>

            <FormField label="Additional Policies">
              <Textarea
                value={formData.additionalPolicies}
                onChange={(e) =>
                  handleInputChange("additionalPolicies", e.target.value)
                }
                placeholder="Any additional policies or terms..."
                rows={3}
              />
            </FormField>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/products")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Edit Product</h1>
            <p className="text-muted-foreground">Update product information</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center min-w-0">
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  currentStep >= step.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step.id}
              </div>
              <div className="ml-2 min-w-0">
                <p
                  className={`text-sm font-medium ${
                    currentStep >= step.id
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {step.description}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-12 h-0.5 mx-4 ${
                  currentStep > step.id ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>
            {steps[currentStep - 1].description}
          </CardDescription>
        </CardHeader>
        <CardContent>{renderStepContent()}</CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        <Button
          onClick={currentStep === steps.length ? handleSave : nextStep}
          disabled={isLoading}
        >
          {currentStep === steps.length
            ? isLoading
              ? "Saving..."
              : "Save Changes"
            : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default EditProductPage;
