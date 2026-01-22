import * as LocalAuthentication from 'expo-local-authentication';
import { Alert, Platform } from 'react-native';

export class BiometricService {
    /**
     * Checks if the device has compatible hardware and enrolled biometrics.
     */
    static async isCompatible(): Promise<boolean> {
        try {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            const isEnrolled = await LocalAuthentication.isEnrolledAsync();
            return hasHardware && isEnrolled;
        } catch (error) {
            console.error('Biometric check failed', error);
            return false;
        }
    }

    /**
     * Prompts the user to authenticate using biometrics.
     * @param promptMessage Message to display in the prompt
     * @returns boolean indicating success
     */
    static async authenticate(promptMessage: string = 'Authenticate to continue'): Promise<boolean> {
        try {
            const isCompatible = await this.isCompatible();
            if (!isCompatible) {
                // On simulators or devices without setup, we might want to handle this gracefully
                // For now, returning false is safer so we don't assume auth
                console.warn('Biometrics not available or not enrolled.');
                return false;
            }

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: promptMessage,
                fallbackLabel: 'Use Device Passcode',
                cancelLabel: 'Cancel',
                disableDeviceFallback: false,
            });

            if (result.success) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Biometric auth failed', error);
            return false;
        }
    }

    /**
     * Returns the robust name of the available biometric type (e.g. "Face ID", "Touch ID").
     */
    static async getBiometricType(): Promise<string> {
        try {
            const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
            if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
                return Platform.OS === 'ios' ? 'Face ID' : 'Face Unlock';
            } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
                return Platform.OS === 'ios' ? 'Touch ID' : 'Fingerprint';
            } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
                return 'Iris Scan';
            }
            return 'Biometrics';
        } catch (error) {
            return 'Biometrics';
        }
    }
}
