import { useReducer, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import BorrowerDetailsPopUp from "../components/BorrowerDetailsPopUp";
import EditPaymentPopUp from "../components/EditPaymentPopUp";
import AddBorrowerPopUp from "../components/AddBorrowerPopUp";
import SessionTable from "../components/SessionTable";

const borrowerReducer = (state, action) => {
    switch (action.type) {
        case "ADD_LOAN": {
            const { borrowerId, borrowed, startDate } = action.payload;
            return state.map((b) =>
                b.id === borrowerId
                    ? {
                        ...b,
                        loans: [
                            ...b.loans,
                            {
                                loanId: `L${b.loans.length + 1}`,
                                borrowed,
                                startDate,
                                payments: [],
                            },
                        ],
                    }
                    : b
            );
        }

        case "UPDATE_PAYMENT": {
            const { borrowerId, date, amountChange } = action.payload;
            return state.map((b) => {
                if (b.id !== borrowerId) return b;

                const loans = [...b.loans];
                const latestLoan = loans[loans.length - 1];
                if (!latestLoan) return b;

                let payments = [...latestLoan.payments];
                const todayIdx = payments.findIndex((p) => p.date === date);

                if (todayIdx >= 0) {
                    payments[todayIdx] = {
                        ...payments[todayIdx],
                        amount: Math.max(0, payments[todayIdx].amount + amountChange),
                    };
                } else {
                    payments.push({ date, amount: Math.max(0, amountChange) });
                }

                loans[loans.length - 1] = { ...latestLoan, payments };
                return { ...b, loans };
            });
        }

        case "DELETE_BORROWER": {
            const { borrowerId } = action.payload;
            return state.filter((b) => b.id !== borrowerId);
        }

        case "ADD_BORROWER": {
            return [...state, action.payload];
        }

        default:
            return state;
    }
};

const initialBorrowers = Array.from({ length: 50 }, (_, i) => ({
    id: `B${i + 1}`,
    name: `Borrower ${i + 1}`,
    loans: [
        {
            loanId: "L1",
            borrowed: 1000 + i * 100,
            startDate: "10/08/2025",
            payments: [
                { date: "17/08/2025", amount: 100 },
                { date: "24/08/2025", amount: 50 },
                { date: "31/08/2025", amount: 10 },
            ],
        },
    ],
}));

// ---------- Helpers ----------
const last5Weeks = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i * 7);
    return d.toLocaleDateString("en-GB"); // DD/MM/YYYY format
}).reverse();

export default function LineDaySession() {
    const { line, day, session } = useParams();
    const [borrowers, dispatch] = useReducer(borrowerReducer, initialBorrowers);

    const [selectedBorrower, setSelectedBorrower] = useState(null);
    const [editingBorrower, setEditingBorrower] = useState(null);
    const [addingBorrower, setAddingBorrower] = useState(false);
    const [page, setPage] = useState(1);

    // ---------- Totals (memoized) ----------
    const totals = useMemo(() => {
        let borrowed = 0,
            repaid = 0,
            payments = Array(5).fill(0);

        borrowers.forEach((b) => {
            const latest = b.loans[b.loans.length - 1];
            if (!latest) return;

            borrowed += latest.borrowed;
            const totalRepaid = latest.payments.reduce(
                (sum, p) => sum + p.amount,
                0
            );
            repaid += totalRepaid;

            last5Weeks.forEach((date, idx) => {
                const p = latest.payments.find((p) => p.date === date);
                payments[idx] += p ? p.amount : 0;
            });
        });

        return { borrowed, repaid, payments };
    }, [borrowers]);

    return (
        <div className="w-screen h-screen flex flex-col bg-white relative">
            <div className="sticky top-0 z-20 flex justify-between items-center p-4 bg-emerald-700 text-white shadow">
                <h1 className="text-lg font-semibold">
                    {line} • {day} • {session}
                </h1>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500"
                    >
                        Prev
                    </button>
                    <span className="text-sm font-medium">Page {page}</span>
                    <button
                        onClick={() => setPage((p) => p + 1)}
                        className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500"
                    >
                        Next
                    </button>
                    <button
                        onClick={() => setAddingBorrower(true)}
                        className="w-8 h-8 ml-4 bg-white rounded-full p-1 cursor-pointer"
                        aria-label="Add Borrower"
                    >
                        <img src="/plus.svg" alt="Add Borrower" className="w-full h-full" />
                    </button>
                </div>
            </div>

            <SessionTable last5Weeks={last5Weeks} borrowers={borrowers}
                setSelectedBorrower={setSelectedBorrower} setEditingBorrower={setEditingBorrower}
                totals={totals} />

            {selectedBorrower && (
                <BorrowerDetailsPopUp
                    borrower={selectedBorrower}
                    onClose={() => setSelectedBorrower(null)}
                    onDelete={() => {
                        // Delete borrower handler
                        dispatch({ type: "DELETE_BORROWER", payload: { borrowerId: selectedBorrower.id } });
                        setSelectedBorrower(null);
                    }}
                />
            )}
            {editingBorrower && (
                <EditPaymentPopUp
                    borrower={editingBorrower}
                    dispatch={dispatch}
                    onClose={() => setEditingBorrower(null)}
                />
            )}
            {addingBorrower && (
                <AddBorrowerPopUp
                    borrowersLength={borrowers.length}
                    onAdd={(newBorrower) => {
                        dispatch({ type: "ADD_BORROWER", payload: newBorrower });
                        setAddingBorrower(false);
                    }}
                    onClose={() => setAddingBorrower(false)}
                />
            )}
        </div>
    );
}
