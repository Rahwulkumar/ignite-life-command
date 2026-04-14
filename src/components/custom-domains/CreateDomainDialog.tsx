import { useMemo, useState } from "react";
import { Layers3 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CUSTOM_DOMAIN_ICON_OPTIONS,
  getCustomDomainIconComponent,
} from "@/components/shared/custom-domain-icons";
import {
  useCreateCustomDomain,
  type CustomDomainColor,
  type CustomDomainTemplate,
} from "@/hooks/useCustomDomains";

const COLOR_OPTIONS: Array<{ value: CustomDomainColor; label: string }> = [
  { value: "finance", label: "Finance" },
  { value: "trading", label: "Trading" },
  { value: "tech", label: "Tech" },
  { value: "spiritual", label: "Spiritual" },
  { value: "music", label: "Music" },
  { value: "content", label: "Content" },
  { value: "work", label: "Work" },
];

const TEMPLATE_OPTIONS: Array<{
  value: CustomDomainTemplate;
  label: string;
  description: string;
}> = [
  {
    value: "tracker",
    label: "Tracker",
    description: "Statuses, priorities, due dates, and notes.",
  },
  {
    value: "library",
    label: "Library",
    description: "Sources, URLs, reading state, and notes.",
  },
  {
    value: "journal",
    label: "Journal",
    description: "Dated reflections, mood, and summary fields.",
  },
  {
    value: "pipeline",
    label: "Pipeline",
    description: "Stage-based work with owner and next step.",
  },
];

interface CreateDomainDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (slug: string) => void;
}

export function CreateDomainDialog({
  open,
  onOpenChange,
  onCreated,
}: CreateDomainDialogProps) {
  const createDomain = useCreateCustomDomain();
  const [form, setForm] = useState({
    name: "",
    subtitle: "",
    color: "content" as CustomDomainColor,
    iconKey: "Layers3",
    template: "tracker" as CustomDomainTemplate,
  });

  const SelectedIcon = useMemo(
    () => getCustomDomainIconComponent(form.iconKey),
    [form.iconKey],
  );

  const handleCreate = async () => {
    if (!form.name.trim()) {
      return;
    }

    const domain = await createDomain.mutateAsync({
      name: form.name.trim(),
      subtitle: form.subtitle.trim() || undefined,
      color: form.color,
      iconKey: form.iconKey,
      template: form.template,
    });

    setForm({
      name: "",
      subtitle: "",
      color: "content",
      iconKey: "Layers3",
      template: "tracker",
    });
    onOpenChange(false);
    onCreated?.(domain.slug);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layers3 className="h-5 w-5 text-content" />
            Create Domain
          </DialogTitle>
          <DialogDescription>
            Build a new workspace from the current LifeOS design system without
            changing the visual theme.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_160px]">
            <div className="space-y-4">
              <label className="block space-y-2 text-sm">
                <span className="font-medium">Domain name</span>
                <Input
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Research Vault"
                />
              </label>

              <label className="block space-y-2 text-sm">
                <span className="font-medium">Subtitle</span>
                <Input
                  value={form.subtitle}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      subtitle: event.target.value,
                    }))
                  }
                  placeholder="Optional supporting line"
                />
              </label>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex h-full flex-col items-center justify-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                  <SelectedIcon className="h-7 w-7 text-foreground" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">
                    {form.name.trim() || "New Domain"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Theme: {form.color}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2 text-sm">
              <span className="font-medium">Theme token</span>
              <Select
                value={form.color}
                onValueChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    color: value as CustomDomainColor,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COLOR_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>

            <label className="block space-y-2 text-sm">
              <span className="font-medium">Icon</span>
              <Select
                value={form.iconKey}
                onValueChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    iconKey: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CUSTOM_DOMAIN_ICON_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    return (
                      <SelectItem key={option.key} value={option.key}>
                        <span className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {option.label}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </label>
          </div>

          <label className="block space-y-2 text-sm">
            <span className="font-medium">Starter template</span>
            <Select
              value={form.template}
              onValueChange={(value) =>
                setForm((current) => ({
                  ...current,
                  template: value as CustomDomainTemplate,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TEMPLATE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {
                TEMPLATE_OPTIONS.find((option) => option.value === form.template)
                  ?.description
              }
            </p>
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => void handleCreate()}
              disabled={createDomain.isPending || !form.name.trim()}
            >
              Create Domain
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
