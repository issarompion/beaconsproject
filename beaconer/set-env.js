const fs = require('fs')
const path = require('path')
const colors = require('colors')
const dotenv = require('dotenv')

// Configure Angular `environment.ts` file path
dotenv.config({ path: path.resolve(__dirname, "../.env") })
const targetPath = './src/environments/environment.ts';
const targetProdPath = './src/environments/environment.prod.ts';
const targetConfigXmlPath = './config.xml';


const envConfigFile = `export const environment = {
  production: false,
  api_url:'http://${process.env.API_URL}:${process.env.API_PORT}',
  beacon_identifier:'${process.env.BEACON_IDENTIFIER}',
  google_maps_browser_api_key:'${process.env.GOOGLE_MAPS_BROWSER_API_KEY}',
  project_name:'${process.env.PROJECT_NAME}'
};
`;

const envProdConfigFile = `export const environment = {
  production: true,
  api_url:'http://${process.env.API_URL}:${process.env.API_PORT}',
  beacon_identifier:'${process.env.BEACON_IDENTIFIER}',
  google_maps_browser_api_key:'${process.env.GOOGLE_MAPS_BROWSER_API_KEY}',
  project_name:'${process.env.PROJECT_NAME}'
};
`;

const envConfigXmlFile = `<?xml version='1.0' encoding='utf-8'?>
<widget id="io.ionic.starter" version="0.0.1" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
    <name>${process.env.PROJECT_NAME}</name>
    <description>Mobile application used to display the contents of beacon, using angular, ionic and cordova.</description>
    <author email="hi@ionicframework.com" href="http://ionicframework.com/">Ionic Framework Team</author>
    <content src="index.html" />
    <access origin="*" />
    <allow-intent href="http://*/*" />
    <allow-intent href="https://*/*" />
    <allow-intent href="tel:*" />
    <allow-intent href="sms:*" />
    <allow-intent href="mailto:*" />
    <allow-intent href="geo:*" />
    <preference name="ScrollEnabled" value="false" />
    <preference name="android-minSdkVersion" value="19" />
    <preference name="BackupWebStorage" value="none" />
    <preference name="SplashMaintainAspectRatio" value="true" />
    <preference name="FadeSplashScreenDuration" value="300" />
    <preference name="SplashShowOnlyFirstTime" value="false" />
    <preference name="SplashScreen" value="screen" />
    <preference name="SplashScreenDelay" value="3000" />
    <preference name="GOOGLE_MAPS_ANDROID_API_KEY" value="${process.env.GOOGLE_MAPS_ANDROID_API_KEY}" />
    <preference name="GOOGLE_MAPS_IOS_API_KEY" value="${process.env.GOOGLE_MAPS_IOS_API_KEY}" />
    <platform name="android">
        <edit-config file="app/src/main/AndroidManifest.xml" mode="merge" target="/manifest/application" xmlns:android="http://schemas.android.com/apk/res/android">
            <application android:networkSecurityConfig="@xml/network_security_config" />
        </edit-config>
        <resource-file src="resources/android/xml/network_security_config.xml" target="app/src/main/res/xml/network_security_config.xml" />
        <allow-intent href="market:*" />
        <icon density="ldpi" src="resources/android/icon/drawable-ldpi-icon.png" />
        <icon density="mdpi" src="resources/android/icon/drawable-mdpi-icon.png" />
        <icon density="hdpi" src="resources/android/icon/drawable-hdpi-icon.png" />
        <icon density="xhdpi" src="resources/android/icon/drawable-xhdpi-icon.png" />
        <icon density="xxhdpi" src="resources/android/icon/drawable-xxhdpi-icon.png" />
        <icon density="xxxhdpi" src="resources/android/icon/drawable-xxxhdpi-icon.png" />
        <splash density="land-ldpi" src="resources/android/splash/drawable-land-ldpi-screen.png" />
        <splash density="land-mdpi" src="resources/android/splash/drawable-land-mdpi-screen.png" />
        <splash density="land-hdpi" src="resources/android/splash/drawable-land-hdpi-screen.png" />
        <splash density="land-xhdpi" src="resources/android/splash/drawable-land-xhdpi-screen.png" />
        <splash density="land-xxhdpi" src="resources/android/splash/drawable-land-xxhdpi-screen.png" />
        <splash density="land-xxxhdpi" src="resources/android/splash/drawable-land-xxxhdpi-screen.png" />
        <splash density="port-ldpi" src="resources/android/splash/drawable-port-ldpi-screen.png" />
        <splash density="port-mdpi" src="resources/android/splash/drawable-port-mdpi-screen.png" />
        <splash density="port-hdpi" src="resources/android/splash/drawable-port-hdpi-screen.png" />
        <splash density="port-xhdpi" src="resources/android/splash/drawable-port-xhdpi-screen.png" />
        <splash density="port-xxhdpi" src="resources/android/splash/drawable-port-xxhdpi-screen.png" />
        <splash density="port-xxxhdpi" src="resources/android/splash/drawable-port-xxxhdpi-screen.png" />
    </platform>
    <platform name="ios">
        <allow-intent href="itms:*" />
        <allow-intent href="itms-apps:*" />
        <icon height="57" src="resources/ios/icon/icon.png" width="57" />
        <icon height="114" src="resources/ios/icon/icon@2x.png" width="114" />
        <icon height="29" src="resources/ios/icon/icon-small.png" width="29" />
        <icon height="58" src="resources/ios/icon/icon-small@2x.png" width="58" />
        <icon height="87" src="resources/ios/icon/icon-small@3x.png" width="87" />
        <icon height="20" src="resources/ios/icon/icon-20.png" width="20" />
        <icon height="40" src="resources/ios/icon/icon-20@2x.png" width="40" />
        <icon height="60" src="resources/ios/icon/icon-20@3x.png" width="60" />
        <icon height="48" src="resources/ios/icon/icon-24@2x.png" width="48" />
        <icon height="55" src="resources/ios/icon/icon-27.5@2x.png" width="55" />
        <icon height="29" src="resources/ios/icon/icon-29.png" width="29" />
        <icon height="58" src="resources/ios/icon/icon-29@2x.png" width="58" />
        <icon height="87" src="resources/ios/icon/icon-29@3x.png" width="87" />
        <icon height="40" src="resources/ios/icon/icon-40.png" width="40" />
        <icon height="80" src="resources/ios/icon/icon-40@2x.png" width="80" />
        <icon height="120" src="resources/ios/icon/icon-40@3x.png" width="120" />
        <icon height="88" src="resources/ios/icon/icon-44@2x.png" width="88" />
        <icon height="50" src="resources/ios/icon/icon-50.png" width="50" />
        <icon height="100" src="resources/ios/icon/icon-50@2x.png" width="100" />
        <icon height="60" src="resources/ios/icon/icon-60.png" width="60" />
        <icon height="120" src="resources/ios/icon/icon-60@2x.png" width="120" />
        <icon height="180" src="resources/ios/icon/icon-60@3x.png" width="180" />
        <icon height="72" src="resources/ios/icon/icon-72.png" width="72" />
        <icon height="144" src="resources/ios/icon/icon-72@2x.png" width="144" />
        <icon height="76" src="resources/ios/icon/icon-76.png" width="76" />
        <icon height="152" src="resources/ios/icon/icon-76@2x.png" width="152" />
        <icon height="167" src="resources/ios/icon/icon-83.5@2x.png" width="167" />
        <icon height="172" src="resources/ios/icon/icon-86@2x.png" width="172" />
        <icon height="196" src="resources/ios/icon/icon-98@2x.png" width="196" />
        <icon height="1024" src="resources/ios/icon/icon-1024.png" width="1024" />
        <splash height="480" src="resources/ios/splash/Default~iphone.png" width="320" />
        <splash height="960" src="resources/ios/splash/Default@2x~iphone.png" width="640" />
        <splash height="1024" src="resources/ios/splash/Default-Portrait~ipad.png" width="768" />
        <splash height="768" src="resources/ios/splash/Default-Landscape~ipad.png" width="1024" />
        <splash height="1125" src="resources/ios/splash/Default-Landscape-2436h.png" width="2436" />
        <splash height="1242" src="resources/ios/splash/Default-Landscape-736h.png" width="2208" />
        <splash height="2048" src="resources/ios/splash/Default-Portrait@2x~ipad.png" width="1536" />
        <splash height="1536" src="resources/ios/splash/Default-Landscape@2x~ipad.png" width="2048" />
        <splash height="2732" src="resources/ios/splash/Default-Portrait@~ipadpro.png" width="2048" />
        <splash height="2048" src="resources/ios/splash/Default-Landscape@~ipadpro.png" width="2732" />
        <splash height="1136" src="resources/ios/splash/Default-568h@2x~iphone.png" width="640" />
        <splash height="1334" src="resources/ios/splash/Default-667h.png" width="750" />
        <splash height="2208" src="resources/ios/splash/Default-736h.png" width="1242" />
        <splash height="2436" src="resources/ios/splash/Default-2436h.png" width="1125" />
        <splash height="2732" src="resources/ios/splash/Default@2x~universal~anyany.png" width="2732" />
    </platform>
    <plugin name="cordova-plugin-whitelist" spec="1.3.3" />
    <plugin name="cordova-plugin-statusbar" spec="2.4.2" />
    <plugin name="cordova-plugin-device" spec="2.0.2" />
    <plugin name="cordova-plugin-splashscreen" spec="5.0.2" />
    <plugin name="cordova-plugin-ionic-webview" spec="^4.0.0" />
    <plugin name="cordova-plugin-ionic-keyboard" spec="^2.0.5" />
</widget>
`




setEnv(envConfigFile,targetPath);
setEnv(envProdConfigFile,targetProdPath)
setEnv(envConfigXmlFile,targetConfigXmlPath)

function setEnv(envConfigFile,targetPath){
  console.log(colors.magenta(`The file ${targetPath} will be written with the following content: \n`));
  console.log(colors.grey(envConfigFile));
  fs.writeFile(targetPath, envConfigFile, function (err) {
     if (err) {
         throw console.error(err);
     } else {
         console.log(colors.magenta(`Angular environment file generated correctly at ${targetPath} \n`));
     }
  });
}