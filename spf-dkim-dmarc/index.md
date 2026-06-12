---
public: true
title: "Set Up SPF, DKIM, and DMARC for Google Workspace"
slug: spf-dkim-dmarc
verified: 2026-06-11
description: "The three DNS records that prove your email is really yours — authorize your senders, sign your mail, set the policy. Required for bulk senders since 2024."
---

# Set Up SPF, DKIM, and DMARC for Google Workspace

Anyone can put your domain in an email's From: line — unless you tell the
world's mail servers how to check. That's what these three DNS records do:
**SPF** says which servers may send as your domain, **DKIM** cryptographically
signs each message, and **DMARC** tells receivers what to do when a message
fails those checks. Together they protect your domain from spoofing *and*
your legitimate mail from the spam folder.

And this stopped being optional: since 2024, **Gmail requires SPF, DKIM, and
DMARC from anyone sending 5,000+ messages a day** — and authenticated mail
gets better deliverability at any volume.

What you'll need: access to your domain's **DNS settings**, and **super
administrator** access to the Google Admin console. Each record is a TXT
entry; changes can take up to 48 hours to propagate.

## Check what you already have

Before adding anything, see where you stand with
[mail-tester's SPF/DKIM checker](https://www.mail-tester.com/spf-dkim-check).
You'll need your DKIM selector to check it — for Google Workspace the default
selector is **`google`**.

Two outcomes: records exist (verify they match the values below), or they
don't (set them up in the order on this page — SPF and DKIM first, DMARC
last).

## SPF — authorize your senders

[SPF (Sender Policy Framework)](https://knowledge.workspace.google.com/admin/security/set-up-spf)
is a TXT record listing the mail servers allowed to send email for your
domain. Receivers check it to decide whether a message claiming to be from
you came from somewhere you actually authorized.

The standard record for Google Workspace:

```
Type:  TXT
Name:  @
Value: v=spf1 include:_spf.google.com ~all
```

Reading it piece by piece:

- **`v=spf1`** — the SPF version (only spf1 exists).
- **`include:_spf.google.com`** — inherits all of Google's sending IPs, so
  anything sent through Workspace passes.
- **`~all`** — SoftFail everything else: mail from unauthorized servers gets
  accepted but flagged.

The qualifier on `all` controls how strict you are:

| Qualifier | Result | Meaning | Receiver action |
|---|---|---|---|
| `+` | Pass | Host is allowed to send | Accept |
| `-` | Fail | Host is NOT allowed to send | Reject |
| `~` | SoftFail | Host is NOT allowed to send | Accept & tag |
| `?` | Neutral | No claim either way | Accept |

**If anything else sends mail as your domain** — a CRM, a website contact
form, a printer/scanner — it must be in the record too, or its mail will
fail. Add the sender's IP before the include:

```
v=spf1 ip4:7.7.7.7 include:_spf.google.com ~all
```

Three gotchas worth knowing:

- **One SPF record per domain.** Multiple SPF TXT records make SPF fail
  outright — merge everything into a single record.
- **Stay under 10 lookups.** An SPF record can trigger at most 10 DNS
  lookups (`include:` tags etc.) — more and it fails with some receivers.
  That's the SPF standard, not a Google rule.
- **Subdomains need their own records** if they send mail.

## DKIM — sign your mail

[DKIM (DomainKeys Identified Mail)](https://knowledge.workspace.google.com/admin/security/set-up-dkim)
adds a cryptographic signature to every outgoing message. Google signs with
a private key; receivers verify against the public key you publish in DNS —
proof the message really came from your domain and wasn't altered.

The record you'll end up publishing looks like:

```
Type:  TXT
Name:  google._domainkey
Value: v=DKIM1; k=rsa; p=<your-public-key>
```

(Your actual key comes from the Admin console — never copy one from an
example.)

### Step 1 — Generate your key

*Requires super administrator. Note: if Gmail was just turned on for your
organization, the key isn't available until 24–72 hours later.*

1. In the [Google Admin console](https://admin.google.com), go to
   **Apps → Google Workspace → Gmail**.
2. Click **Authenticate email**.
3. In the **Selected domain** menu, pick the domain.
4. Click **Generate New Record**, choose **2048**-bit (use 1024 only if your
   DNS host can't handle long TXT values), and click **Generate**.
5. Copy the **DNS Host name (TXT record name)** and the **TXT record value**.

### Step 2 — Publish the key in DNS

1. Sign in to your domain's DNS management console.
2. Add a TXT record: name = the **DNS Host name** from Step 1, value = the
   **TXT record value** from Step 1.
3. Save.

### Step 3 — Turn on signing

1. Back in **Apps → Google Workspace → Gmail → Authenticate email**, select
   the same domain.
2. Click **Start authentication**. When it's working, the status changes to
   **Authenticating email with DKIM**.

The console may keep saying "You must update the DNS records for this
domain" for up to 48 hours after you've done everything right — if the
record is published, you can ignore it.

## DMARC — set the policy

[DMARC](https://knowledge.workspace.google.com/admin/security/set-up-dmarc)
ties it together: it tells receivers what to *do* with mail that fails SPF
and DKIM, and sends you reports about who's sending as your domain.
**Prerequisite:** SPF and DKIM must be live for at least 48 hours first.

There are two routes, depending on the domain:

### Route A — you control every sender (fresh or fully-managed setup)

If you just completed the SPF and DKIM steps above and **all** of this
domain's mail goes through Google Workspace (no forgotten CRM, billing
system, or website form sending as the domain), you can enforce immediately
— anything failing the checks *is* spoofed. This is the record WEBDOGS
publishes on the domains it manages:

```
Type:  TXT
Name:  _dmarc
Value: v=DMARC1; p=reject; pct=100
```

(`pct=100` is technically the default, but stating it makes the intent
unambiguous.)

### Route B — the domain has history

If the domain has years of accumulated services that might send as it,
enforcing immediately can bounce legitimate mail. Start in monitoring mode —
Google's recommendation — and ramp up. This minimal record is safe to paste
exactly as written:

```
Type:  TXT
Name:  _dmarc
Value: v=DMARC1; p=none
```

It blocks nothing and satisfies receivers that check for a DMARC record —
but it's blind. The whole point of monitoring mode is the *reports*, which
you turn on next.

### Turn on reporting — once the address is real

Reporting is what makes Route B's monitoring mode mean anything — and it's
worth adding on Route A too (even at `p=reject`, reports are how you'd spot
a false positive). But reports sent to a mailbox that doesn't exist simply
bounce: the record looks configured, and you're monitoring nothing. So set
up the destination **first** — one of:

- a **free DMARC report service** (Cloudflare DMARC Management and
  Postmark's DMARC digests both are) — recommended, because the raw reports
  are gzipped XML from every major receiver, daily, and a service turns them
  into something a human can read; or
- a **dedicated mailbox or group** on your domain (in Google Workspace, a
  group is free) if you'd rather collect them yourself.

Then update the record's value, substituting the address that now exists:

```
v=DMARC1; p=none; rua=mailto:<the-address-you-just-set-up>
```

One subtlety: if reports go to a *different domain* than the one you're
monitoring, that domain has to publish a small authorization record — report
services set this up for you.

The full tag set:

| Tag | Required | Purpose | Sample |
|---|---|---|---|
| `v` | required | Protocol version | `v=DMARC1` |
| `p` | required | Policy for your domain | `p=quarantine` |
| `pct` | optional | % of failing messages the policy applies to | `pct=20` |
| `rua` | optional | Where aggregate reports are emailed | `rua=mailto:aggrep@example.com` |
| `sp` | optional | Policy for subdomains | `sp=reject` |
| `aspf` | optional | SPF alignment mode (relaxed/strict) | `aspf=r` |

### Ramp up the policy (Route B)

As the reports come back clean, tighten the policy until you arrive at
Route A's destination:

1. **`p=none`** — nothing is blocked; you just get reports. *(start here)*
2. **`p=quarantine; pct=5`** — 5% of failing mail goes to spam; raise `pct`
   gradually.
3. **`p=reject`** — failing mail is refused outright. *(the destination)*

## Verify it all works

After DNS has had time to propagate (up to 48 hours):

1. Re-run the [mail-tester checker](https://www.mail-tester.com/spf-dkim-check)
   — SPF and DKIM (selector `google`) should both pass.
2. Send yourself a test message to any Gmail address, open it, and use
   **Show original** — the Authentication-Results summary should show
   `SPF: PASS`, `DKIM: PASS`, and `DMARC: PASS`.
3. Watch the DMARC reports arrive at your `rua=` address, and tighten the
   policy when they look clean.
