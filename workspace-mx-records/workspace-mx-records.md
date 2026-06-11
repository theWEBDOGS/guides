
# Route Your Email to Google Workspace — the MX Records

MX records are the DNS entries that tell the world's mail servers where to
deliver your domain's email. For Google Workspace this used to take five
records — **since 2023 it takes one.** This page has the current value, the
legacy set you might still be running, and how to verify yours.

What you'll need: access to your domain's DNS settings (your registrar or
DNS host).

## The current record — one line

For any domain being set up today, Google's recommended MX configuration is
a single record:

| Name/Host | TTL | Type | Priority | Value |
|---|---|---|---|---|
| Blank or `@` | Your host's default (3600 is typical) | MX | **1** | `smtp.google.com` |

That's the whole table. Add it, remove any other MX records the domain has
(old mail providers' records left behind will misroute your mail), and save.

## Already on the legacy five records?

Domains set up before 2023 typically carry this set — **it still works, and
Google says no change is required** if your mail is flowing:

| Name/Host | TTL | Type | Priority | Value |
|---|---|---|---|---|
| Blank or `@` | 3600 | MX | 1 | `ASPMX.L.GOOGLE.COM` |
| Blank or `@` | 3600 | MX | 5 | `ALT1.ASPMX.L.GOOGLE.COM` |
| Blank or `@` | 3600 | MX | 5 | `ALT2.ASPMX.L.GOOGLE.COM` |
| Blank or `@` | 3600 | MX | 10 | `ALT3.ASPMX.L.GOOGLE.COM` |
| Blank or `@` | 3600 | MX | 10 | `ALT4.ASPMX.L.GOOGLE.COM` |

Keep it as a set: if you ever modernize, replace all five with the single
`smtp.google.com` record in one edit — don't run a mix of both.

## How priority works

Mail is delivered to the server with the **lowest priority number** first
('1' beats '10'); if that server is unavailable, delivery falls through to
the next. With the modern single record there's nothing to rank — set
priority `1` and move on. On the legacy set, `ASPMX.L.GOOGLE.COM` must hold
the top spot. (Hosts express priority differently; if yours allows only one
MX record or doesn't rank at all, use the single-record setup.)

## Verify it

DNS changes can take up to 48 hours to propagate, though it's usually much
faster.

1. Run your domain through [Google's MX checker](https://toolbox.googleapps.com/apps/checkmx/)
   — it flags wrong values, stray records, and priority problems.
2. Or from a terminal, substituting your domain:

```
dig MX <your-domain> +short
```

You should see either `1 smtp.google.com.` or the five `aspmx` records — and
nothing else.

## While you're in DNS

Email that *routes* correctly still needs to *authenticate* to stay out of
spam folders — if you haven't yet, set up
[SPF, DKIM, and DMARC](/spf-dkim-dmarc/) while you're logged into your DNS
host. It's the same kind of record and takes about half an hour.
