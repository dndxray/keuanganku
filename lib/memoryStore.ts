export interface TransactionRecord {
  id: string;
  userId: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: Date;
  createdAt: Date;
}

const globalForStore = globalThis as unknown as {
  inMemoryTransactions?: TransactionRecord[];
};

if (!globalForStore.inMemoryTransactions) {
  globalForStore.inMemoryTransactions = [
    {
      id: "tx-1",
      userId: "user-default-01",
      type: "income",
      amount: 3500000,
      category: "Uang Saku",
      description: "Transfer bulanan",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: "tx-2",
      userId: "user-default-01",
      type: "expense",
      amount: 125000,
      category: "Nongkrong & Kopi",
      description: "Kopi & pastry",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      id: "tx-3",
      userId: "user-default-01",
      type: "expense",
      amount: 450000,
      category: "Belanja",
      description: "Beli outfit & perlengkapan",
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: "tx-4",
      userId: "user-default-01",
      type: "expense",
      amount: 45000,
      category: "Makanan & Minuman",
      description: "Makan siang",
      date: new Date(),
      createdAt: new Date(),
    },
  ];
}

export const memoryStore = {
  getAll: (userId: string) => {
    return (globalForStore.inMemoryTransactions || []).filter(
      (t) => t.userId === userId || t.userId === "user-default-01"
    );
  },
  create: (item: Omit<TransactionRecord, "id" | "createdAt">) => {
    const newRecord: TransactionRecord = {
      ...item,
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date(),
    };
    globalForStore.inMemoryTransactions = [
      newRecord,
      ...(globalForStore.inMemoryTransactions || []),
    ];
    return newRecord;
  },
  findById: (id: string) => {
    return (globalForStore.inMemoryTransactions || []).find((t) => t.id === id);
  },
  update: (
    id: string,
    data: Partial<Omit<TransactionRecord, "id" | "userId" | "createdAt">>
  ) => {
    const list = globalForStore.inMemoryTransactions || [];
    const index = list.findIndex((t) => t.id === id);
    if (index === -1) return null;
    const updated = {
      ...list[index],
      ...data,
    };
    list[index] = updated;
    return updated;
  },
  delete: (id: string) => {
    const list = globalForStore.inMemoryTransactions || [];
    const index = list.findIndex((t) => t.id === id);
    if (index === -1) return false;
    list.splice(index, 1);
    return true;
  },
};
