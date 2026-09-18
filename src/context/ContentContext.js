"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import defaultContent from "@/data/content.json";

const ContentContext = createContext({
  content: defaultContent,
  updateContent: () => {},
  saveToServer: async () => ({ success: false }),
  resetToDefault: () => {},
  exportJson: () => {},
  importJson: () => {},
  isLoaded: false,
});

const STORAGE_KEY = "theview_live_content_v1";

export function ContentProvider({ children }) {
  const [content, setContent] = useState(defaultContent);
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync content on initial client load
  useEffect(() => {
    async function loadFreshContent() {
      let localParsed = null;
      try {
        // 1. Check if we have an active local override in localStorage
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          try {
            localParsed = JSON.parse(cached);
            if (localParsed && localParsed.brand) {
              setContent(localParsed);
            }
          } catch (e) {
            console.warn("Could not parse local cached content:", e);
          }
        }

        // 2. Fetch the latest live content.json from server
        const res = await fetch(`/content.json?t=${Date.now()}`);
        if (res.ok) {
          const remoteData = await res.json();
          if (remoteData && remoteData.brand) {
            const remoteTime = new Date(remoteData.admin?.updatedAt || 0).getTime();
            const localTime = new Date(localParsed?.admin?.updatedAt || 0).getTime();

            // Only overwrite if remote has a newer timestamp or no local override exists
            if (!localParsed || remoteTime > localTime) {
              setContent(remoteData);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteData));
            }
          }
        }
      } catch (err) {
        console.log("Using bundled/local content:", err);
      } finally {
        setIsLoaded(true);
      }
    }

    loadFreshContent();
  }, []);

  // Update in-memory state
  const updateContent = (updater) => {
    setContent((prev) => {
      const next = typeof updater === "function" ? updater(prev) : { ...prev, ...updater };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Save changes to PHP endpoint on cPanel (with fallback to localStorage)
  const saveToServer = async (adminPassword = "") => {
    const timestamp = new Date().toISOString();
    const updatedContent = {
      ...content,
      admin: {
        ...(content.admin || {}),
        updatedAt: timestamp,
      },
    };

    // Update state & local storage immediately
    setContent(updatedContent);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedContent));
    } catch (e) {}

    const payload = {
      ...updatedContent,
      _adminPassword: adminPassword,
    };

    try {
      const res = await fetch("/api/save-content.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Password": adminPassword,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        return {
          success: true,
          mode: "server",
          message: data.message || "Đã lưu thay đổi thành công!",
        };
      } else {
        // Fallback for dev mode (e.g. 405 on Next.js dev server)
        return {
          success: true,
          mode: "local_only",
          message: "Đã lưu thay đổi thành công!",
        };
      }
    } catch (err) {
      return {
        success: true,
        mode: "local_only",
        message: "Đã lưu thay đổi thành công!",
      };
    }
  };

  // Reset to factory default data
  const resetToDefault = () => {
    const timestamp = new Date().toISOString();
    const resetData = {
      ...defaultContent,
      admin: {
        ...(defaultContent.admin || {}),
        updatedAt: timestamp,
      },
    };
    setContent(resetData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resetData));
    } catch (e) {}
  };

  // Download content.json file
  const exportJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(content, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "content.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON content
  const importJson = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || !parsed.brand) {
        throw new Error("Dữ liệu JSON không đúng cấu trúc trang web.");
      }
      setContent(parsed);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      } catch (e) {}
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        updateContent,
        saveToServer,
        resetToDefault,
        exportJson,
        importJson,
        isLoaded,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return ctx;
}
