"use client";

import {
  FormField,
  ValidatedInput,
  ValidatedSelect,
  ValidatedTextarea,
} from "@/components/form-field";
import { ImageUpload } from "@/components/image-upload";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useState } from "react";

// Define specification fields by category and subcategory
const specificationFields = {
  electronics: {
    smartphones: [
      { key: "ram", label: "RAM", placeholder: "e.g., 4GB, 8GB" },
      { key: "rom", label: "ROM", placeholder: "e.g., 64GB, 128GB" },
      { key: "color", label: "Color", placeholder: "e.g., Black, White" },
      {
        key: "display",
        label: "Display",
        placeholder: "e.g., 6.5 inches AMOLED",
      },
    ],
     laptops: [
      { key: "ram", label: "RAM", placeholder: "e.g., 4GB, 8GB" },
      { key: "rom", label: "ROM", placeholder: "e.g., 64GB, 128GB" },
      { key: "color", label: "Color", placeholder: "e.g., Black, White" },
      {
        key: "display",
        label: "Display",
        placeholder: "e.g., 6.5 inches AMOLED",
      },
    ],
  },
  clothing: {
    ladies: [
      { key: "size", label: "Size", placeholder: "e.g., S, M, L" },
      { key: "color", label: "Color", placeholder: "e.g., Red, Blue" },
      {
        key: "length",
        label: "Length",
        placeholder: "e.g., Short, Knee-length",
      },
    ],
     mens: [
      { key: "size", label: "Size", placeholder: "e.g., S, M, L" },
      { key: "color", label: "Color", placeholder: "e.g., Red, Blue" },
      {
        key: "length",
        label: "Length",
        placeholder: "e.g., Short, Knee-length",
      },
    ],
  },
};

// Define subcategories by category
const subcategories = {
  electronics: [
    { value: "smartphones", label: "Smartphones" },
    { value: "laptops", label: "Laptops" },
  ],
  clothing: [
    { value: "ladies", label: "Ladies" },
    { value: "mens", label: "Mens" },
  ],
};

const steps = [
  { id: 1, title: "Basic Details", description: "Product information" },
  { id: 2, title: "Specifications", description: "Features and details" },
  { id: 3, title: "Pricing & Inventory", description: "Price and stock" },
  { id: 4, title: "Media Upload", description: "Images" },
  { id: 5, title: "Shipping", description: "Delivery options" },
  { id: 6, title: "Policies", description: "Returns and warranty" },
];

export default function AddProductPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    title: "",
    brandId: "",
    categoryId: "",
    subcategory: "", // Added for subcategory selection
    description: "",
    features: [],
    specifications: {},
    price: "",
    sku: "",
    stock: "",
    comparePrice: "",
    costPrice: "",
    trackQuantity: true,
    images: [],
    videos: [], // Ignored in submission
    weight: "",
    dimensions: "",
    shippingClass: "",
    returnPolicy: "",
    warranty: "",
  });

  const progress = (currentStep / steps.length) * 100;

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.title.trim())
          newErrors.title = "Product title is required";
        if (formData.title.length > 100)
          newErrors.title = "Title must be less than 100 characters";
        if (!formData.categoryId) newErrors.categoryId = "Category is required";
        if (!formData.subcategory)
          newErrors.subcategory = "Subcategory is required";
        if (formData.description.length < 10)
          newErrors.description = "Description must be at least 10 characters";
        break;
      case 3:
        if (!formData.price) {
          newErrors.price = "Price is required";
        } else {
          const price = Number.parseFloat(formData.price);
          if (isNaN(price) || price <= 0)
            newErrors.price = "Price must be a valid positive number";
        }
        if (!formData.sku.trim()) newErrors.sku = "SKU is required";
        if (!formData.stock) {
          newErrors.stock = "Stock quantity is required";
        } else {
          const stock = Number.parseInt(formData.stock);
          if (isNaN(stock) || stock < 0)
            newErrors.stock = "Stock must be a valid non-negative number";
        }
        break;
      case 4:
        if (formData.images.length < 1)
          newErrors.images = "At least 1 image is required";
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      // Reset subcategory if category changes
      ...(field === "categoryId"
        ? { subcategory: "", specifications: {} }
        : {}),
    }));
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    const productData = {
      name: formData.title,
      // Slug is handled by the backend
      description: `${formData.description}\n\n**Return Policy**: ${
        formData.returnPolicy
      }\n**Warranty**: ${
        formData.warranty
      }\n**Features**: ${formData.features.join(", ")}`,
      status: "DRAFT",
      categoryId: formData.categoryId || null,
      brandId: formData.brandId || null,
      sellerId: "authenticated-user-id", // Replace with actual user ID from auth
      variants: [
        {
          sku: formData.sku,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          isDefault: true,
          attributes: {
            comparePrice: formData.comparePrice || null,
            costPrice: formData.costPrice || null,
            trackQuantity: formData.trackQuantity,
            weight: formData.weight || null,
            dimensions: formData.dimensions || null,
            shippingClass: formData.shippingClass || null,
            ...formData.specifications,
          },
        },
      ],
      images: formData.images.map((url, index) => ({
        url,
        altText: `Product image ${index + 1}`,
        sortOrder: index,
      })),
    };

    console.log("Submitting to Prisma:", productData);
    // await fetch("/api/products", { method: "POST", body: JSON.stringify(productData) })
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Product Title" error={errors.title} required>
                <ValidatedInput
                  placeholder="Enter product title"
                  value={formData.title}
                  onChange={(e) => updateFormData("title", e.target.value)}
                  error={errors.title}
                />
              </FormField>
              <FormField label="Brand" error={errors.brandId}>
                <ValidatedSelect
                  value={formData.brandId}
                  onValueChange={(value) => updateFormData("brandId", value)}
                  placeholder="Select brand"
                  error={errors.brandId}
                >
                  <SelectItem value="brand1">Brand 1</SelectItem>
                  <SelectItem value="brand2">Brand 2</SelectItem>
                  {/* Fetch brands dynamically in production */}
                </ValidatedSelect>
              </FormField>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Category" error={errors.categoryId} required>
                <ValidatedSelect
                  value={formData.categoryId}
                  onValueChange={(value) => updateFormData("categoryId", value)}
                  placeholder="Select category"
                  error={errors.categoryId}
                >
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="home">Home & Garden</SelectItem>
                  {/* Fetch categories dynamically in production */}
                </ValidatedSelect>
              </FormField>
              <FormField
                label="Subcategory"
                error={errors.subcategory}
                required
              >
                <ValidatedSelect
                  value={formData.subcategory}
                  onValueChange={(value) =>
                    updateFormData("subcategory", value)
                  }
                  placeholder="Select subcategory"
                  error={errors.subcategory}
                  disabled={!formData.categoryId}
                >
                  {formData.categoryId &&
                    subcategories[formData.categoryId]?.map((sub) => (
                      <SelectItem key={sub.value} value={sub.value}>
                        {sub.label}
                      </SelectItem>
                    ))}
                </ValidatedSelect>
              </FormField>
            </div>
            <FormField
              label="Product Description"
              error={errors.description}
              required
            >
              <ValidatedTextarea
                placeholder="Describe your product..."
                className="min-h-[120px]"
                value={formData.description}
                onChange={(e) => updateFormData("description", e.target.value)}
                error={errors.description}
              />
            </FormField>
          </div>
        );
      case 2:
        const specs =
          formData.categoryId &&
          formData.subcategory &&
          specificationFields[formData.categoryId]?.[formData.subcategory]
            ? specificationFields[formData.categoryId][formData.subcategory]
            : [];
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <FormField label="Key Features">
                <div className="space-y-2">
                  <ValidatedInput
                    placeholder="Add a feature and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.target.value) {
                        updateFormData("features", [
                          ...formData.features,
                          e.target.value,
                        ]);
                        e.target.value = "";
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, index) => (
                      <Badge key={index} variant="secondary">
                        {feature}
                        <X
                          className="ml-1 h-3 w-3 cursor-pointer"
                          onClick={() =>
                            updateFormData(
                              "features",
                              formData.features.filter((_, i) => i !== index)
                            )
                          }
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </FormField>
            </div>
            <Separator />
            <div className="space-y-4">
              <FormField label="Technical Specifications">
                {specs.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {specs.map((spec) => (
                      <FormField key={spec.key} label={spec.label}>
                        <ValidatedInput
                          placeholder={spec.placeholder}
                          value={formData.specifications[spec.key] || ""}
                          onChange={(e) =>
                            updateFormData("specifications", {
                              ...formData.specifications,
                              [spec.key]: e.target.value,
                            })
                          }
                        />
                      </FormField>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Select a category and subcategory to add specifications.
                  </p>
                )}
              </FormField>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Selling Price" error={errors.price} required>
                <ValidatedInput
                  type="number"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => updateFormData("price", e.target.value)}
                  error={errors.price}
                />
              </FormField>
              <FormField label="Compare at Price" error={errors.comparePrice}>
                <ValidatedInput
                  type="number"
                  placeholder="0.00"
                  value={formData.comparePrice}
                  onChange={(e) =>
                    updateFormData("comparePrice", e.target.value)
                  }
                  error={errors.comparePrice}
                />
              </FormField>
              <FormField label="Cost per Item" error={errors.costPrice}>
                <ValidatedInput
                  type="number"
                  placeholder="0.00"
                  value={formData.costPrice}
                  onChange={(e) => updateFormData("costPrice", e.target.value)}
                  error={errors.costPrice}
                />
              </FormField>
            </div>
            <Separator />
            <div className="space-y-4">
              <FormField label="Inventory">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="SKU (Stock Keeping Unit)"
                    error={errors.sku}
                    required
                  >
                    <ValidatedInput
                      placeholder="e.g., ABC-123-XYZ"
                      value={formData.sku}
                      onChange={(e) => updateFormData("sku", e.target.value)}
                      error={errors.sku}
                    />
                  </FormField>
                  <FormField
                    label="Stock Quantity"
                    error={errors.stock}
                    required
                  >
                    <ValidatedInput
                      type="number"
                      placeholder="0"
                      value={formData.stock}
                      onChange={(e) => updateFormData("stock", e.target.value)}
                      error={errors.stock}
                    />
                  </FormField>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="trackQuantity"
                    checked={formData.trackQuantity}
                    onCheckedChange={(checked) =>
                      updateFormData("trackQuantity", checked)
                    }
                  />
                  {/* <FormField label="Track quantity" /> */}
                </div>
              </FormField>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <FormField
              label="Product Images (Minimum 1 required)"
              error={errors.images}
              required
            >
              <ImageUpload
                value={formData.images}
                onChange={(images) => updateFormData("images", images)}
                maxFiles={10}
              />
            </FormField>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Weight (kg)" error={errors.weight}>
                <ValidatedInput
                  type="number"
                  placeholder="0.0"
                  value={formData.weight}
                  onChange={(e) => updateFormData("weight", e.target.value)}
                  error={errors.weight}
                />
              </FormField>
              <FormField label="Dimensions (cm)">
                <ValidatedInput
                  placeholder="e.g., 10x5x2"
                  value={formData.dimensions}
                  onChange={(e) => updateFormData("dimensions", e.target.value)}
                />
              </FormField>
              <FormField label="Shipping Class">
                <ValidatedSelect
                  value={formData.shippingClass}
                  onValueChange={(value) =>
                    updateFormData("shippingClass", value)
                  }
                  placeholder="Select shipping class"
                >
                  <SelectItem value="standard">Standard Shipping</SelectItem>
                  <SelectItem value="express">Express Shipping</SelectItem>
                  <SelectItem value="overnight">Overnight Shipping</SelectItem>
                  <SelectItem value="free">Free Shipping</SelectItem>
                </ValidatedSelect>
              </FormField>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <FormField label="Return Policy">
              <ValidatedTextarea
                placeholder="Describe your return policy..."
                className="min-h-[120px]"
                value={formData.returnPolicy}
                onChange={(e) => updateFormData("returnPolicy", e.target.value)}
              />
            </FormField>
            <FormField label="Warranty Information">
              <ValidatedTextarea
                placeholder="Describe warranty terms..."
                className="min-h-[120px]"
                value={formData.warranty}
                onChange={(e) => updateFormData("warranty", e.target.value)}
              />
            </FormField>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Add New Product</h2>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  Step {currentStep} of {steps.length}
                </CardTitle>
                <CardDescription>
                  {steps[currentStep - 1]?.title}
                </CardDescription>
              </div>
              <div className="text-sm text-muted-foreground">
                {Math.round(progress)}% Complete
              </div>
            </div>
            <Progress value={progress} className="w-full" />
          </CardHeader>
        </Card>

        <div className="flex justify-center">
          <div className="flex items-center space-x-4 overflow-x-auto pb-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                    currentStep >= step.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.id}
                </div>
                <div className="ml-2 text-sm">
                  <div
                    className={
                      currentStep >= step.id
                        ? "font-medium"
                        : "text-muted-foreground"
                    }
                  >
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-8 h-px bg-muted mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1]?.title}</CardTitle>
            <CardDescription>
              {steps[currentStep - 1]?.description}
            </CardDescription>
          </CardHeader>
          <CardContent>{renderStepContent()}</CardContent>
        </Card>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline">Save Draft</Button>
            {currentStep === steps.length ? (
              <Button onClick={handleSubmit}>Publish Product</Button>
            ) : (
              <Button onClick={nextStep}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
