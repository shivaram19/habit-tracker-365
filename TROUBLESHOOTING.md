# Troubleshooting Guide - Habit Tracker 365

> A documented collection of issues encountered during development, organized by difficulty level.

---

## 🟢 BEGINNER Level Issues

### 1. Environment Variable Not Set - `ANDROID_HOME`

**Keywords:** `adb not recognized`, `ANDROID_HOME`, `environment variables`, `PATH`, `Android SDK`

**Symptoms:**
```
'adb' is not recognized as an internal or external command
```

**Root Cause:**
Windows doesn't know where the Android SDK is installed. The `ANDROID_HOME` environment variable is not set.

**Solution:**
```powershell
# Temporary fix (current session only)
$env:ANDROID_HOME = 'C:\Users\<username>\AppData\Local\Android\Sdk'
$env:PATH = "$env:ANDROID_HOME\platform-tools;$env:PATH"

# Permanent fix (run as Administrator)
[Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\<username>\AppData\Local\Android\Sdk", "User")
```

**Prevention:**
- Create helper scripts like `dev-android.bat` that set variables before running commands
- Add to Windows System Environment Variables permanently

---

### 2. Port Already In Use

**Keywords:** `Port 8081`, `EADDRINUSE`, `Metro Bundler`, `port conflict`

**Symptoms:**
```
Port 8081 is being used by another process
```

**Root Cause:**
A previous Metro Bundler or Node.js process didn't terminate properly.

**Solution:**
```powershell
# Kill all Node processes
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

# Or kill specific port
npx kill-port 8081
```

**Prevention:**
- Always use `Ctrl+C` to properly stop the dev server
- Check for zombie processes before starting

---

### 3. Emulator Not Found / Not Running

**Keywords:** `no devices/emulators found`, `adb devices`, `emulator offline`

**Symptoms:**
```
error: no devices/emulators found
List of devices attached
(empty)
```

**Root Cause:**
Android emulator is not running or ADB can't connect to it.

**Solution:**
```powershell
# Start emulator
emulator -avd Pixel_5

# Check connected devices
adb devices

# If emulator shows "offline", restart ADB
adb kill-server
adb start-server
```

---

## 🟡 INTERMEDIATE Level Issues

### 4. Android Emulator No Internet Connection

**Keywords:** `Network request failed`, `TypeError`, `emulator no internet`, `ping 100% packet loss`, `no default route`

**Symptoms:**
```
ERROR [TypeError: Network request failed]
Call Stack
  setTimeout$argument_0 (node_modules\whatwg-fetch\dist\fetch.umd.js)
```
Or when testing connectivity:
```
PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.
3 packets transmitted, 0 received, 100% packet loss
```

**Root Cause:**
The Android emulator cannot reach the internet. Common causes:
1. Corporate VPN interfering with emulator networking
2. Windows Firewall blocking emulator traffic
3. Hyper-V/WSL2 conflicting with HAXM/emulator
4. Missing default route in emulator network config

**Diagnosis:**
```powershell
# Check if emulator can reach host
adb shell ping -c 2 10.0.2.2  # Should work

# Check if emulator can reach internet  
adb shell ping -c 2 8.8.8.8   # Will fail if issue exists

# Check routes
adb shell "ip route"  # Look for missing "default via" route
```

**Solutions:**

**Solution 1: Restart emulator with DNS servers:**
```powershell
emulator -avd Pixel_5 -dns-server 8.8.8.8,8.8.4.4
```

**Solution 2: Cold boot emulator:**
```powershell
emulator -avd Pixel_5 -no-snapshot-load
```

**Solution 3: Disable VPN temporarily** - Corporate VPNs often break emulator networking

**⚠️ GlobalProtect VPN Specific:**
GlobalProtect (Palo Alto Networks) is known to completely block Android emulator internet access. Detection:
```powershell
# Check if GlobalProtect is active
Get-NetAdapter | Where-Object { $_.InterfaceDescription -match 'PANGP' }
```
**The only reliable fix is to disconnect GlobalProtect while developing.**

Alternatives if you can't disconnect VPN:
- Use a physical Android device connected via USB
- Request IT to whitelist emulator traffic
- Use Expo Go on a physical device (scan QR code)

**Solution 4: Check Windows Firewall:**
- Open Windows Defender Firewall
- Allow `emulator.exe` through both private and public networks

**Solution 5: Wipe emulator data:**
```powershell
emulator -avd Pixel_5 -wipe-data
```

**Solution 6: Use Android Studio's Extended Controls:**
- Click `...` on emulator sidebar
- Go to Settings → Proxy
- Ensure "No proxy" is selected

---

### 5. SSL Certificate Error During Gradle Download

**Keywords:** `PKIX path building failed`, `SSL`, `certificate`, `Gradle download`, `trustStore`

**Symptoms:**
```
javax.net.ssl.SSLHandshakeException: PKIX path building failed
Could not resolve org.gradle.tooling:gradle-tooling-api
```

**Root Cause:**
Corporate firewall/proxy intercepting HTTPS traffic with custom certificates that Java doesn't trust.

**Solution:**
```powershell
# Use Windows certificate store
$env:JAVA_OPTS = "-Djavax.net.ssl.trustStoreType=Windows-ROOT"

# Then run build
npx expo run:android
```

**File Fix:** Add to `android/gradle.properties`:
```properties
systemProp.javax.net.ssl.trustStoreType=Windows-ROOT
```

---

### 5. Gradle Socket Timeout

**Keywords:** `SocketTimeoutException`, `Gradle`, `dependency download`, `timeout`

**Symptoms:**
```
java.net.SocketTimeoutException: Read timed out
Could not download spring-core.jar
```

**Root Cause:**
Slow network connection or large dependencies timing out during download.

**Solution:**
Add to `android/gradle.properties`:
```properties
systemProp.org.gradle.internal.http.connectionTimeout=600000
systemProp.org.gradle.internal.http.socketTimeout=600000
```

---

### 6. SafeAreaView Deprecation Warning

**Keywords:** `SafeAreaView deprecated`, `react-native-safe-area-context`

**Symptoms:**
```
WARN SafeAreaView has been deprecated and will be removed in a future release
```

**Root Cause:**
Using old `SafeAreaView` from `react-native` instead of the community package.

**Solution:**
```tsx
// ❌ Old way
import { SafeAreaView } from 'react-native';

// ✅ New way
import { SafeAreaView } from 'react-native-safe-area-context';
```

---

## 🔴 DIFFICULT Level Issues

### 7. Blank White Screen with Invisible UI Elements

**Keywords:** `blank screen`, `white screen`, `invisible components`, `Animated.Value`, `useRef`, `opacity animation`

**Symptoms:**
- Screen appears completely white/blank
- Tapping screen shows keyboard (indicating input fields exist but are invisible)
- Console logs show component is rendering
- No JavaScript errors

**Root Cause:**
`Animated.Value` objects were being recreated on every render, causing the fade-in animation to restart from opacity `0` infinitely.

```tsx
// ❌ WRONG - Creates new Animated.Value on every render
const LoginScreen = () => {
  const fadeAnim = new Animated.Value(0);  // Recreated each render!
  const slideAnim = new Animated.Value(30);
  
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1 }).start();
  }, []);  // Animation restarts but fadeAnim is new object
  
  return <Animated.View style={{ opacity: fadeAnim }}>...</Animated.View>
}
```

**Solution:**
Use `useRef` to persist the Animated.Value across renders:

```tsx
// ✅ CORRECT - Persists Animated.Value across renders
const LoginScreen = () => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;
  
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1 }).start();
  }, []);  // Works correctly now
  
  return <Animated.View style={{ opacity: fadeAnim }}>...</Animated.View>
}
```

**Debugging Steps:**
1. Add console.log to confirm component renders
2. Check if animations start AND complete
3. Add fallback colors to verify theme isn't the issue
4. Look for `new Animated.Value()` outside of `useRef`

---

### 8. `window` Reference Error in React Native

**Keywords:** `window is not defined`, `ReferenceError`, `Platform.OS`, `web vs native`

**Symptoms:**
```
ReferenceError: window is not defined
```

**Root Cause:**
Code written for web browsers uses `window` object, which doesn't exist in React Native.

**Solution:**
```tsx
// ❌ WRONG - window doesn't exist in React Native
useEffect(() => {
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => setReady(true));
  }
}, []);

// ✅ CORRECT - Check platform first
import { Platform } from 'react-native';

useEffect(() => {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    document.fonts?.ready?.then(() => setReady(true));
  } else {
    setReady(true);  // Native doesn't need font loading
  }
}, []);
```

---

### 9. Theme Context Returning Undefined

**Keywords:** `undefined theme`, `context`, `fallback values`, `optional chaining`

**Symptoms:**
- Styles not applied correctly
- `Cannot read property 'colors' of undefined`
- Blank/unstyled components

**Root Cause:**
Theme context might not be available during initial render or context provider is missing.

**Solution:**
Always use fallback values:
```tsx
// ❌ Risky - crashes if theme is undefined
backgroundColor: theme.colors.background.primary

// ✅ Safe - provides fallback
backgroundColor: theme?.colors?.background?.primary || '#FFFFFF'
```

---

## 📋 Quick Reference Checklist

### Before Starting Development
- [ ] Android emulator running (`adb devices` shows device)
- [ ] No zombie Node processes (`Get-Process node`)
- [ ] ANDROID_HOME set correctly
- [ ] Port 8081 available

### When App Shows Blank Screen
- [ ] Check console for JavaScript errors
- [ ] Add console.log to verify component renders
- [ ] Look for animation issues (`new Animated.Value` without `useRef`)
- [ ] Add fallback colors to styles
- [ ] Check ErrorBoundary is wrapping app
- [ ] Verify theme context is available

### When Build Fails
- [ ] Check internet connection
- [ ] Set SSL trust store for corporate networks
- [ ] Increase Gradle timeout values
- [ ] Clear Gradle cache: `cd android && ./gradlew clean`

---

## 🛠️ Useful Commands

```powershell
# Check emulator status
adb devices

# Reload app on emulator
adb shell input keyevent 82  # Opens dev menu

# Clear Metro cache
npx expo start --clear

# Full clean rebuild
cd android && ./gradlew clean && cd ..
npx expo run:android

# Kill stuck processes
Get-Process -Name "node" | Stop-Process -Force
npx kill-port 8081 8082
```

---

*Last Updated: January 11, 2026*
*Document generated after debugging session for habit-tracker-365*
