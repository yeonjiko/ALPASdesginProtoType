import { addons } from "storybook/manager-api";
import { CHANNEL_WS_DISCONNECT } from "storybook/internal/core-events";

// Storybook leaves a disconnected manager on its old index after a server restart.
// Recover only when the server is reachable and has successfully indexed stories.
addons.register("alpas/server-reconnect", () => {
  let recovering = false;
  addons.getChannel().on(CHANNEL_WS_DISCONNECT, () => {
    if (recovering) return;
    recovering = true;
    let attempts = 0;
    const retry = async () => {
      attempts += 1;
      try {
        const response = await fetch(new URL("index.json", window.location.href), {
          cache: "no-store",
          signal: AbortSignal.timeout(3000),
        });
        if (response.ok) {
          const index = await response.json();
          if (index.entries && Object.keys(index.entries).length > 0) {
            const key = "alpas-storybook-recovery";
            const lastReload = Number(sessionStorage.getItem(key) || 0);
            if (Date.now() - lastReload >= 15000) {
              sessionStorage.setItem(key, String(Date.now()));
              window.location.reload();
              return;
            }
          }
        }
      } catch {
        // The server may be restarting; keep Storybook's error visible until ready.
      }
      if (attempts < 16) window.setTimeout(retry, Math.min(attempts * 500, 5000));
      else recovering = false;
    };
    window.setTimeout(retry, 1000);
  });
});
