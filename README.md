
# Retailer App

This App primary users are Retailer or Shop keepers.
The build platform are Android 12 and IOS 16.
Used Capacitor for Native bridge.


## Installation

Clone the project
```
git clone https://github.com/priyamkumardas/Ionic_Angular
```
get into the project directory &
Install packages with npm

```bash
  cd my-project
  npm install 
  
```
Run the project
```
ionic serve
```

Open the browser to the respective localhost address in mobile view.

### Mobile Installation

For Uat Build (IOS)
```
ionic cap build ios --configuration=uat
```
(Android)
```
ionic cap build android --configuration=uat
```

CLI will trigger Xcode(ios) or Android studio(android) respectively

For Release Build (IOS)

```
ionic cap build ios --prod --configuration=uat
```   
