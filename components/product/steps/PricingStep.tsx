import { FormField, ValidatedInput } from "@/components/form-field";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Errors, FormData } from "@/types/pages/product";

interface PricingStepProps {
  formData: FormData;
  errors: Errors;
  updateFormData: (field: keyof FormData, value: any) => void;
}

export const PricingStep = ({
  formData,
  errors,
  updateFormData,
}: PricingStepProps) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FormField label="Selling Price" error={errors.price} required>
        <ValidatedInput
          type="number"
          placeholder="0.00"
          value={formData.price}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateFormData("price", e.target.value)
          }
          error={errors.price}
        />
      </FormField>
      <FormField label="Compare at Price" error={errors.comparePrice}>
        <ValidatedInput
          type="number"
          placeholder="0.00"
          value={formData.comparePrice}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            updateFormData("costPrice", e.target.value)
          }
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFormData("sku", e.target.value)
              }
              error={errors.sku}
            />
          </FormField>
          <FormField label="Stock Quantity" error={errors.stock} required>
            <ValidatedInput
              type="number"
              placeholder="0"
              value={formData.stock}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFormData("stock", e.target.value)
              }
              error={errors.stock}
            />
          </FormField>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="trackQuantity"
            checked={formData.trackQuantity}
            onCheckedChange={(checked: boolean) =>
              updateFormData("trackQuantity", checked)
            }
          />
          {/* <FormField label="Track quantity" /> */}
        </div>
      </FormField>
    </div>
  </div>
);
