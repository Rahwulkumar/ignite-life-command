import { AlertTriangle, Settings, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { getCustomDomainIconComponent } from "@/components/shared/custom-domain-icons";
import { Button } from "@/components/ui/button";
import { useCustomDomains, useDeleteCustomDomain } from "@/hooks/useCustomDomains";

export default function SettingsPage() {
  const { data: customDomains = [], isLoading } = useCustomDomains();
  const deleteDomain = useDeleteCustomDomain();

  const handleDeleteDomain = async (slug: string, name: string) => {
    const shouldDelete = window.confirm(
      `Delete "${name}" and all of its fields, views, and records? This cannot be undone.`,
    );

    if (!shouldDelete) {
      return;
    }

    try {
      await deleteDomain.mutateAsync(slug);
      toast.success(`"${name}" deleted`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete domain";
      toast.error(message);
    }
  };

  return (
    <MainLayout>
      <PageTransition>
        <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="rounded-2xl border border-border bg-card/80 p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-muted p-2">
                  <Settings className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-foreground">Settings</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Manage custom domains and permanently remove any domain you no longer
                    need.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card/80 p-5">
              <div className="mb-4 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-base font-semibold text-foreground">Domain Management</h2>
              </div>

              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading domains...</p>
              ) : customDomains.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No custom domains found. Create one from Home first.
                </p>
              ) : (
                <div className="space-y-3">
                  {customDomains.map((domain) => {
                    const Icon = getCustomDomainIconComponent(domain.iconKey);
                    return (
                      <div
                        key={domain.id}
                        className="flex flex-col gap-4 rounded-xl border border-border/60 bg-background/40 p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-foreground" />
                            <p className="truncate font-medium text-foreground">{domain.name}</p>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            slug: {domain.slug} | template: {domain.template} | fields:{" "}
                            {domain.fieldCount} | records: {domain.recordCount}
                          </p>
                          {domain.subtitle ? (
                            <p className="mt-1 text-xs text-muted-foreground">{domain.subtitle}</p>
                          ) : null}
                        </div>

                        <Button
                          variant="destructive"
                          onClick={() => void handleDeleteDomain(domain.slug, domain.name)}
                          disabled={deleteDomain.isPending}
                          className="self-start sm:self-center"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Domain
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
}
