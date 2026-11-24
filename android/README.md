# Khep for Android

The Android app is a Trusted Web Activity: a thin Android shell that opens the live site at `app.html` full screen. Website changes reach the app without a new release.

| File | What it is |
| --- | --- |
| `Khep-1.0.0.aab` | The Android App Bundle to upload to Google Play |
| `assetlinks.json` | Copy of the file served at `https://anshumantewary-pm.github.io/.well-known/assetlinks.json` (repo `anshumantewary-pm.github.io`), which lets Android open the site without an address bar |
| `twa-config.json` | The packaging settings used, without passwords |

The installable APK the website serves is `../download/Khep.apk`.

## Not in this repo, on purpose

The signing key (`signing.keystore`) and its passwords (`signing-key-info.txt`) are kept outside git, in `C:\Users\Admin\khep-android\pkg\` on the build machine. Every future update must be signed with this same key. Back it up somewhere private, such as a password manager. If it leaks, anyone could sign a fake Khep update.

## Releasing an update

1. Raise `appVersion` and `appVersionCode` in `twa-config.json`.
2. Build with PWABuilder (pwabuilder.com or its packaging API) using these settings, with signing mode "use my key" and the existing keystore.
3. Upload the new `.aab` to Google Play and replace `download/Khep.apk` on the website.

After the first Play Store upload, add Google's app signing SHA-256 fingerprint (Play Console, App integrity) to `assetlinks.json` in the `anshumantewary-pm.github.io` repo.
