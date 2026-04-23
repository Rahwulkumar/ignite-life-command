import {
  AlertTriangle,
  Bot,
  ExternalLink,
  Link2,
  RefreshCw,
  Settings,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { getCustomDomainIconComponent } from "@/components/shared/custom-domain-icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCustomDomains, useDeleteCustomDomain } from "@/hooks/useCustomDomains";
import {
  useDisconnectTelegram,
  useGenerateTelegramLinkCode,
  useTelegramConnection,
} from "@/hooks/useTelegramIntegration";

export default function SettingsPage() {
  const { data: customDomains = [], isLoading } = useCustomDomains();
  const deleteDomain = useDeleteCustomDomain();
  const { data: telegramConnection, isLoading: isTelegramLoading } = useTelegramConnection();
  const generateTelegramLinkCode = useGenerateTelegramLinkCode();
  const disconnectTelegram = useDisconnectTelegram();

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

  const handleGenerateTelegramLinkCode = async () => {
    try {
      const result = await generateTelegramLinkCode.mutateAsync();
      toast.success(
        result.deepLinkUrl
          ? "Telegram link code generated. Open the bot from this page."
          : "Telegram link code generated.",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to generate Telegram link code";
      toast.error(message);
    }
  };

  const handleDisconnectTelegram = async () => {
    const shouldDisconnect = window.confirm(
      "Disconnect Telegram from this LifeOS account?",
    );

    if (!shouldDisconnect) {
      return;
    }

    try {
      await disconnectTelegram.mutateAsync();
      toast.success("Telegram disconnected");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to disconnect Telegram";
      toast.error(message);
    }
  };

  const handleCopyLinkCode = async () => {
    if (!telegramConnection?.linkCode) {
      return;
    }

    try {
      await navigator.clipboard.writeText(telegramConnection.linkCode);
      toast.success("Link code copied");
    } catch {
      toast.error("Could not copy the link code");
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
                <Bot className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-base font-semibold text-foreground">Telegram Capture</h2>
              </div>

              {isTelegramLoading ? (
                <p className="text-sm text-muted-foreground">Loading Telegram status...</p>
              ) : telegramConnection?.configured === false ? (
                <div className="space-y-3">
                  <Badge variant="outline" className="w-fit">
                    Not configured
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Add `TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_USERNAME`, and
                    `TELEGRAM_WEBHOOK_SECRET` on the server before using phone capture.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant={
                        telegramConnection?.status === "linked" ? "default" : "outline"
                      }
                      className="w-fit"
                    >
                      {telegramConnection?.status === "linked"
                        ? "Linked"
                        : telegramConnection?.status === "pending"
                          ? "Waiting for bot link"
                          : "Not linked"}
                    </Badge>
                    <Badge variant="outline" className="w-fit">
                      Voice notes{" "}
                      {telegramConnection?.voiceTranscriptionEnabled ? "enabled" : "disabled"}
                    </Badge>
                    <Badge variant="outline" className="w-fit">
                      Gemini intent{" "}
                      {telegramConnection?.geminiIntentEnabled ? "enabled" : "disabled"}
                    </Badge>
                  </div>

                  {telegramConnection?.status === "linked" ? (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Telegram is linked{telegramConnection.telegramUsername
                          ? ` as @${telegramConnection.telegramUsername}`
                          : ""}. Telegram is the mobile capture surface for LifeOS.
                        Commands like `/done gym` and `/bible Genesis 12` work directly,
                        and plain language like `I completed gym` is parsed automatically.
                      </p>
                      {telegramConnection.linkedAt ? (
                        <p className="text-xs text-muted-foreground">
                          Linked on {new Date(telegramConnection.linkedAt).toLocaleString()}
                        </p>
                      ) : null}
                      <div className="flex flex-wrap gap-3">
                        {telegramConnection.botUrl ? (
                          <Button variant="outline" asChild>
                            <a
                              href={telegramConnection.botUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Open Bot
                            </a>
                          </Button>
                        ) : null}
                        <Button
                          variant="destructive"
                          onClick={() => void handleDisconnectTelegram()}
                          disabled={disconnectTelegram.isPending}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Disconnect Telegram
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Connect Telegram once, then use it as the mobile input layer for
                        LifeOS. The bot can handle direct commands, natural-language task
                        completion, Bible progress updates, and journal captures.
                      </p>

                      {telegramConnection?.status === "pending" && telegramConnection.linkCode ? (
                        <div className="rounded-xl border border-border/60 bg-background/50 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                Link Code
                              </p>
                              <p className="mt-2 font-mono text-2xl font-semibold tracking-[0.3em] text-foreground">
                                {telegramConnection.linkCode}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Button variant="outline" onClick={() => void handleCopyLinkCode()}>
                                <Link2 className="mr-2 h-4 w-4" />
                                Copy Code
                              </Button>
                              {telegramConnection.deepLinkUrl ? (
                                <Button asChild>
                                  <a
                                    href={telegramConnection.deepLinkUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Open Telegram Bot
                                  </a>
                                </Button>
                              ) : null}
                            </div>
                          </div>

                          <p className="mt-3 text-sm text-muted-foreground">
                            Send `/link {telegramConnection.linkCode}` to the bot, or use
                            the deep link above if the bot username is configured.
                          </p>
                          {telegramConnection.linkCodeExpiresAt ? (
                            <p className="mt-1 text-xs text-muted-foreground">
                              Expires on{" "}
                              {new Date(telegramConnection.linkCodeExpiresAt).toLocaleString()}
                            </p>
                          ) : null}
                        </div>
                      ) : null}

                      <div className="flex flex-wrap gap-3">
                        <Button
                          onClick={() => void handleGenerateTelegramLinkCode()}
                          disabled={generateTelegramLinkCode.isPending}
                        >
                          {telegramConnection?.status === "pending" ? (
                            <RefreshCw className="mr-2 h-4 w-4" />
                          ) : (
                            <Bot className="mr-2 h-4 w-4" />
                          )}
                          {telegramConnection?.status === "pending"
                            ? "Regenerate Link Code"
                            : "Generate Link Code"}
                        </Button>

                        {telegramConnection?.botUrl ? (
                          <Button variant="outline" asChild>
                            <a
                              href={telegramConnection.botUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View Bot
                            </a>
                          </Button>
                        ) : null}
                      </div>

                      <div className="rounded-xl border border-border/60 bg-background/40 p-4">
                        <p className="text-sm font-medium text-foreground">Examples</p>
                        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                          <p>`/done gym`</p>
                          <p>`/bible Genesis 12`</p>
                          <p>`/journal Today felt disciplined and focused`</p>
                          <p>`I completed gym`</p>
                          <p>`Workout done`</p>
                          <p>`Finished bible reading`</p>
                          <p>`Read Genesis 12 today`</p>
                          <p>`Today was difficult but I stayed disciplined`</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
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
