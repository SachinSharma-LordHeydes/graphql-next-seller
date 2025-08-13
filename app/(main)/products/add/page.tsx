"use client";

import { ADD_PRODUCT } from "@/client/product/product.mutations";
import { GET_PRODUCT_CATEGORIES } from "@/client/product/product.queries";
import { FormNavigation } from "@/components/product/FormNavigation";
import { ProgressStepper } from "@/components/product/ProgressStepper";
import { BasicDetailsStep } from "@/components/product/steps/BasicDetailsStep";
import { MediaStep } from "@/components/product/steps/MediaStep";
import { PoliciesStep } from "@/components/product/steps/PoliciesStep";
import { PricingStep } from "@/components/product/steps/PricingStep";
import { ShippingStep } from "@/components/product/steps/ShippingStep";
import { SpecificationsStep } from "@/components/product/steps/SpecificationsStep";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormData } from "@/types/pages/product";
import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { toast } from "sonner";

// Define steps statically here instead of importing from config
const steps = [
  { id: 1, title: "Basic Details", description: "Product information" },
  { id: 2, title: "Specifications", description: "Features and details" },
  { id: 3, title: "Pricing & Inventory", description: "Price and stock" },
  { id: 4, title: "Media Upload", description: "Images and videos" },
  { id: 5, title: "Shipping", description: "Delivery options" },
  { id: 6, title: "Policies", description: "Returns and warranty" },
];

export default function AddProductPage() {
  const [addProduct, { loading: addProductLoading, error: addProductError }] =
    useMutation(ADD_PRODUCT);

  const {
    data: getCategoryData,
    loading: getCategoryLoading,
    error: getCategoryError,
  } = useQuery(GET_PRODUCT_CATEGORIES);


  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    title: "",
    brandId: "",
    categoryId: "",
    subcategory: "",
    description: "",
    features: [],
    specifications: {},
    specificationDisplayFormat: "bullet",
    price: "",
    sku: "",
    stock: "",
    comparePrice: "",
    costPrice: "",
    trackQuantity: true,
    productMedia: [],
    promotionalMedia: [],
    weight: "",
    dimensions: "",
    shippingClass: "",
    returnPolicy: "",
    warranty: "",
  });

  // Update form data function
  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // Validation function for each step
  const validateStep = (step: number): boolean => {
    const newErrors: any = {};

    switch (step) {
      case 1: // Basic Details
        if (!formData.title.trim())
          newErrors.title = "Product title is required";
        if (!formData.categoryId) {
          newErrors.categoryId = "Category is required";
        }
        if (!formData.subcategory) {
          newErrors.subcategory = "Subcategory is required";
        }
        if (!formData.description.trim()) {
          newErrors.description = "Product description is required";
        }
        break;

      case 2: // Specifications - no required fields for now
        break;

      case 3: // Pricing
        if (!formData.price || parseFloat(formData.price) <= 0) {
          newErrors.price = "Valid selling price is required";
        }
        if (!formData.sku.trim()) {
          newErrors.sku = "SKU is required";
        }
        if (!formData.stock || parseInt(formData.stock) < 0) {
          newErrors.stock = "Valid stock quantity is required";
        }
        if (
          formData.comparePrice &&
          parseFloat(formData.comparePrice) <= parseFloat(formData.price)
        ) {
          newErrors.comparePrice =
            "Compare price should be higher than selling price";
        }
        break;

      case 4: // Media
        if (!formData.productMedia || formData.productMedia.length === 0) {
          newErrors.productMedia = "At least one product image is required";
        }
        break;

      case 5: // Shipping - no required fields
        break;

      case 6: // Policies - no required fields
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation functions
  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      toast.error("Please fix the errors before proceeding to the next step.");
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Submit function
  const handleSubmit = async () => {
    // Validate all steps

    console.log("formdata-->", formData);
    let isValid = true;
    for (let i = 1; i <= steps.length; i++) {
      if (!validateStep(i)) {
        isValid = false;
        break;
      }
    }

    if (!isValid) {
      toast.error("Please fix all errors before submitting the product.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Transform formData to match GraphQL schema
      const productInput = {
        name: formData.title,
        description: formData.description,
        status: "ACTIVE",
        categoryId: formData.subcategory || null, // Use subcategory ID as the product's categoryId (leaf category)
        brandId: formData.brandId || null,
        variants: [
          {
            sku: formData.sku,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            attributes: {},
            isDefault: true,
            specifications: Object.entries(formData.specifications).map(
              ([key, value]) => ({
                key,
                value: String(value),
              })
            ),
          },
        ],
        images: formData.productMedia.map((media, index) => ({
          url: media.url,
          altText: media.altText || media.caption || "",
          sortOrder: index,
          type: "PRIMARY",
        })),
        promotionalImages: formData.promotionalMedia.map((media, index) => ({
          url: media.url, // Fixed typo from "media.url"
          altText: media.altText || media.caption || "",
          sortOrder: index,
          type: "PROMOTIONAL",
        })),
      };

      console.log("Transformed product input-->", productInput);

      const addProductResponse = await addProduct({
        variables: {
          input: productInput,
        },
      });

      console.log("Add product response-->", addProductResponse);
      toast.success("Product has been created successfully!");
    } catch (error: any) {
      console.error("Error creating product:", error.message);
      toast.error("Failed to create product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save draft function
  // const handleSaveDraft = async () => {};

  const renderStepContent = () => {
    const stepProps = { formData, errors, updateFormData };
    const categoriesData = getCategoryData?.categories || [];

    switch (currentStep) {
      case 1:
        return <BasicDetailsStep {...stepProps} categoriesData={categoriesData} />;
      case 2:
        return <SpecificationsStep {...stepProps} categoriesData={categoriesData} />;
      case 3:
        return <PricingStep {...stepProps} />;
      case 4:
        return <MediaStep {...stepProps} />;
      case 5:
        return <ShippingStep {...stepProps} />;
      case 6:
        return <PoliciesStep {...stepProps} />;
      default:
        return null;
    }
  };

  // if (getCategoryLoading) {
  //   return <div>Loading categories...</div>;
  // }

  // if (getCategoryError) {
  //   return <div>Error loading categories: {getCategoryError.message}</div>;
  // }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
          <p className="text-muted-foreground">
            Create a new product listing by following the steps below.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">
                Product Creation Progress
              </CardTitle>
              <CardDescription>
                Step {currentStep} of {steps.length}
              </CardDescription>
            </div>
            <div className="text-sm text-muted-foreground">
              {Math.round((currentStep / steps.length) * 100)}% Complete
            </div>
          </div>
        </CardHeader>
      </Card>

      <ProgressStepper steps={steps} currentStep={currentStep} />

      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1]?.title}</CardTitle>
          <CardDescription>
            {steps[currentStep - 1]?.description}
          </CardDescription>
        </CardHeader>
        <CardContent>{renderStepContent()}</CardContent>
      </Card>

      <FormNavigation
        currentStep={currentStep}
        totalSteps={steps.length}
        onPrev={prevStep}
        onNext={nextStep}
        onSubmit={handleSubmit}
        // onSaveDraft={handleSaveDraft}
        // isSubmitting={isSubmitting}
      />
    </div>
  );
}