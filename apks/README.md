# 📱 Maa Ki Rasoi – Android APKs

These are the compiled Android App Packages (APKs) for the Maa Ki Rasoi ecosystem.

They combine the progressive web apps built using React + Vite into full native Android applications using [Capacitor 8](https://capacitorjs.com/).

## 📦 Available Apps

| App | Description | File |
|---|---|---|
| **Customer App** | Main app for users to browse menus and order meals | `MaaKiRasoi-Customer.apk` |
| **Admin App** | Dashboard for restaurant owners to manage operations | `MaaKiRasoi-Admin.apk` |
| **Delivery App** | Logistics app for delivery partners to manage route | `MaaKiRasoi-Delivery.apk` |

---

## 🛠️ How to Install on Android

1. Download the `.apk` file you want to your Android device (e.g., via Google Drive, WhatsApp, or USB cable).
2. Open the file on your device to install it.
3. If prompted by Android, go to **Settings → Security** and allow **"Install unknown apps"** for your file manager or browser.
4. Launch the app from your home screen!

---

## 🏗️ How to Build These APKs Yourself

To compile these APKs from the source code, you need **Node.js**, **Java JDK 21**, and **Android Studio** installed.

### Prerequisites
1. Install [Java JDK 21](https://www.oracle.com/java/technologies/downloads/#java21)
2. Install [Android Studio](https://developer.android.com/studio) (includes the Android SDK)
3. Set your system environment variables `JAVA_HOME` and `ANDROID_HOME` to point to the respective installation folders.

### Build Commands (Example for Customer App)
Open a terminal in the root directory of the project, then run:

```bash
# 1. Build the production web app
cd apps/customer
npm run build

# 2. Add and sync the Android Capacitor project
npx cap add android
npx cap sync android

# 3. Compile the debug APK using Gradle
cd android
./gradlew assembleDebug
```

After building, you can find the generated `.apk` file at:
`apps/customer/android/app/build/outputs/apk/debug/app-debug.apk`
