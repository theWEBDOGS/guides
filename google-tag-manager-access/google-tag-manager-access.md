
# Grant Access to Your Google Tag Manager

When your web team needs to work in your Google Tag Manager — setting up
conversion tracking, fixing tags — the right move is to **add them as a
user**, never to share your Google password. Added as a user, every change
they make is attributed to them in Tag Manager's history, and if you ever
part ways you revoke their access with one click and your account is yours
alone again.

You'll need: a Google account with admin rights on the Tag Manager account,
and the email address your web team asked you to add. About 5 minutes.

## The two permissions that matter

Tag Manager splits permissions into two scopes, and your web team needs a
grant in each:

- **Account permission: `Admin`** — lets them add their own team members
  and create new containers.
- **Container permission: `Publish`** — lets them actually make tags and
  triggers live (it includes Edit and Approve). Account Admin alone does
  *not* include this, so don't stop after the first grant.

(Google's reference, if you want it from the source:
[Managing users and permissions](https://support.google.com/tagmanager/answer/6107011).)

## Add the user

1. Log in to [tagmanager.google.com](https://tagmanager.google.com/) and
   open the relevant account.
2. Click **Admin**. In the **Account** column, open **User Management**.
3. Add your web team's email address and set Account permissions to
   **Admin**.
4. In the same invitation (or afterward via **User Management** in the
   **Container** column), set Container permissions to **Publish** for your
   website's container.
5. If you have more than one related Tag Manager account or container,
   repeat for each.

> **WEBDOGS:** the address to add is in our request email — just reply
> there once you've added it. Don't have Tag Manager set up at all? Tell us
> and we'll set it up for you instead.

## Done — and reversible

That's it. You can see everyone with access (and remove anyone) any time in
the same **User Management** screens — which is exactly why this beats
sharing a password.
