export interface Transaction {
  id: string;
  amount: number;
  category: "Makanan" | "Transportasi" | "Hiburan" | "Belanja" | "Tagihan" | "Tabungan" | "Lainnya";
  description: string;
  date: string;
}

export interface Budget {
  category: Transaction["category"];
  limit: number;
}
