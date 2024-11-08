# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   "@react-native-async-storage/async-storage"
   "axios"
   "expo-location"
   "react-native-maps"
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

1. Obtain a Google Maps API key by following the [Google Maps Platform documentation](https://developers.google.com/maps/documentation).
2. Add the API key to `app.json`:

   ```json
   {
     "expo": {
       "android": {
         "config": {
           "googleMaps": {
             "apiKey": "YOUR_GOOGLE_MAPS_API_KEY"
           }
         }
       },
       "ios": {
         "config": {
           "googleMapsApiKey": "YOUR_GOOGLE_MAPS_API_KEY"
         }
       }
     }
   }
   ```

   Change url with your ip address:
   http://192.168.1.38:8080
