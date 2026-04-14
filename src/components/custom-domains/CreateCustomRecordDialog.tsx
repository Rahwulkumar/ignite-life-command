import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CustomDomainField } from "@/hooks/useCustomDomains";

interface CreateCustomRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  domainName: string;
  fields: CustomDomainField[];
  onSave: (payload: {
    title: string;
    values: Record<string, unknown>;
  }) => Promise<void> | void;
  isSaving?: boolean;
}

function getFieldOptions(field: CustomDomainField): string[] {
  const options = field.config?.options;
  return Array.isArray(options)
    ? options.filter((value): value is string => typeof value === "string")
    : [];
}

function isMissingRequiredValue(value: unknown) {
  return value === undefined || value === null || value === "";
}

export function CreateCustomRecordDialog({
  open,
  onOpenChange,
  domainName,
  fields,
  onSave,
  isSaving = false,
}: CreateCustomRecordDialogProps) {
  const [title, setTitle] = useState("");
  const [values, setValues] = useState<Record<string, unknown>>({});

  const orderedFields = useMemo(
    () => [...fields].sort((a, b) => a.orderIndex - b.orderIndex),
    [fields],
  );

  const missingRequiredFields = useMemo(
    () =>
      orderedFields.filter(
        (field) => field.isRequired && isMissingRequiredValue(values[field.key]),
      ),
    [orderedFields, values],
  );

  const resetForm = () => {
    setTitle("");
    setValues({});
  };

  const handleSave = async () => {
    if (!title.trim() || missingRequiredFields.length > 0) {
      return;
    }

    await onSave({
      title: title.trim(),
      values,
    });

    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          resetForm();
        }

        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Record</DialogTitle>
          <DialogDescription>
            Add a new item to {domainName} using the current domain field
            structure.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <label className="block space-y-2 text-sm">
            <span className="font-medium">Title</span>
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Record title"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            {orderedFields.map((field) => {
              const rawValue = values[field.key];
              const options = getFieldOptions(field);

              if (field.fieldType === "textarea") {
                return (
                  <label
                    key={field.id}
                    className="block space-y-2 text-sm sm:col-span-2"
                  >
                    <span className="font-medium">
                      {field.label}
                      {field.isRequired ? " *" : ""}
                    </span>
                    <Textarea
                      value={typeof rawValue === "string" ? rawValue : ""}
                      rows={4}
                      onChange={(event) =>
                        setValues((current) => ({
                          ...current,
                          [field.key]: event.target.value,
                        }))
                      }
                    />
                  </label>
                );
              }

              if (field.fieldType === "select" || field.fieldType === "status") {
                return (
                  <label key={field.id} className="block space-y-2 text-sm">
                    <span className="font-medium">
                      {field.label}
                      {field.isRequired ? " *" : ""}
                    </span>
                    <Select
                      value={typeof rawValue === "string" ? rawValue : ""}
                      onValueChange={(value) =>
                        setValues((current) => ({
                          ...current,
                          [field.key]: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${field.label}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </label>
                );
              }

              return (
                <label key={field.id} className="block space-y-2 text-sm">
                  <span className="font-medium">
                    {field.label}
                    {field.isRequired ? " *" : ""}
                  </span>
                  <Input
                    type={
                      field.fieldType === "date"
                        ? "date"
                        : field.fieldType === "url"
                          ? "url"
                          : field.fieldType === "number"
                            ? "number"
                            : "text"
                    }
                    value={
                      typeof rawValue === "number"
                        ? String(rawValue)
                        : typeof rawValue === "string"
                          ? rawValue
                          : ""
                    }
                    onChange={(event) =>
                      setValues((current) => ({
                        ...current,
                        [field.key]:
                          field.fieldType === "number"
                            ? event.target.value === ""
                              ? undefined
                              : Number(event.target.value)
                            : event.target.value,
                      }))
                    }
                  />
                </label>
              );
            })}
          </div>

          {missingRequiredFields.length > 0 && (
            <div className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
              Required before save:{" "}
              {missingRequiredFields.map((field) => field.label).join(", ")}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => void handleSave()}
              disabled={
                isSaving || !title.trim() || missingRequiredFields.length > 0
              }
            >
              Save Record
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
