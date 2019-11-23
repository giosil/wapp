# WApp - Wrapped App Mobile

A simple cordova hybrid mobile app based on jQuery Mobile.

## Requirements

- [Install Android SDK tools](https://developer.android.com)
- [Install Gradle Build Tool](https://gradle.org)
- [Install NodeJS](https://nodejs.org)
- `npm install -g cordova`


## Build

- `git clone https://github.com/giosil/wapp.git`
- `cordova platform add android`
- `cordova build`

## Plugins used

- `cordova plugin add cordova-plugin-whitelist --save`
- `cordova plugin add cordova-plugin-x-toast --save`
- `cordova plugin add cordova-plugin-splashscreen --save`
- `cordova plugin add https://github.com/katzer/cordova-plugin-local-notifications --save`
- `cordova plugin add https://github.com/wildabeast/BarcodeScanner.git --save`
- `cordova plugin add cordova.plugins.diagnostic --save`

## Run

- `cordova run android --device`

## Try it directly

Install dist/wapp.apk on an Android device.

![WApp](wapp.png)

## Contributors

* [Giorgio Silvestris](https://github.com/giosil)
