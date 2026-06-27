import jsPDF from "jspdf";
// 1. Ubah cara impor autotable menjadi seperti ini:
import autoTable from "jspdf-autotable";

export const downloadPDF = (transactions) => {
  if (!transactions || transactions.length === 0) {
    alert("Tidak ada data transaksi untuk diekspor!");
    return;
  }

  const doc = new jsPDF("p", "mm", "a4");

  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text("Laporan Transaksi Mooney", 14, 22);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const printDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(`Tanggal Cetak: ${printDate}`, 14, 30);

  const tableColumn = [
    "Tanggal",
    "Judul Transaksi",
    "Kategori",
    "Tipe",
    "Nominal",
    "Dompet",
  ];
  const tableRows = [];

  transactions.forEach((t) => {
    const transactionData = [
      t.date,
      t.title,
      t.category?.name || "-",
      t.type === "income" ? "Pemasukan" : "Pengeluaran",
      `Rp ${Number(t.amount).toLocaleString("id-ID")}`,
      t.wallet?.name || "-",
    ];
    tableRows.push(transactionData);
  });

  // 2. PERBAIKAN: Gunakan fungsi autoTable() dan masukkan 'doc' sebagai argumen pertamanya
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
  doc.save(`Laporan_Mooney_${fileNameDate}.pdf`);
};
