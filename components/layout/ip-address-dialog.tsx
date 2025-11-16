"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Plus, Printer, Network } from "lucide-react";
import { Button, Callout, Select } from "@radix-ui/themes";
import { removeToStayOrGo } from "../../lib/utils/helpers";
import StationSelector from "../selectors/station-selector";

interface IPEntry {
  fieldId: number;
  address: string;
  station: string;
}

interface InventoryItem {
  item: string;
  station: string;
  address: string;
}

// --- API ---
const fetchCategories = async (): Promise<Order[]> => {
  const res = await fetch("/api/inventory");
  if (!res.ok) throw new Error("Failed to fetch inventory");
  console.log("Fetched inventory categories from API");

  const results = await res.json();

  return results.data;
};

const IPAddressDialog = () => {
  const { data: categories = [], error } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const [open, setOpen] = React.useState(false);
  const [ipFields, setIpFields] = React.useState<IPEntry[]>([
    { fieldId: 1, address: "", station: "" },
  ]);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [message, setMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [stations, setStations] = React.useState<string[]>([]);

  // Fetch existing IPs when dialog opens
  React.useEffect(() => {
    if (!open) return;

    const getIp = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/ips");

        if (!res.ok) throw new Error("Failed to load IPs");

        const data: IPEntry[] = await res.json();

        const normalized =
          Array.isArray(data) && data.length
            ? data.map((item, index) => ({
                fieldId: index + 1,
                address: item.address ?? "",
                station: item.station ?? "",
              }))
            : [{ fieldId: 1, address: "", station: "" }];

        setIpFields(normalized);
        setIsLoading(false);
        setMessage({ type: "success", text: "IP Addresses Configured" });
      } catch (err) {
        setIsLoading(false);

        setMessage({
          type: "error",
          text: "Failed to configure printers. Please try again.",
        });
        setIpFields([{ fieldId: 1, address: "", station: "" }]);
      }
    };
    getIp();
  }, [open]);

  const uniqueStations = [
    ...new Set(categories.map((cat) => removeToStayOrGo(cat.category))),
  ].sort((a, b) => a.localeCompare(b));

  React.useEffect(() => {
    console.log();
    console.log(uniqueStations);
  }, [categories]);

  const camelToTitleCase = (str: string): string => {
    return str
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (match) => match.toUpperCase())
      .trim();
  };

  // Add a new empty row
  const addIPField = () => {
    const newId = ipFields.length
      ? Math.max(...ipFields.map((f) => f.fieldId)) + 1
      : 1;
    setIpFields([...ipFields, { fieldId: newId, address: "", station: "" }]);
  };

  // Remove an entry
  const removeIPField = (fieldId: number) => {
    if (ipFields.length > 1) {
      setIpFields(ipFields.filter((f) => f.fieldId !== fieldId));
    }
  };

  const handleChange = (
    fieldId: number,
    field: "address" | "station",
    value: string
  ) => {
    setIpFields((prev) =>
      prev.map((f) => (f.fieldId === fieldId ? { ...f, [field]: value } : f))
    );

    console.log(ipFields);
  };

  // Submit form data to API
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(ipFields);

    setIsSubmitting(true);
    try {
      const payload = ipFields.map(({ address, station }) => ({
        address: address.trim().toLowerCase(),
        station: station.trim().toLowerCase(),
      }));

      console.log(payload);
      const res = await fetch("/api/ips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save IPs");
    } catch (err) {
      console.error("Submit error:", err);
    } finally {
      setIsSubmitting(false);
      setOpen(false);
    }
  };

  // Reset on cancel
  const handleCancel = () => {
    setOpen(false);
    setIpFields([{ fieldId: 1, address: "", station: "" }]);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setOpen(true)}
        style={{ fontSize: 20 }}
        className="fixed bottom-8 right-8 w-fit p-6 gap-4 h-14 bg-blue-700 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50 group"
        aria-label="Add IP Address"
      >
        Settings
        <Printer className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Alert Dialog */}
      <AlertDialog.Root open={open} onOpenChange={setOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
          <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-lg shadow-xl z-50 overflow-hidden">
            <div className="p-6 border-b">
              <AlertDialog.Title className="text-xl font-semibold text-gray-900">
                Configure IP Addresses
              </AlertDialog.Title>
              <AlertDialog.Description className="text-sm text-gray-500 mt-1">
                Add or edit StarWebPRNT IPs and their station names.
              </AlertDialog.Description>
            </div>

            {isLoading ? (
              <div className="flex justify-center text-2xl h-[30vh] gap-4">
                <div className="m-auto w-fit flex items-center">
                  <div className="w-10 h-10 border-4 mx-auto border-indigo-900 border-t-transparent rounded-full animate-spin" />
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-6 overflow-y-auto max-h-[65vh] space-y-4"
              >
                {ipFields.map((field, index) => (
                  <div key={field.fieldId} className="flex gap-2 items-center">
                    <input
                      key={`address-${field.fieldId}`}
                      type="text"
                      value={field.address}
                      onChange={(e) =>
                        handleChange(field.fieldId, "address", e.target.value)
                      }
                      placeholder="192.168.1.1"
                      required
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />

                    <StationSelector
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg h-10 cursor-pointer focus:ring-2 focus:ring-blue-500"
                      id={field.fieldId}
                      value={camelToTitleCase(field.station)}
                      stations={uniqueStations}
                      onChange={handleChange}
                    />

                    {index === ipFields.length - 1 ? (
                      <button
                        type="button"
                        onClick={addIPField}
                        className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => removeIPField(field.fieldId)}
                        className="w-10 h-10 flex items-center justify-center bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}

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
    </>
  );
};

export default IPAddressDialog;
