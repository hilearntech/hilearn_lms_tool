import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";


import { getTransactions } from "../../../services/adminService";

const RevenueDashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState({ total: 0, gst: 0, refunds: 0 });
    const [loading, setLoading] = useState(true);


    const loadDummyData = () => {
        const dummy = [
            { _id: '1', txnId: 'TXN-9901', studentName: 'gopi', courseName: 'React Full Course', amount: 5000, status: 'Success' },
            { _id: '2', txnId: 'TXN-9902', studentName: 'shani', courseName: 'Node.js Backend', amount: 3000, status: 'Success' }
        ];

        setTransactions(dummy);
        console.log(transactions)
        const totalAmount = dummy.reduce((acc, item) => acc + item.amount, 0);
        setStats({
            total: totalAmount,
            gst: (totalAmount * 0.18).toFixed(2),
            refunds: 0
        });
        console.log(stats)
    };


    const fetchData = async () => {
        try {
            setLoading(true);

            const res = await getTransactions();
            const dataArray = res.data?.data || res.data || [];

            if (Array.isArray(dataArray) && dataArray.length > 0) {
                setTransactions(dataArray);
                const total = dataArray.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
                setStats({ total, gst: (total * 0.18).toFixed(2), refunds: 0 });
            } else {
                loadDummyData();
            }
        } catch (err) {
            console.log("Backend error, loading dummy instead...");
            loadDummyData();
        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const generateInvoice = (txn) => {
        const doc = new jsPDF();


        doc.setFontSize(20);
        doc.setTextColor(5, 150, 105);
        doc.text("HiLearn Tech", 105, 20, { align: "center" });

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text("GST Invoice - Digital Education Services", 105, 28, { align: "center" });


        autoTable(doc, {
            startY: 40,
            head: [['Field', 'Details']],
            body: [
                ['Transaction ID', txn.txnId],
                ['Student Name', txn.studentName],
                ['Course Name', txn.courseName],
                ['Date', new Date().toLocaleDateString()],
                ['Amount', `INR ${txn.amount}`],
                ['GST (18%)', `INR ${(txn.amount * 0.18).toFixed(2)}`],
                ['Total Paid', `INR ${txn.amount}`],
                ['Status', txn.status]
            ],
            theme: 'grid',
            headStyles: { fillColor: [5, 150, 105] },
            styles: { fontSize: 10 }
        });

        // Footer
        const finalY = doc.lastAutoTable.finalY;
        doc.setTextColor(150);
        doc.text("This is a computer generated invoice.", 105, finalY + 15, { align: "center" });

        // Download
        doc.save(`Invoice_${txn.txnId}.pdf`);
    };

    // Loader UI
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl font-bold text-[#059669] animate-pulse">
                    Please wait, fetching revenue data...
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-[#059669] mb-6">Revenue & Sales</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
                    <p className="text-gray-500 text-sm">Total Revenue</p>
                    <h2 className="text-2xl font-bold text-gray-800">₹{stats.total}</h2>
                </div>
                <div className="bg-white p-6 rounded-xl shadow border-l-4 border-blue-500">
                    <p className="text-gray-500 text-sm">GST (18%)</p>
                    <h2 className="text-2xl font-bold text-gray-800">₹{stats.gst}</h2>
                </div>
                <div className="bg-white p-6 rounded-xl shadow border-l-4 border-red-500">
                    <p className="text-gray-500 text-sm">Refunds</p>
                    <h2 className="text-2xl font-bold text-gray-800">₹{stats.refunds}</h2>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden border border-gray-100">
                <table className="w-full text-sm">
                    <thead className="bg-[#059669] text-white">
                        <tr>
                            <th className="p-4 text-left">Transaction ID</th>
                            <th className="p-4 text-left">Student</th>
                            <th className="p-4 text-left">Course</th>
                            <th className="p-4 text-left">Amount</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {transactions.map((txn) => (
                            <tr key={txn._id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-mono text-xs text-blue-600 font-semibold">{txn.txnId}</td>
                                <td className="p-4 text-gray-700 font-medium">{txn.studentName}</td>
                                <td className="p-4 text-gray-600">{txn.courseName}</td>
                                <td className="p-4 font-bold text-gray-800">₹{txn.amount}</td>
                                <td className="p-4">
                                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase">
                                        {txn.status}
                                    </span>
                                </td>
                                <td className="p-4 text-center">
                                    <button
                                        onClick={() => generateInvoice(txn)}
                                        className="text-[#059669] font-semibold hover:underline bg-green-50 px-3 py-1 rounded"
                                    >
                                        Download Invoice
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RevenueDashboard;