const SessionTable=({last5Weeks, borrowers, setSelectedBorrower, setEditingBorrower, totals})=>{
  return (
      <div className="w-screen h-screen flex flex-col bg-white flex-1 overflow-auto">
        <table className="w-full border-collapse">
          <thead className="bg-emerald-100 sticky top-0 z-10">
            <tr>
              <th className="border px-3 py-2 text-left">ID</th>
              <th className="border px-3 py-2 text-left">Name</th>
              <th className="border px-3 py-2 text-right">Borrowed</th>
              <th className="border px-3 py-2 text-right">Repaid</th>
              <th className="border px-3 py-2 text-right">Balance</th>
              <th className="border px-3 py-2 text-center">Action</th>
              {last5Weeks.map((date) => (
                <th key={date} className="border px-3 py-2 text-right">
                  {date}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {borrowers.map((b) => {
              const latest = b.loans[b.loans.length - 1];
              if (!latest) return null;

              const totalRepaid = latest.payments.reduce(
                (sum, p) => sum + p.amount,
                0
              );
              const balance = latest.borrowed - totalRepaid;

              return (
                <tr key={b.id} className="hover:bg-emerald-50">
                  <td
                    className="border px-3 py-2 cursor-pointer text-emerald-700 hover:underline"
                    onClick={() => setSelectedBorrower(b)}
                  >
                    {b.id}
                  </td>
                  <td
                    className="border px-3 py-2 cursor-pointer text-emerald-700 hover:underline"
                    onClick={() => setSelectedBorrower(b)}
                  >
                    {b.name}
                  </td>
                  <td className="border px-3 py-2 text-right">
                    {latest.borrowed}
                  </td>
                  <td className="border px-3 py-2 text-right">
                    {totalRepaid}
                  </td>
                  <td className="border px-3 py-2 text-right">
                    {balance}
                  </td>
                  <td className="border px-3 py-2 text-center">
                    <button
                      onClick={() => setEditingBorrower(b)}
                      className={`text-sm px-2 py-1 rounded ${
                        balance === 0
                          ? "bg-emerald-500 hover:bg-emerald-600"
                          : "bg-blue-500 hover:bg-blue-600"
                      } text-white`}
                    >
                      {balance === 0 ? "Repay" : "Edit"}
                    </button>
                  </td>
                  {last5Weeks.map((date) => {
                    const payment = latest.payments.find((p) => p.date === date);
                    return (
                      <td key={date} className="border px-3 py-2 text-right">
                        {payment ? payment.amount : "X"}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-gray-100 font-semibold sticky bottom-0 z-10">
            <tr>
              <td className="border px-3 py-2" colSpan={2}>
                Totals
              </td>
              <td className="border px-3 py-2 text-right">
                {totals.borrowed}
              </td>
              <td className="border px-3 py-2 text-right">${totals.repaid}</td>
              <td className="border px-3 py-2 text-right">
                {totals.borrowed - totals.repaid}
              </td>
              <td className="border px-3 py-2 text-center">—</td>
              {totals.payments.map((p, idx) => (
                <td key={idx} className="border px-3 py-2 text-right">
                  {p}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
  );
}
export default SessionTable;