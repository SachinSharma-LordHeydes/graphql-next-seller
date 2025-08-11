// components/steps/BasicDetailsStep.tsx
import {
  FormField,
  ValidatedInput,
  ValidatedSelect,
} from "@/components/form-field";
import { SelectItem } from "@/components/ui/select";
import { Errors, FormData } from "@/types/pages/product";

interface ShippingStepProps {
  formData: FormData;
  errors: Errors;
  updateFormData: (field: keyof FormData, value: any) => void;
}

export const ShippingStep = ({
  formData,
  errors,
  updateFormData,
}: ShippingStepProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField label="Weight (kg)" error={errors.weight}>
          <ValidatedInput
            type="number"
            placeholder="0.0"
            value={formData.weight}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateFormData("weight", e.target.value)
            }
            error={errors.weight}
          />
        </FormField>
        <FormField label="Dimensions (cm)">
          <ValidatedInput
            placeholder="e.g., 10x5x2"
            value={formData.dimensions}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateFormData("dimensions", e.target.value)
            }
          />
        </FormField>
        <FormField label="Shipping Class">
          <ValidatedSelect
            value={formData.shippingClass}
            onValueChange={(value: string) =>
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
};
