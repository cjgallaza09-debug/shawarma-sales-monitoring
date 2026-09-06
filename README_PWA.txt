DAILY SALES MONITORING - PWA

This version is PWA-ready.

ANDROID INSTALL:
1. Host the folder on HTTPS (localhost is also OK for testing).
2. Open index.html through the hosted site in Chrome on Android.
3. Use Chrome menu > Install app / Add to Home screen when offered.

NOTE: Data saved with localStorage stays on the device/browser. The SheetJS CDN used for Excel functions may require internet access.


SHARED DATABASE VERSION
This version uses Supabase for shared sales and inventory data.
Users must log in with a Supabase Authentication email/password account.
The browser uses only the Supabase publishable key; never place a secret/service key in this file.
Data is shared among authenticated users through the sales_records and stocks tables.
