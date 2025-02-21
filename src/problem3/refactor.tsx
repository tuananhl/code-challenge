import { useMemo } from 'react';
import useConst from './useConst';

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

function WalletPage(props: BoxProps) {
  const balances = useWalletBalances();
  const prices = usePrices();
  const priorityMap = useConst<Record<string, number>>(() => ({
    'Osmosis': 100,
    'Ethereum': 50,
    'Arbitrum': 30,
    'Zilliqa': 20,
    'Neo': 20,
    _: -99,
  }));

  const sortedBalances = useMemo(() => (
    balances
      .filter((balance: WalletBalance) => (
        (priorityMap[balance.blockchain] ?? priorityMap['_']) > -99 && balance.amount > 0 // I change to > 0 because I want to show the wallets that have amount > 0
      ))
      .sort((leftWallet: WalletBalance, rightWallet: WalletBalance) => {
        const left = (priorityMap[leftWallet.blockchain] ?? priorityMap['_']);
        const right = (priorityMap[rightWallet.blockchain] ?? priorityMap['_']);
        return left - right;
      })
  ), [priorityMap, balances]);

  return (
    <div {...rest}>
      {sortedBalances.map((balance: FormattedWalletBalance) => (
        <WalletRow 
          className={classes.row}
          key={balance.currency}
          amount={balance.amount}
          usdValue={(prices[balance.currency] ?? 0) * balance.amount}
          formattedAmount={balance.amount.toFixed()}
        />
      ))}
    </div>
  );
}

export default WalletPage;