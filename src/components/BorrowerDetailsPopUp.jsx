export default function BorrowerDetailsPopUp({ borrower, onClose, onDelete }) {
  const latest = borrower.loans[borrower.loans.length - 1];

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-xl font-bold text-emerald-700 mb-4">
          {borrower.name} ({borrower.id})
        </h2>

        <div className="space-y-3">
          {borrower.loans.map((loan, idx) => (
            <div
              key={loan.loanId}
              className={`p-3 border rounded ${
                idx === borrower.loans.length - 1
                  ? "bg-emerald-50"
                  : "bg-gray-50"
              }`}
            >
              <h3 className="font-semibold">
                Loan {loan.loanId} – ${loan.borrowed} (Started {loan.startDate})
              </h3>
              <p>
                Total Repaid: $
                {loan.payments.reduce((sum, p) => sum + p.amount, 0)}
              </p>
              <p>
                Balance: $
                {loan.borrowed -
                  loan.payments.reduce((sum, p) => sum + p.amount, 0)}
              </p>

              {idx === borrower.loans.length - 1 && (
                <div className="mt-2">
                  <h4 className="font-medium">Payments:</h4>
                  <ul className="list-disc ml-5">
                    {loan.payments.map((p, i) => (
                      <li key={i}>
                        {p.date}: ${p.amount}
                        {p.amount === 0 && (
                          <span className="text-red-500"> (Missed)</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={onDelete}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
