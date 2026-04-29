import { useEffect } from "react";
import {
  AlertTriangle,
  Bot,
  ExternalLink,
  Link2,
  LineChart,
  Mail,
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
import {
  useDisconnectKiteConnection,
  useGetKiteConnectUrl,
  useKiteConnection,
  useSyncKiteConnection,
} from "@/hooks/useKiteIntegration";
import {
  useConnectGrowwConnection,
  useDisconnectGrowwConnection,
  useGrowwConnection,
  useSyncGrowwConnection,
} from "@/hooks/useGrowwIntegration";
import {
  useDisconnectGoogleInvestments,
  useGetGoogleInvestmentConnectUrl,
  useGoogleInvestmentConnection,
  useSyncGoogleInvestments,
} from "@/hooks/useGoogleInvestmentIntegration";

export default function SettingsPage() {
  const { data: customDomains = [], isLoading } = useCustomDomains();
  const deleteDomain = useDeleteCustomDomain();
  const { data: telegramConnection, isLoading: isTelegramLoading } = useTelegramConnection();
  const generateTelegramLinkCode = useGenerateTelegramLinkCode();
  const disconnectTelegram = useDisconnectTelegram();
  const { data: kiteConnection, isLoading: isKiteLoading } = useKiteConnection();
  const getKiteConnectUrl = useGetKiteConnectUrl();
  const syncKiteConnection = useSyncKiteConnection();
  const disconnectKiteConnection = useDisconnectKiteConnection();
  const { data: growwConnection, isLoading: isGrowwLoading } = useGrowwConnection();
  const connectGrowwConnection = useConnectGrowwConnection();
  const syncGrowwConnection = useSyncGrowwConnection();
  const disconnectGrowwConnection = useDisconnectGrowwConnection();
  const {
    data: googleInvestmentConnection,
    isLoading: isGoogleInvestmentLoading,
  } = useGoogleInvestmentConnection();
  const getGoogleInvestmentConnectUrl = useGetGoogleInvestmentConnectUrl();
  const syncGoogleInvestments = useSyncGoogleInvestments();
  const disconnectGoogleInvestments = useDisconnectGoogleInvestments();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const kiteStatus = params.get("kite_status");
    const kiteMessage = params.get("kite_message");
    const googleStatus = params.get("google_status");
    const googleMessage = params.get("google_message");
    let handled = false;

    if (kiteStatus === "connected") {
      toast.success("Kite connected and initial sync finished.");
      handled = true;
    } else if (kiteStatus === "error") {
      toast.error(kiteMessage || "Kite connection failed.");
      handled = true;
    }

    if (googleStatus === "connected") {
      toast.success(googleMessage || "Gmail connected and investment sync finished.");
      handled = true;
    } else if (googleStatus === "error") {
      toast.error(googleMessage || "Gmail investment connection failed.");
      handled = true;
    }

    if (!handled) {
      return;
    }

    params.delete("kite_status");
    params.delete("kite_message");
    params.delete("google_status");
    params.delete("google_message");

    const nextQuery = params.toString();
    const nextUrl = nextQuery
      ? `${window.location.pathname}?${nextQuery}`
      : window.location.pathname;

    window.history.replaceState({}, document.title, nextUrl);
  }, []);

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

  const handleConnectKite = async () => {
    try {
      const result = await getKiteConnectUrl.mutateAsync();
      window.location.assign(result.loginUrl);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to start Kite connection";
      toast.error(message);
    }
  };

  const handleSyncKite = async () => {
    try {
      const result = await syncKiteConnection.mutateAsync();
      toast.success(
        `Kite synced: ${result.sync.holdingsCount} holdings and ${result.sync.tradesCount} trades.`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to sync Kite";
      toast.error(message);
    }
  };

  const handleDisconnectKite = async () => {
    const shouldDisconnect = window.confirm(
      "Disconnect Kite and remove all synced Kite portfolio data from this LifeOS account?",
    );

    if (!shouldDisconnect) {
      return;
    }

    try {
      await disconnectKiteConnection.mutateAsync();
      toast.success("Kite disconnected");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to disconnect Kite";
      toast.error(message);
    }
  };

  const handleConnectGroww = async () => {
    try {
      const result = await connectGrowwConnection.mutateAsync();
      toast.success(
        `Groww synced: ${result.sync.holdingsCount} holdings and ${result.sync.tradesCount} trades.`,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to connect Groww";
      toast.error(message);
    }
  };

  const handleSyncGroww = async () => {
    try {
      const result = await syncGrowwConnection.mutateAsync();
      toast.success(
        `Groww synced: ${result.sync.holdingsCount} holdings and ${result.sync.tradesCount} trades.`,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to sync Groww";
      toast.error(message);
    }
  };

  const handleDisconnectGroww = async () => {
    const shouldDisconnect = window.confirm(
      "Disconnect Groww and remove all synced Groww portfolio data from this LifeOS account?",
    );

    if (!shouldDisconnect) {
      return;
    }

    try {
      await disconnectGrowwConnection.mutateAsync();
      toast.success("Groww disconnected");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to disconnect Groww";
      toast.error(message);
    }
  };

  const handleConnectGoogleInvestments = async () => {
    try {
      const result = await getGoogleInvestmentConnectUrl.mutateAsync();
      window.location.assign(result.loginUrl);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to start Gmail connection";
      toast.error(message);
    }
  };

  const handleSyncGoogleInvestments = async () => {
    try {
      const result = await syncGoogleInvestments.mutateAsync();
      toast.success(
        `Gmail synced: ${result.sync.transactionsExtracted} transactions, ${result.sync.holdingsUpdated} holdings.`,
      );

      if (result.sync.attachmentOnlyMessages > 0) {
        toast.message(
          `${result.sync.attachmentOnlyMessages} CAS/PDF messages were found and queued for parser support.`,
        );
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to sync Gmail investments";
      toast.error(message);
    }
  };

  const handleDisconnectGoogleInvestments = async () => {
    const shouldDisconnect = window.confirm(
      "Disconnect Gmail investment sync and remove email-derived investment data from this LifeOS account?",
    );

    if (!shouldDisconnect) {
      return;
    }

    try {
      await disconnectGoogleInvestments.mutateAsync();
      toast.success("Gmail investment sync disconnected");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to disconnect Gmail investments";
      toast.error(message);
    }
  };

  return (
    <MainLayout>
      <PageTransition>
        <div className="min-h-screen px-4 pb-6 pt-20 sm:px-6 sm:pb-8 sm:pt-24 lg:px-8">
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
                <LineChart className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-base font-semibold text-foreground">Kite Portfolio Sync</h2>
              </div>

              {isKiteLoading ? (
                <p className="text-sm text-muted-foreground">Loading Kite status...</p>
              ) : kiteConnection?.configured === false ? (
                <div className="space-y-3">
                  <Badge variant="outline" className="w-fit">
                    Not configured
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Add `KITE_API_KEY`, `KITE_API_SECRET`, and `KITE_REDIRECT_URI` on the
                    server before connecting Zerodha.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant={
                        kiteConnection?.status === "connected" ? "default" : "outline"
                      }
                      className="w-fit"
                    >
                      {kiteConnection?.status === "connected"
                        ? "Connected"
                        : kiteConnection?.status === "expired"
                          ? "Reconnect required"
                          : kiteConnection?.status === "error"
                            ? "Sync error"
                            : "Not linked"}
                    </Badge>

                    {kiteConnection?.providerUserId ? (
                      <Badge variant="outline" className="w-fit">
                        {kiteConnection.providerUserId}
                      </Badge>
                    ) : null}
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Connect your Zerodha Kite account once, then sync holdings and executed
                    trades directly into the investments page. Access tokens still expire on
                    Kite&apos;s side, so reconnect may occasionally be required.
                  </p>

                  {kiteConnection?.accountLabel ? (
                    <p className="text-sm text-foreground">
                      Connected account: {kiteConnection.accountLabel}
                    </p>
                  ) : null}

                  {kiteConnection?.lastSyncedAt ? (
                    <p className="text-xs text-muted-foreground">
                      Last synced on {new Date(kiteConnection.lastSyncedAt).toLocaleString()}
                    </p>
                  ) : null}

                  {kiteConnection?.lastError ? (
                    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                      {kiteConnection.lastError}
                    </div>
                  ) : null}

                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => void handleConnectKite()}
                      disabled={getKiteConnectUrl.isPending}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      {kiteConnection?.status === "connected" ? "Reconnect Kite" : "Connect Kite"}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => void handleSyncKite()}
                      disabled={
                        syncKiteConnection.isPending || kiteConnection?.status === "not-linked"
                      }
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Sync Now
                    </Button>

                    {kiteConnection?.status !== "not-linked" ? (
                      <Button
                        variant="destructive"
                        onClick={() => void handleDisconnectKite()}
                        disabled={disconnectKiteConnection.isPending}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Disconnect Kite
                      </Button>
                    ) : null}
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-card/80 p-5">
              <div className="mb-4 flex items-center gap-2">
                <LineChart className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-base font-semibold text-foreground">Groww Portfolio Sync</h2>
              </div>

              {isGrowwLoading ? (
                <p className="text-sm text-muted-foreground">Loading Groww status...</p>
              ) : growwConnection?.configured === false ? (
                <div className="space-y-3">
                  <Badge variant="outline" className="w-fit">
                    Not configured
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Add `GROWW_ACCESS_TOKEN` or `GROWW_API_KEY` + `GROWW_API_SECRET`
                    on the server before connecting Groww.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant={
                        growwConnection?.status === "connected" ? "default" : "outline"
                      }
                      className="w-fit"
                    >
                      {growwConnection?.status === "connected"
                        ? "Connected"
                        : growwConnection?.status === "expired"
                          ? "Reconnect required"
                          : growwConnection?.status === "error"
                            ? "Sync error"
                            : "Not linked"}
                    </Badge>

                    {growwConnection?.providerUserId ? (
                      <Badge variant="outline" className="w-fit">
                        {growwConnection.providerUserId}
                      </Badge>
                    ) : null}

                    {growwConnection?.authMode ? (
                      <Badge variant="outline" className="w-fit">
                        {growwConnection.authMode === "access_token"
                          ? "Access token"
                          : "API key"}
                      </Badge>
                    ) : null}
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Sync Groww equities and ETFs directly into the investments page.
                    Groww access tokens expire daily, and executed orders currently sync
                    from Groww&apos;s current-day order history.
                  </p>

                  {growwConnection?.accountLabel ? (
                    <p className="text-sm text-foreground">
                      Connected account: {growwConnection.accountLabel}
                    </p>
                  ) : null}

                  {growwConnection?.lastSyncedAt ? (
                    <p className="text-xs text-muted-foreground">
                      Last synced on {new Date(growwConnection.lastSyncedAt).toLocaleString()}
                    </p>
                  ) : null}

                  {growwConnection?.lastError ? (
                    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                      {growwConnection.lastError}
                    </div>
                  ) : null}

                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => void handleConnectGroww()}
                      disabled={connectGrowwConnection.isPending}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      {growwConnection?.status === "connected"
                        ? "Reconnect Groww"
                        : "Connect Groww"}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => void handleSyncGroww()}
                      disabled={
                        syncGrowwConnection.isPending ||
                        growwConnection?.status === "not-linked"
                      }
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Sync Now
                    </Button>

                    {growwConnection?.status !== "not-linked" ? (
                      <Button
                        variant="destructive"
                        onClick={() => void handleDisconnectGroww()}
                        disabled={disconnectGrowwConnection.isPending}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Disconnect Groww
                      </Button>
                    ) : null}
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-card/80 p-5">
              <div className="mb-4 flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-base font-semibold text-foreground">
                  Gmail Investment Email Sync
                </h2>
              </div>

              {isGoogleInvestmentLoading ? (
                <p className="text-sm text-muted-foreground">
                  Loading Gmail investment sync status...
                </p>
              ) : googleInvestmentConnection?.configured === false ? (
                <div className="space-y-3">
                  <Badge variant="outline" className="w-fit">
                    Not configured
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Add `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and
                    `GOOGLE_REDIRECT_URI` on the server before connecting Gmail.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant={
                        googleInvestmentConnection?.status === "connected"
                          ? "default"
                          : "outline"
                      }
                      className="w-fit"
                    >
                      {googleInvestmentConnection?.status === "connected"
                        ? "Connected"
                        : googleInvestmentConnection?.status === "expired"
                          ? "Reconnect required"
                          : googleInvestmentConnection?.status === "error"
                            ? "Sync error"
                            : "Not linked"}
                    </Badge>

                    {googleInvestmentConnection?.email ? (
                      <Badge variant="outline" className="w-fit">
                        {googleInvestmentConnection.email}
                      </Badge>
                    ) : null}
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Reads only investment-related Gmail messages from Groww,
                    CAMS, KFintech, MF Central, CDSL, and NSDL. Parsed mutual
                    fund transactions are reconstructed into holdings and valued
                    with AMFI NAV data.
                  </p>

                  {googleInvestmentConnection?.lastSyncedAt ? (
                    <p className="text-xs text-muted-foreground">
                      Last synced on{" "}
                      {new Date(googleInvestmentConnection.lastSyncedAt).toLocaleString()}
                    </p>
                  ) : null}

                  {googleInvestmentConnection?.lastError ? (
                    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                      {googleInvestmentConnection.lastError}
                    </div>
                  ) : null}

                  <div className="rounded-xl border border-border/60 bg-background/40 p-4 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground">Automation path</p>
                    <p className="mt-2">
                      The system searches investment senders, extracts transaction
                      facts from email text, queues CAS PDF messages for parser
                      support, dedupes by Gmail message ID, and writes a separate
                      `investment_email` source into the Investments page.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => void handleConnectGoogleInvestments()}
                      disabled={getGoogleInvestmentConnectUrl.isPending}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      {googleInvestmentConnection?.status === "connected"
                        ? "Reconnect Gmail"
                        : "Connect Gmail"}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => void handleSyncGoogleInvestments()}
                      disabled={
                        syncGoogleInvestments.isPending ||
                        googleInvestmentConnection?.status === "not-linked"
                      }
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Sync Investment Emails
                    </Button>

                    {googleInvestmentConnection?.status !== "not-linked" ? (
                      <Button
                        variant="destructive"
                        onClick={() => void handleDisconnectGoogleInvestments()}
                        disabled={disconnectGoogleInvestments.isPending}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Disconnect Gmail
                      </Button>
                    ) : null}
                  </div>
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
