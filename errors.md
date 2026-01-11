# Fixed Issues

## ExpoSecureStore.default.setValueWithKeyAsync is not a function
✅ RESOLVED - Updated auth.ts to use cross-platform storage handling with AsyncStorage for web and SecureStore for mobile.