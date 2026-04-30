This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Meta Pixel + Conversions API

This project includes a consent-gated Meta integration:

- `Meta Pixel` for browser events and route pageviews
- `Conversions API` for server-side conversion events and purchase confirmation
- cookie preferences UI that blocks Meta tracking until the user accepts marketing cookies

### Required environment variables

```bash
NEXT_PUBLIC_META_PIXEL_ID=your_meta_pixel_id
META_PIXEL_ID=your_meta_pixel_id
META_ACCESS_TOKEN=your_meta_conversions_api_access_token
META_CONVERSIONS_API_VERSION=v23.0
# Optional for Events Manager testing
META_TEST_EVENT_CODE=
```

### Events wired today

- `PageView`
- `ViewContent`
- `Search`
- `AddToWishlist`
- `Contact`
- `CompleteRegistration`
- `InitiateCheckout`
- `Lead` when a seller publishes a listing
- `Purchase` when an order is confirmed as paid

### Notes

- Meta purchase attribution uses a consent snapshot stored on the order at checkout time.
- After updating Prisma models, run:

```bash
npx prisma generate
```
