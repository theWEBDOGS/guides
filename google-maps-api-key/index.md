---
public: true
title: "Create a Google Maps API Key"
slug: google-maps-api-key
verified: 2026-06-11
description: "For website owners. About 15 minutes; free for typical traffic."
---

# Create a Google Maps API Key

The interactive map on your website runs on Google's engine, and Google
wants to know whose website is asking — that's the **API key**. It has to be
created under *your* Google account (it's tied to your billing and your
business), which is why your web team asks you to make it rather than making
it for you. The whole thing takes about 15 minutes, and the key you hand
back will be locked so it only works on your own site.

You'll need: a Google account for the business, and a credit card (Google
requires one on file — see the next section before that worries you).

## What it actually costs

Google requires billing details, but **a normal business website's map is
free in practice**: the standard website map (Maps JavaScript API) includes
**10,000 free map loads every month**, and you pay only beyond that. A
typical small-business site uses a small fraction of it. (This changed in
March 2025 — if you've read about a "$200 monthly credit," that's the old
system.) For peace of mind you can add a **budget alert** in the billing
console so Google emails you long before anything would be charged.
Current details: [Google Maps Platform pricing](https://developers.google.com/maps/billing-and-pricing/overview).

## Step 1 — Create a project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/) —
   signed in with the **business's** Google account, not a personal one.
2. Click the project dropdown in the top bar → **New Project**.
3. Name it after your website, click **Create**, then select the project in
   the popup.

## Step 2 — Enable the map engine

1. In the menu, go to **APIs & Services → Library**.
2. Search for **Maps JavaScript API** and click **Enable**.
3. Google will walk you through account verification and billing setup at
   this point — that's the credit-card step from above.

## Step 3 — Get your key

When the API is enabled, Google generates your key and shows it once in a
popup — copy it. (You can always find it again later under **APIs &
Services → Credentials**.)

## Step 4 — Lock the key down

An unrestricted key can be hijacked and run up someone else's usage on your
billing. Two restrictions close that door — in **APIs & Services →
Credentials**, click your key:

1. **Application restrictions** → choose **Websites** → add your domain in
   exactly this shape (the format is picky):

```
https://<your-domain>/*
```

2. **API restrictions** → **Restrict key** → select **Maps JavaScript API**.
   (If your site's map plugin also does address lookups or place search,
   your web team may ask you to add **Geocoding API** or **Places API** —
   add only what they name.)

Click **Save**.

## Hand it over

Send the key to your web team — with the restrictions on, it only works on
your website, so sharing it is safe.

> **Working with WEBDOGS?** Two extras: add your staging domain to the
> Websites list as well — `https://<your-site>.wpenginepowered.com/*` —
> so the map works while we build and test, and then just reply to our
> request email with the key. We'll take it from there.

## Check it worked

Once your web team installs the key, the map should render on your site.
If you ever want to see usage (and confirm you're nowhere near the free
limit), it's in the Cloud Console under **Google Maps Platform → Metrics**.
