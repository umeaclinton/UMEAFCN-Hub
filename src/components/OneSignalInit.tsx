"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    OneSignalDeferred?: any[];
  }
}

export default function OneSignalInit() {
  useEffect(() => {
    const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
    if (!appId || typeof window === "undefined") return;

    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async (OneSignal: any) => {
      await OneSignal.init({
        appId: appId,
        allowLocalhostAsSecureOrigin: process.env.NODE_ENV === "development",
        notifyButton: {
          enable: false,
        },
        promptOptions: {
          slidedown: {
            prompts: [
              {
                type: "push",
                autoPrompt: true,
                text: {
                  actionMessage: "Get instant alerts whenever new Remote Jobs, Scholarships & Career Opportunities are posted.",
                  acceptButton: "Allow Alerts",
                  cancelButton: "Maybe Later",
                },
                delay: {
                  pageViews: 1,
                  timeDelay: 4,
                },
              },
            ],
          },
        },
      });
    });
  }, []);

  return null;
}
