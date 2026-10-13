import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const downloadPDF = (transactions) => {
  if (!transactions || transactions.length === 0) {
    alert("No transaction data to export!");
    return;
  }
  const doc = new jsPDF("p", "mm", "a4");
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text("Mooney Transaction Report", 14, 22);
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const printDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Generated Date: ${printDate}`, 14, 30);
  const tableColumn = [
    "Date",
    "Transaction Title",
    "Category",
    "Type",
    "Amount",
    "Wallet",
  ];
  const tableRows = [];
  transactions.forEach((t) => {
    const transactionData = [
      t.date,
      t.title,
      t.category?.name || "-",
      t.type === "income" ? "Income" : "Expense",
      `Rp ${Number(t.amount).toLocaleString("id-ID")}`,
      t.wallet?.name || "-",
    ];
    tableRows.push(transactionData);
  });
  autoTable(doc, {
    startY: 38,
    head: [tableColumn],
    body: tableRows,
    theme: "striped",
    headStyles: {
      fillColor: [91, 88, 255],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    alternateRowStyles: {
      fillColor: [248, 248, 250],
    },
  });
  const fileNameDate = new Date().toISOString().split("T")[0];
  doc.save(`Mooney_Report_${fileNameDate}.pdf`);
};
