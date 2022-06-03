# Metaplex Auction House Marketplace Standard JS SDK

Submit actions to the [Metaplex Auction House](https://docs.metaplex.com/auction-house/definition) program that adhere to the Holaplex Marketplace Standard. Its recommend to leverage the sdk with typescript to get access to the package type definitions and code completion.

## Setup

Install the package from npm using your favorite package manager.

```shell
npm install -S @chathuranga/marketplace-js-sdk
yarn add @chathuranga/marketplace-js-sdk
```

## Usage

Examples of using the sdk from different javascript based development environments.

### React

```typescript
import { initMarketplaceSDK, AuctionHouse, Nft } from '@chathuranga/marketplace-js-sdk'
import { useConnection, useWallet } from '@chathuranga/wallet-adapter-react'

interface PageProps {
  auctionHouse: AuctionHouse
  nft: Nft
}

const Page = ({ auctionHouse, nft }: PageProps) => {
  const wallet = useWallet()
  const connection = useConnection()

  const sdk = useMemo(() => initMarketplaceSDK(connection, wallet), [connection, wallet])

  const onListNft = ({ amount }: <{ amount: number }>) => {
    await sdk.listings(auctionHouse).post({ amount, nft })
  }

  const onMakeOffer = ({ amount }: <{ amount: number }>) => {
    await sdk.offers(auctionHouse).make({ amount, nft })
  }

  return (
    ...
  )
}
```

## Deploy

```
yarn build
```

## Publish

```
npm publish
```
