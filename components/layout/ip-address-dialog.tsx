"use client";

import * as React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Plus, Network } from "lucide-react";

const IPAddressDialog = () => {
  const [open, setOpen] = React.useState(false);
  const [ipFields, setIpFields] = React.useState([{ id: 1, value: "" }]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const addIPField = () => {
    const newId =
      ipFields.length > 0 ? Math.max(...ipFields.map((f) => f.id)) + 1 : 1;
    setIpFields([...ipFields, { id: newId, value: "" }]);
  };

  const removeIPField = (id: number) => {
    if (ipFields.length > 1) {
      setIpFields(ipFields.filter((field) => field.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const ipAddresses = ipFields.map((field) => formData.get(`ip-${field.id}`));

    console.log("Submitting IP Addresses:", ipAddresses);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setOpen(false);
      // Reset form
      setIpFields([{ id: 1, value: "" }]);
    }, 1000);
  };

  const handleCancel = () => {
    setOpen(false);
    setIpFields([{ id: 1, value: "" }]);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50 group"
        aria-label="Add IP Address"
      >
        <Network className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Alert Dialog */}
      <AlertDialog.Root open={open} onOpenChange={setOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-50" />
          <AlertDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-lg shadow-xl z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 max-h-[85vh] flex flex-col">
            <div className="p-6 border-b flex-shrink-0">
              <AlertDialog.Title className="text-xl font-semibold text-gray-900">
                Add IP Addresses
              </AlertDialog.Title>
              <AlertDialog.Description className="text-sm text-gray-500 mt-1">
                Enter one or more IP addresses to whitelist
              </AlertDialog.Description>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-4">
                {ipFields.map((field, index) => (
                  <div key={field.id} className="relative">
                    <label
                      htmlFor={`ip-${field.id}`}
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      IP Address {index + 1}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id={`ip-${field.id}`}
                        name={`ip-${field.id}`}
                        placeholder="192.168.1.1"
                        pattern="^(\d{1,3}\.){3}\d{1,3}$"
                        required
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                      {index === ipFields.length - 1 && (
                        <button
                          type="button"
                          onClick={addIPField}
                          className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                          aria-label="Add another IP field"
                        >
                          <Plus className="w-5 h-5" />
                        </button>
                      )}
                      {ipFields.length > 1 && index !== ipFields.length - 1 && (
                        <button
                          type="button"
                          onClick={() => removeIPField(field.id)}
                          className="w-10 h-10 flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                          aria-label="Remove IP field"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t p-6 bg-gray-50 flex-shrink-0">
                <div className="flex gap-3">
                  <AlertDialog.Cancel asChild>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                  </AlertDialog.Cancel>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Saving..." : "Save IP Addresses"}
                  </button>
                </div>
              </div>
            </form>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </>
  );
};

export default IPAddressDialog;
