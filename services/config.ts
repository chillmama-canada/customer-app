import { Platform } from 'react-native';

// Android emulator can't reach the host machine via localhost — 10.0.2.2 is
// the documented alias for it. Physical devices need EXPO_PUBLIC_API_URL set
// to the dev machine's LAN IP.
const DEV_DEFAULT = Platform.OS === 'android' ? 'http://10.0.2.2:3001' : 'http://localhost:3001';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? DEV_DEFAULT;
