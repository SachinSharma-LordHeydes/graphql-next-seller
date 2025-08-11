import { FormField, ValidatedInput } from "@/components/form-field";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Errors, FormData } from "@/types/pages/product";
import { X } from "lucide-react";

// Assuming types based on schema (add to types if needed)
interface Category {
  id: string;
  name: string;
  children: Category[];
  categorySpecification: SpecificationField[];
}

interface SpecificationField {
  id: string;
  key: string;
  label: string;
  placeholder?: string;
}

interface SpecificationsStepProps {
  formData: FormData;
  errors: Errors;
  updateFormData: (field: keyof FormData, value: any) => void;
  categoriesData: Category[];
}

export const SpecificationsStep = ({
  formData,
  errors,
  updateFormData,
  categoriesData,
}: SpecificationsStepProps) => {
  const selectedCategory = categoriesData.find((cat) => cat.id === formData.categoryId);
  const selectedSubcategory = selectedCategory?.children.find((sub) => sub.id === formData.subcategory);
  const specs: SpecificationField[] = selectedSubcategory?.categorySpecification || [];

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <FormField label="Key Features">
          <div className="space-y-2">
            <ValidatedInput
              placeholder="Add a feature and press Enter"
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter" && e.currentTarget.value) {
                  updateFormData("features", [
                    ...formData.features,
                    e.currentTarget.value,
                  ]);
                  e.currentTarget.value = "";
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
      {specs.length > 0 && Object.keys(formData.specifications).length > 0 && (
        <div className="space-y-4">
          <Separator />
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Specifications Preview</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant={
                  formData.specificationDisplayFormat === "bullet"
                    ? "default"
                    : "outline"
                }
                onClick={() =>
                  updateFormData("specificationDisplayFormat", "bullet")
                }
              >
                Bullet Points
              </Button>
              <Button
                variant={
                  formData.specificationDisplayFormat === "table"
                    ? "default"
                    : "outline"
                }
                onClick={() =>
                  updateFormData("specificationDisplayFormat", "table")
                }
              >
                Table
              </Button>
            </div>
          </div>
          {formData.specificationDisplayFormat === "bullet" ? (
            <ul className="list-disc pl-5 space-y-2">
              {Object.entries(formData.specifications).map(([key, value]) =>
                value ? (
                  <li key={key}>
                    <span className="font-medium">
                      {specs.find((spec) => spec.key === key)?.label || key}:
                    </span>{" "}
                    {value}
                  </li>
                ) : null
              )}
            </ul>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-200">
                <tbody>
                  {Object.entries(formData.specifications).map(
                    ([key, value], index) =>
                      value ? (
                        <tr
                          key={key}
                          className={
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          }
                        >
                          <td className="border border-gray-200 px-4 py-2 font-medium">
                            {specs.find((spec) => spec.key === key)?.label ||
                              key}
                          </td>
                          <td className="border border-gray-200 px-4 py-2">
                            {value}
                          </td>
                        </tr>
                      ) : null
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};