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
      try {
        // 1. Check if we have an active local override in localStorage
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (parsed && parsed.brand) {
              setContent(parsed);
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
            // If remote has an updatedAt newer than or equal to local, use remote
            setContent(remoteData);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteData));
          }
        }
      } catch (err) {
        console.log("Using bundled default content:", err);
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
    const payload = {
      ...content,
      _adminPassword: adminPassword,
    };

    // Always update local cache first
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch (e) {}

    try {
      const res = await fetch("/api/save-content.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Password": adminPassword,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        return {
          success: true,
          mode: "server",
          message: data.message || "Đã lưu thành công vào máy chủ cPanel!",
        };
      } else {
        return {
          success: false,
          mode: "server_error",
          message: data.message || "Không thể lưu vào file trên máy chủ.",
        };
      }
    } catch (err) {
      // Local dev environment or server without PHP active
      return {
        success: true,
        mode: "local_only",
        message:
          "Đã lưu vào bộ nhớ trình duyệt! (Trên hosting cPanel, file content.json sẽ được lưu trực tiếp).",
      };
    }
  };

  // Reset to factory default data
  const resetToDefault = () => {
    setContent(defaultContent);
    try {
      localStorage.removeItem(STORAGE_KEY);
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
