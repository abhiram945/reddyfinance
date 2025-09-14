import { useState } from "react";

export default function EditPaymentPopUp({ borrower, dispatch, onClose }) {
  const today = new Date().toLocaleDateString("en-GB"); // dd/mm/yyyy

  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("add"); // "add" | "subtract"

  const handleSubmit = () => {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) return;

    const amountChange = mode === "add" ? parsed : -parsed;

    dispatch({
      type: "UPDATE_PAYMENT",
      payload: { borrowerId: borrower.id, date: today, amountChange },
    });

    setAmount("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-bold text-emerald-700 mb-4">
          Update Payment – {borrower.name}
        </h2>
        <p className="mb-4">Updating on: {today}</p>

        {/* Amount input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Enter amount"
            autoFocus={true}
          />
        </div>

        {/* Add/Subtract radio */}
        <div className="mb-4 flex items-center gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="mode"
              value="add"
              checked={mode === "add"}
              onChange={(e) => setMode(e.target.value)}
            />
            <span>Add</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="mode"
              value="subtract"
              checked={mode === "subtract"}
              onChange={(e) => setMode(e.target.value)}
            />
            <span>Subtract</span>
          </label>
        </div>

        {/* Actions */}
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!amount || parseFloat(amount) <= 0}
            className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-70"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
