# ActivBite Google Sheets connection

The wholesale form and admin portal use the same private Google Sheet.

1. Open the Apps Script project currently connected to the ActivBite webhook.
2. Replace its code with `activbite-google-apps-script.gs` from this folder.
3. In **Project Settings → Script properties**, add:
   - Property: `WHOLESALE_ADMIN_READ_SECRET`
   - Value: the same value used in the website `.env.local` file.
4. Choose **Deploy → Manage deployments → Edit**, select **New version**, and deploy it as a web app.
5. Keep access set to **Anyone**. The admin read operation remains protected by the secret; the Google Sheet itself stays private.
6. Put the deployed `/exec` URL in `GOOGLE_SHEETS_WEBHOOK_URL` and the matching secret in `WHOLESALE_ADMIN_READ_SECRET` for local development and deployment.

The Google Sheet is:
https://docs.google.com/spreadsheets/d/1rsdFZdNhwvUNuhoXT4zBOOVvqA4Qy8oqCySCNXIMXVo/edit
