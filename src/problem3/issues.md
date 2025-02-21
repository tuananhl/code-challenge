# Computational inefficiencies and anti-patterns

## 1. interfaces
```ts
interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}
```
I think the `FormattedWalletBalance` is not needed, the formatted calculation is very cheap and we don't need to map from `WalletBalance` to `FormattedWalletBalance`

More, I see the logics below has `blockchain` on `WalletBalance`. So I think we need to add `blockchain: string` to `WalletBalance`

## 2.
```ts
interface Props extends BoxProps {
}
```
There is no extra props. So it's not needed.

## 3.
```ts
  const WalletPage: React.FC<Props> = (props: Props) = {}
```
I do not prefer this way when working with React.
with my experience, this is only used when we need to debug in React devtools with `displayName` property.


but I do not use it. furthermore, the `FC<Props>` will always enforce to have a children property. it's really annoying. we need to strict the type of props.

I prefer to use normal function and destructuring

```ts
// in this case, BoxProps is enough
function WalletPage(props: BoxProps) {}
```

if you have an own prop. you can 
```ts
interface Props extends BoxProps {
  own: string;
}

function WalletPage({ own, ...boxProps }: BoxProps) {}
```

then we can remove this also as this component does not expect to have children
```ts
const { children, ...rest } = props;
```

## 4. the `getPriority` method.
```ts
const getPriority = (blockchain: any): number => {
  switch (blockchain) {
    case 'Osmosis':
      return 100
    case 'Ethereum':
      return 50
    case 'Arbitrum':
      return 30
    case 'Zilliqa':
      return 20
    case 'Neo':
      return 20
    default:
      return -99
  }
}
```

First, we need to strict the type of `blockchain` param. it should be a string or WalletBalance['blockchain'].

Secondly, the `getPriority` method will be the dependency of `sortedBalances`, in this case, the `sortedBalances` will be re-calculated whenever the component re-render.

### Refactor:
There are 2 ways to handle this. if you want to keep this method in the component:

#### 1.
```ts
const getPriority = useCallback((blockchain: string) => {
  switch (blockchain) {
    case 'Osmosis':
      return 100;
    case 'Ethereum':
      return 50;
    case 'Arbitrum':
      return 30;
    case 'Zilliqa':
      return 20;
    case 'Neo':
      return 20;
    default:
      return -99;
  }
}, []);
```
this method is created only one time and is memorized.

#### 2.
we can move this method outside the component.

### Suggested change:
we can convert it to a `Hash Map` instead:

```ts
  // useConst is simple hook that keep the default value and never change
  const priorityMap = useConst<Record<string, number>>(() => ({
    'Osmosis': 100,
    'Ethereum': 50,
    'Arbitrum': 30,
    'Zilliqa': 20,
    'Neo': 20,
    _: -99,
  }));
```

## 5. `sortedBalances` property

```ts
  // original
  const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
		  const balancePriority = getPriority(balance.blockchain);
		  if (lhsPriority > -99) {
		     if (balance.amount <= 0) {
		       return true;
		     }
		  }
		  return false
		}).sort((lhs: WalletBalance, rhs: WalletBalance) => {
			const leftPriority = getPriority(lhs.blockchain);
		  const rightPriority = getPriority(rhs.blockchain);
		  if (leftPriority > rightPriority) {
		    return -1;
		  } else if (rightPriority > leftPriority) {
		    return 1;
		  }
    });
  }, [balances, prices]);
```

There are some issues on this.

#### 1. the dependencies of useMemo
I think `prices` is redundant here because it's not used to calculate. except in case we need to enforce the useMemo to re-calculate when prices is changed. 

Additionally, if you want to use `getPriority` with `useCallback`. you need to add `getPriority` to the dependencies array. it's not needed for now but in the future if `getPriority` has own dependencies, we do not need to update in `useMemo` hook.

#### 2. `blockchain` property does not exist in WalletBalance
```ts
  getPriority(balance.blockchain)
```
I added it to the `WalletBalance` interface above. but it's not existed before

#### 3. undefined variable
the `lhsPriority` is not defined. I think it's `balancePriority`.

#### 4. the condition for filter is hard to read
```ts
// original
balances.filter((balance: WalletBalance) => {
  const balancePriority = getPriority(balance.blockchain);
  if (lhsPriority > -99) {
      if (balance.amount <= 0) {
        return true;
      }
  }
  return false
})

// we can make it shorter and clean
// I will also use the priorityMap that I defined above
balances.filter((balance: WalletBalance) => (
  (priorityMap[balance.blockchain] ?? priorityMap['_']) > -99 && balance.amount <= 0
));

// The logic is quite a bit strange because it get the balances which has amount is less than or equal 0 and has priority.
```

#### 5. the sort callback is hard to read
The original one does not handle sort when both priority are equal. but in this case it's fine.

```ts
// original
.sort((lhs: WalletBalance, rhs: WalletBalance) => {
  const leftPriority = getPriority(lhs.blockchain);
  const rightPriority = getPriority(rhs.blockchain);
  if (leftPriority > rightPriority) {
    return -1;
  } else if (rightPriority > leftPriority) {
    return 1;
  }
})

// after
.sort((leftWallet: WalletBalance, rightWallet: WalletBalance) => {
  const left = (priorityMap[leftWallet.blockchain] ?? priorityMap['_']);
  const right = (priorityMap[rightWallet.blockchain] ?? priorityMap['_']);
  return left - right;
});
```

## 6. `formattedBalances` is redundant
We can remove this because it's never used.

## 7. `rows` variable.
#### 1. I do not prefer to have a variable like this. the template is not too long. so we can put inside the template is enough
#### 2. the formatted is very cheap and we can put directly when passing prop.
#### 3. usdValue calculation is very cheap and we can put directly when passing prop.
#### 4. when calculation `usdValue` by `prices[balance.currency]`. I assume that `prices` is a dict, the `balance` may not exist in the `prices` keys. So we need a fallback. I will put the fallback as 0 but we can change based on the business logic
#### 5. Do not use `index` as key because it leads to UI bug or unexpected re-renders
#### 6. `classes.row` I assume that it's correct

```tsx
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
)
```
