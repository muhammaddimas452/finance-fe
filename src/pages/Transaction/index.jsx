const Transactions = () => {
  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Transactions
        </h1>
      </header>

      <div className="bg-white rounded-[2rem] p-8 shadow-soft flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-brand-50 rounded-full flex items-center justify-center mb-4">
          <span className="text-4xl">🗂️</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Halaman Transaksi Lengkap
        </h2>
        <p className="text-gray-400 max-w-md">
          Di sini nantinya akan berisi tabel lengkap seluruh riwayat transaksi
          Anda, beserta fitur filter tanggal dan tombol hapus data.
        </p>
      </div>
    </div>
  );
};

export default Transactions;
