"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Printer } from "lucide-react";
import { camelToTitleCase, removeToStayOrGo } from "../../lib/utils/helpers";

interface IPRow {
  station: string;
  address: string;
}

interface Category {
  category: string;
}

const locations = [
  { name: "UES", code: "L5MQCWDDVAYA6" },
  { name: "Times Square", code: "LF6HAV7DTAEKJ" },
  { name: "Brooklyn", code: "L56CFWYF0H5JK" },
];

// --- Fetch inventory categories (to derive station list) ---
const fetchCategories = async (): Promise<Category[]> => {
  const res = await fetch("/api/inventory", {
    method: "GET",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch inventory");
  const data = await res.json();
  console.log(data);
  return data.data;
};

const IPAddressDialog = () => {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
  const [selectedLocation, setSelectedLocation] = useState("L5MQCWDDVAYA6"); // default UES
  const [open, setOpen] = useState(false);
  const [ipMap, setIpMap] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const uniqueStations = React.useMemo(() => {
    return [
      ...new Set(
        categories.map((cat) =>
          removeToStayOrGo(cat.category).toLowerCase().trim()
        )
      ),
    ].sort((a, b) => a.localeCompare(b));
  }, [categories]);

  const handleToast = () => {
    setTimeout(() => {
      setShowToast(true);
    }, 5000);
    setShowToast(false);
  };

  const loadIPs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/ips/${selectedLocation}`);
      if (!res.ok) throw new Error("Failed to load IPs");

      const rows = await res.json();
      const map: Record<string, string> = {};

      rows.forEach((row) => {
        map[row.station.toLowerCase()] = row.address;
      });

      // Ensure every station is present
      uniqueStations.forEach((station) => {
        if (!map[station]) map[station] = "";
      });

      setIpMap(map);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to load IPs" });
      setShowToast(true);
    } finally {
      setTimeout(() => {
        setShowToast(false);
      }, 5000);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) loadIPs();
  }, [open, selectedLocation]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = Object.entries(ipMap).map(([station, address]) => ({
      station,
      address,
      locationCode: selectedLocation,
    }));

    console.log(payload);
    try {
      const res = await fetch("/api/ips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setMessage({ type: "success", text: "Saved printer IPs" });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to save IPs" });
    } finally {
      setOpen(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setIpMap({});
  };

  return (
    <>
      {/* Floating Settings Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-8 right-8 w-fit p-6 gap-4 h-14 
                   bg-blue-700 hover:bg-blue-600 text-white 
                   rounded-full shadow-lg hover:shadow-xl 
                   transition-all duration-200 flex items-center 
                   justify-center z-50 group"
      >
        Settings
        <Printer className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Dialog */}
      <AlertDialog.Root open={open} onOpenChange={setOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
          <AlertDialog.Content
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                       w-full max-w-lg bg-white rounded-lg shadow-xl z-50 
                       overflow-hidden"
          >
            <div className="p-6 border-b">
              <AlertDialog.Title className="text-xl font-semibold">
                Configure Printers
              </AlertDialog.Title>
              <AlertDialog.Description className="text-sm text-gray-500">
                Set the IP address for each station.
              </AlertDialog.Description>
              <AlertDialog.Description className="text-sm text-gray-500">
                Default printer IP is 172.16.1.254 if none set.
              </AlertDialog.Description>
              <select
                className="border px-3 py-2 rounded-lg"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                {locations.map((loc) => (
                  <option key={loc.code} value={loc.code}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Loading */}
            {isLoading ? (
              <div className="flex justify-center items-center h-[30vh]">
                <div className="w-10 h-10 border-4 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-4 max-h-[65vh] overflow-y-auto"
              >
                {/* One input per station */}
                {uniqueStations.map((station) => (
                  <div
                    key={station}
                    className="flex justify-between items-center gap-4"
                  >
                    <div className="font-semibold text-lg w-[200px]">
                      {station.toUpperCase()}
                    </div>

                    <input
                      type="text"
                      value={ipMap[station] ?? ""}
                      onChange={(e) =>
                        setIpMap((prev) => ({
                          ...prev,
                          [station]: e.target.value,
                        }))
                      }
                      placeholder="192.168.1.50"
                      className="flex-1 px-3 py-2 w-[230px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}

                {/* Buttons */}
                <div className="border-t pt-4 flex gap-3">
                  <AlertDialog.Cancel asChild>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                  </AlertDialog.Cancel>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            )}
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>

      {/* Status Toast */}
      {message && (
        <AlertDialog.Root open={showToast}>
          <AlertDialog.Content
            className={`w-100 z-100 rounded-lg shadow-lg px-5 py-3 absolute bottom-25 left-20 ${
              message.type === "error"
                ? "bg-rose-700 text-white text-lg"
                : "bg-emerald-400 text-lg"
            }`}
          >
            <AlertDialog.Title>
              {camelToTitleCase(message.type)}
            </AlertDialog.Title>
            <AlertDialog.Description size="2">
              {message.text}
            </AlertDialog.Description>
          </AlertDialog.Content>
        </AlertDialog.Root>
      )}
    </>
  );
};

export default IPAddressDialog;
