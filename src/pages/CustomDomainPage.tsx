import { type ReactNode, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Database, Layers3, ListChecks, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { CreateCustomFieldDialog } from "@/components/custom-domains/CreateCustomFieldDialog";
import { CreateCustomRecordDialog } from "@/components/custom-domains/CreateCustomRecordDialog";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { DomainPageHeader } from "@/components/shared/DomainPageHeader";
import { getCustomDomainIconComponent } from "@/components/shared/custom-domain-icons";
import { DomainStatsBar } from "@/components/shared/DomainStatsBar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type CustomDomainField,
  type CustomDomainFieldType,
  useCreateCustomDomainField,
  useCreateCustomDomainRecord,
  useCustomDomain,
  useDeleteCustomDomainField,
} from "@/hooks/useCustomDomains";

function renderRecordValue(field: CustomDomainField, value: unknown): ReactNode {
  if (value === null || value === undefined || value === "") {
    return "Not set";
  }

  if (field.fieldType === "url" && typeof value === "string") {
    return (
      <a
        href={value}
        target="_blank"
        rel="noreferrer noopener"
        className="text-content underline-offset-4 hover:underline"
      >
        {value}
      </a>
    );
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return String(value);
}

function formatFieldType(fieldType: CustomDomainFieldType) {
  switch (fieldType) {
    case "textarea":
      return "long text";
    default:
      return fieldType;
  }
}

export default function CustomDomainPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, isError } = useCustomDomain(slug);
  const [isCreateRecordOpen, setIsCreateRecordOpen] = useState(false);
  const [isCreateFieldOpen, setIsCreateFieldOpen] = useState(false);
  const createRecord = useCreateCustomDomainRecord(slug ?? "");
  const createField = useCreateCustomDomainField(slug ?? "");
  const deleteField = useDeleteCustomDomainField(slug ?? "");

  const stats = useMemo(() => {
    if (!data) {
      return [
        { icon: Database, label: "Records", value: "...", suffix: "items" },
        { icon: ListChecks, label: "Fields", value: "...", suffix: "defined" },
      ];
    }

    return [
      {
        icon: Database,
        label: "Records",
        value: data.records.length,
        suffix: "items",
        color: "text-content",
      },
      {
        icon: ListChecks,
        label: "Fields",
        value: data.fields.length,
        suffix: "defined",
        color: "text-muted-foreground",
      },
      {
        icon: Layers3,
        label: "Template",
        value: data.domain.template,
        color: "text-work",
      },
      {
        icon: Database,
        label: "Required",
        value: data.fields.filter((field) => field.isRequired).length,
        suffix: "fields",
        color: "text-finance",
      },
    ];
  }, [data]);

  const handleCreateRecord = async (payload: {
    title: string;
    values: Record<string, unknown>;
  }) => {
    if (!slug) {
      return;
    }

    await createRecord.mutateAsync(payload);
    toast.success("Record created");
  };

  const handleCreateField = async (payload: {
    label: string;
    key?: string;
    fieldType: CustomDomainFieldType;
    isRequired?: boolean;
    options?: string[];
  }) => {
    if (!slug) {
      return;
    }

    await createField.mutateAsync(payload);
    toast.success("Field added");
  };

  const handleDeleteField = async (fieldId: string, label: string) => {
    if (!slug) {
      return;
    }

    const shouldDelete = window.confirm(`Remove the "${label}" field?`);
    if (!shouldDelete) {
      return;
    }

    await deleteField.mutateAsync(fieldId);
    toast.success("Field removed");
  };

  const Icon = getCustomDomainIconComponent(data?.domain.iconKey ?? "Layers3");

  return (
    <MainLayout>
      <PageTransition>
        <div className="min-h-screen">
          <DomainPageHeader
            icon={Icon}
            title={data?.domain.name ?? "Custom Domain"}
            subtitle={
              data?.domain.subtitle ?? "A dynamic workspace using the current theme"
            }
            domainColor={data?.domain.color ?? "content"}
            action={{
              icon: Plus,
              label: "New Record",
              onClick: () => setIsCreateRecordOpen(true),
            }}
          />

          <DomainStatsBar stats={stats} />

          <div className="px-4 pb-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
              <div className="rounded-2xl border border-border/45 bg-card/35 p-3 backdrop-blur-sm sm:p-4">
                {isLoading && (
                  <div className="rounded-xl border border-border/40 bg-background/45 p-6 text-sm text-muted-foreground">
                    Loading custom domain...
                  </div>
                )}

                {isError && (
                  <div className="rounded-xl border border-destructive/40 bg-background/45 p-6 text-sm text-destructive">
                    Unable to load this custom domain.
                  </div>
                )}

                {data && (
                  <Tabs defaultValue="records" className="space-y-4">
                    <TabsList className="flex-wrap border border-border/40 bg-background/60">
                      <TabsTrigger value="records">Records</TabsTrigger>
                      <TabsTrigger value="structure">Structure</TabsTrigger>
                    </TabsList>

                    <TabsContent
                      value="records"
                      className="rounded-xl border border-border/40 bg-background/45 p-3 outline-none sm:p-4"
                    >
                      <div className="grid gap-4">
                        {data.records.length === 0 ? (
                          <div className="rounded-2xl border border-border bg-card/80 p-8 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                              <Icon className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold">
                              No records yet
                            </h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                              This domain is ready. Add the first record without
                              changing the current theme or layout language.
                            </p>
                            <Button
                              className="mt-5"
                              onClick={() => setIsCreateRecordOpen(true)}
                            >
                              Create First Record
                            </Button>
                          </div>
                        ) : (
                          data.records.map((record) => (
                            <div
                              key={record.id}
                              className="rounded-2xl border border-border bg-card/80 p-5"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <h3 className="text-lg font-semibold">
                                    {record.title}
                                  </h3>
                                  <p className="mt-1 text-xs text-muted-foreground">
                                    Updated{" "}
                                    {record.updatedAt
                                      ? new Date(record.updatedAt).toLocaleString()
                                      : "recently"}
                                  </p>
                                </div>
                              </div>

                              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                {data.fields.map((field) => (
                                  <div
                                    key={field.id}
                                    className="rounded-xl border border-border/60 bg-background/40 p-3"
                                  >
                                    <div className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                                      {field.label}
                                    </div>
                                    <div className="mt-2 text-sm text-foreground">
                                      {renderRecordValue(
                                        field,
                                        record.values?.[field.key],
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent
                      value="structure"
                      className="rounded-xl border border-border/40 bg-background/45 p-3 outline-none sm:p-4"
                    >
                      <div className="rounded-2xl border border-border bg-card/80 p-5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">Field Structure</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                              Starter template: {data.domain.template}
                            </p>
                          </div>

                          <Button
                            variant="outline"
                            onClick={() => setIsCreateFieldOpen(true)}
                          >
                            <Plus className="h-4 w-4" />
                            Add Field
                          </Button>
                        </div>

                        <div className="mt-5 grid gap-3">
                          {data.fields.length === 0 ? (
                            <div className="rounded-xl border border-border/60 bg-background/40 p-4 text-sm text-muted-foreground">
                              No fields yet. Add the first field to define this
                              domain's structure.
                            </div>
                          ) : (
                            data.fields.map((field) => (
                              <div
                                key={field.id}
                                className="flex flex-col gap-3 rounded-xl border border-border/60 bg-background/40 p-4 sm:flex-row sm:items-center sm:justify-between"
                              >
                                <div>
                                  <div className="font-medium">{field.label}</div>
                                  <div className="mt-1 text-sm text-muted-foreground">
                                    {formatFieldType(field.fieldType)}
                                    {field.isRequired ? " | required" : ""}
                                  </div>
                                  <div className="mt-2 text-xs text-muted-foreground">
                                    Key: {field.key}
                                  </div>
                                </div>

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    void handleDeleteField(field.id, field.label)
                                  }
                                  disabled={deleteField.isPending}
                                >
                                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                                  <span className="sr-only">
                                    Remove {field.label}
                                  </span>
                                </Button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                )}
              </div>
            </div>
          </div>
        </div>

        {data && (
          <>
            <CreateCustomRecordDialog
              open={isCreateRecordOpen}
              onOpenChange={setIsCreateRecordOpen}
              domainName={data.domain.name}
              fields={data.fields}
              onSave={handleCreateRecord}
              isSaving={createRecord.isPending}
            />

            <CreateCustomFieldDialog
              open={isCreateFieldOpen}
              onOpenChange={setIsCreateFieldOpen}
              domainName={data.domain.name}
              onSave={handleCreateField}
              isSaving={createField.isPending}
            />
          </>
        )}
      </PageTransition>
    </MainLayout>
  );
}
