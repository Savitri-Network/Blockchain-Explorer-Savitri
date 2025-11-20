export const fetchBlocks = async (query: string) => {
  const response = await fetch(`/api/blocks?page=1&size=100&sort=1`);
  const data = await response.json();
  const blocks = data.items.filter((block: any) => block._id.includes(query));

  if (blocks.length === 0) {
    return await fetchAccounts(query);
  }

  return blocks;
};


export const fetchTransactions = async (query: string) => {
  const response = await fetch(`/api/transactions?page=1&size=100&sort=1`);
  const data = await response.json();
  return data.items.filter((tx: any) => tx.tx_hash.includes(query));
};

export const fetchAccounts = async (query: string) => {
  const response = await fetch(`/api/accounts`);
  const data = await response.json();
  const ledger = data.ledger;
  return Object.keys(ledger)
    .filter((account) => account.includes(query))
    .map((account) => ({ account, ...ledger[account] }));
};

export const fetchSmartContracts = async (query: string) => {
  const response = await fetch(`/api/contracts?sort=1&page=1&size=10`);
  const data = await response.json();
  return data.items.filter((sc: any) => sc.sc_id.includes(query));
};

export const fetchAll = async (query: string) => {
  const blockPattern = /^[a-f0-9]{16,}$/;
  const transactionPattern = /^(AB|CC)[A-Za-z0-9]*$/;
  const smartContractPattern = /^SC[A-Za-z0-9]*$/;
  const accountPattern = /^[0-9A-Za-z]+$/;

  if (blockPattern.test(query)) {
    return await fetchBlocks(query);
  } else if (transactionPattern.test(query)) {
    return await fetchTransactions(query);
  } else if (smartContractPattern.test(query)) {
    return await fetchSmartContracts(query);
  } else if (accountPattern.test(query)) {
    return await fetchAccounts(query);
  } else {
    const blocks = await fetchBlocks(query);
    const transactions = await fetchTransactions(query);
    const accounts = await fetchAccounts(query);
    const smartContracts = await fetchSmartContracts(query);
    return [...blocks, ...transactions, ...accounts, ...smartContracts];
  }
};
