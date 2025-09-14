import { useState } from "react";

export default function AddBorrowerPopUp({ borrowersLength, onAdd, onClose }) {
  const [name, setName] = useState("");
  const [borrowed, setBorrowed] = useState("");
  const [startDate, setStartDate] = useState(new Date().toLocaleDateString("en-GB"));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !borrowed || parseFloat(borrowed) <= 0) return;

    const newBorrower = {
      id: `B${borrowersLength+1}`, // Simple ID generation
      name: name.trim(),
      loans: [
        {
          loanId: "L1",
          borrowed: parseFloat(borrowed),
          startDate,
          payments: [],
        },
      ],
    };

    onAdd(newBorrower);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-emerald-700 mb-4">Add New Borrower</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Borrower Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Enter borrower name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount Borrowed
            </label>
            <input
              type="number"
              value={borrowed}
              onChange={(e) => setBorrowed(e.target.value)}
              className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Enter amount"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="DD/MM/YYYY"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Add Borrower
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
