"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

interface OrderDrawerProps {
  order: object;
  orderNumber: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OrderDrawer = ({
  order,
  orderNumber,
  open,
  onOpenChange,
}: OrderDrawerProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      orderNumber,
      status: formData.get("status"),
      notes: formData.get("notes"),
      fulfillmentDate: formData.get("fulfillmentDate"),
    };

    try {
      const response = await fetch("/api/webhooks/square", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      const result = await response.json();
      setMessage({ type: "success", text: "Order updated successfully!" });

      // Close drawer after success
      setTimeout(() => {
        onOpenChange(false);
        setMessage(null);
      }, 1500);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to update order. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Log the order object with keys and values converted to strings
  const items = Object.keys(order);

  console.log(items);

  const camelToTitleCase = (str: string): string => {
    return (
      str
        // Insert a space before all uppercase letters
        .replace(/([A-Z])/g, " $1")
        // Trim any leading space and capitalize the first letter
        .replace(/^./, (match) => match.toUpperCase())
        // Trim any extra whitespace
        .trim()
    );
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="absolute inset-0 bg-gray-500 opacity-5 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-50" />
        <Dialog.Content className="h-fit absolute bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom duration-300 mb-55">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <Dialog.Title className="text-xl font-semibold text-gray-900">
                  Update Order
                </Dialog.Title>
                <Dialog.Description className="text-sm text-gray-500 mt-1">
                  Order #{orderNumber}
                </Dialog.Description>
              </div>
              <Dialog.Close className="rounded-full p-2 hover:bg-gray-100 transition-colors">
                <X className="h-5 w-5 text-gray-500" />
              </Dialog.Close>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 p-6 h-[500px]">
              <div className="space-y-6 max-w-xl mx-auto ">
                {/* Status */}
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Order Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Select status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {items.map((item) => (
                  <div key={`${item}-${orderNumber}`}>
                    <label
                      htmlFor={`${item}-${orderNumber}`}
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      {camelToTitleCase(item)}
                    </label>
                    <input
                      type="text"
                      id={`${item}-${orderNumber}`}
                      name={`${item}-${orderNumber}`}
                      placeholder={order[item]}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                ))}

                {/*   <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    placeholder="Add any additional notes or comments..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  />
                </div> */}

                {/* Message */}
                {message && (
                  <div
                    className={`p-4 rounded-lg ${
                      message.type === "success"
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    {message.text}
                  </div>
                )}
              </div>
            </form>

            {/* Footer */}
            <div className="border-t p-6 bg-gray-50">
              <div className="flex gap-3 max-w-2xl mx-auto">
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={(e) => {
                    const form = e.currentTarget
                      .closest(".flex.flex-col")
                      ?.querySelector("form");
                    if (form) {
                      form.disPUTEvent(
                        new Event("submit", { cancelable: true, bubbles: true })
                      );
                    }
                  }}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Updating..." : "Update Order"}
                </button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default OrderDrawer;
