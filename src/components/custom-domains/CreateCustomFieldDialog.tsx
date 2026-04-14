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
import { Switch } from "@/components/ui/switch";
import { type CustomDomainFieldType } from "@/hooks/useCustomDomains";

const FIELD_TYPE_OPTIONS: Array<{
  value: CustomDomainFieldType;
  label: string;
  description: string;
}> = [
  {
    value: "text",
    label: "Text",
    description: "Short labels, names, and simple values.",
  },
  {
    value: "textarea",
    label: "Long Text",
    description: "Notes, summaries, and multi-line content.",
  },
  {
    value: "select",
    label: "Select",
    description: "Choose one option from a list.",
  },
  {
    value: "status",
    label: "Status",
    description: "Pipeline-style stage or progress labels.",
  },
  {
    value: "date",
    label: "Date",
    description: "Calendar dates and deadlines.",
  },
  {
    value: "url",
    label: "URL",
    description: "Links to resources or references.",
  },
  {
    value: "number",
    label: "Number",
    description: "Counts, amounts, and numeric metrics.",
  },
];

interface CreateCustomFieldDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  domainName: string;
  onSave: (payload: {
    label: string;
    key?: string;
    fieldType: CustomDomainFieldType;
    isRequired?: boolean;
    options?: string[];
  }) => Promise<void> | void;
  isSaving?: boolean;
}

export function CreateCustomFieldDialog({
  open,
  onOpenChange,
  domainName,
  onSave,
  isSaving = false,
}: CreateCustomFieldDialogProps) {
  const [label, setLabel] = useState("");
  const [key, setKey] = useState("");
  const [fieldType, setFieldType] = useState<CustomDomainFieldType>("text");
  const [isRequired, setIsRequired] = useState(false);
  const [optionsText, setOptionsText] = useState("");

  const selectedFieldType = useMemo(
    () => FIELD_TYPE_OPTIONS.find((option) => option.value === fieldType),
    [fieldType],
  );

  const supportsOptions = fieldType === "select" || fieldType === "status";

  const resetForm = () => {
    setLabel("");
    setKey("");
    setFieldType("text");
    setIsRequired(false);
    setOptionsText("");
  };

  const handleSave = async () => {
    if (!label.trim()) {
      return;
    }

    const options = supportsOptions
      ? optionsText
          .split(/\r?\n|,/)
          .map((value) => value.trim())
          .filter(Boolean)
      : undefined;

    await onSave({
      label: label.trim(),
      key: key.trim() || undefined,
      fieldType,
      isRequired,
      options,
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
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add Field</DialogTitle>
          <DialogDescription>
            Extend {domainName} without changing the current theme or page
            structure.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2 text-sm">
              <span className="font-medium">Label</span>
              <Input
                value={label}
                onChange={(event) => setLabel(event.target.value)}
                placeholder="Priority"
              />
            </label>

            <label className="block space-y-2 text-sm">
              <span className="font-medium">Key</span>
              <Input
                value={key}
                onChange={(event) => setKey(event.target.value)}
                placeholder="Optional custom key"
              />
              <span className="text-xs text-muted-foreground">
                Leave blank to generate it from the label.
              </span>
            </label>
          </div>

          <label className="block space-y-2 text-sm">
            <span className="font-medium">Field type</span>
            <Select
              value={fieldType}
              onValueChange={(value) =>
                setFieldType(value as CustomDomainFieldType)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FIELD_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {selectedFieldType?.description}
            </p>
          </label>

          {supportsOptions && (
            <label className="block space-y-2 text-sm">
              <span className="font-medium">Options</span>
              <Textarea
                value={optionsText}
                onChange={(event) => setOptionsText(event.target.value)}
                rows={4}
                placeholder={"planned\nactive\nblocked\ndone"}
              />
              <span className="text-xs text-muted-foreground">
                Enter one option per line or separate them with commas.
              </span>
            </label>
          )}

          <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3">
            <div>
              <div className="text-sm font-medium">Required field</div>
              <div className="mt-1 text-xs text-muted-foreground">
                Records will need a value before they can be saved.
              </div>
            </div>

            <Switch checked={isRequired} onCheckedChange={setIsRequired} />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => void handleSave()}
              disabled={isSaving || !label.trim()}
            >
              Add Field
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
