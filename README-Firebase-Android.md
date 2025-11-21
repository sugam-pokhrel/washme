# Firebase Android setup for this Expo project

This repo contains `google-services.json` and is configured to include it in native builds via `app.json`.

Steps to finish Android Firebase integration:

1. Add SHA-1 to Firebase Console
   - Get debug SHA-1:
     ```powershell
     keytool -list -v -alias androiddebugkey -keystore %USERPROFILE%\\.android\\debug.keystore -storepass android -keypass android
     ```
   - In Firebase Console → Project settings → Your apps → Select the Android app and add the SHA-1.

2. Enable Google sign-in provider
   - Firebase Console → Authentication → Sign-in method → Enable Google.

3. Enable Identity Toolkit API
   - Google Cloud Console → APIs & Services → Library → Search "Identity Toolkit API" → Enable.

4. Build a native Android app so `google-services.json` is consumed
   - Recommended: use EAS Build
     ```powershell
     npm install -g eas-cli
     eas login
     eas build -p android --profile production
     ```
   - Or test locally (requires Android SDK and emulator):
     ```powershell
     npx expo prebuild
     npx react-native run-android
     ```

5. Test sign-in flows on device/emulator
   - Run the app, try Google sign-in, and anonymous sign-in. The app listens for auth state and will show the authenticated stack.

6. Firestore rules
   - A sample `firestore.rules` is included in the repo. Apply it in Firebase Console → Firestore → Rules.

If you want, I can:
- Start an EAS build for you (I will need you to login to EAS and provide the necessary app signing credentials), or
- Add more Firebase SDK dependencies to `android/app/build.gradle` (Auth, Firestore native libs) if you plan to use native modules instead of the JS SDK.
