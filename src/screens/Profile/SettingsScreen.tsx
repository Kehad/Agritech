import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Modal, TextInput, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { ProfileStackParamList } from '../../navigation/ProfileNavigator';
import { COLORS, hp, wp } from 'components/utils';
import { BiometricService } from '../../services/BiometricService'; // Import Service

type Props = StackScreenProps<ProfileStackParamList, 'SecurityPrivacy'>;

export default function SecurityPrivacyScreen({ navigation }: Props) {
  // Toggle States
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricType, setBiometricType] = useState('Biometrics'); // State for label
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [dataSharingEnabled, setDataSharingEnabled] = useState(true);

  // Modal States
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  // Password Form States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    checkBiometrics();
  }, []);

  const checkBiometrics = async () => {
    const compatible = await BiometricService.isCompatible();
    setBiometricAvailable(compatible);
    if (compatible) {
      const type = await BiometricService.getBiometricType();
      setBiometricType(type);
    }
  };

  const handleBiometricToggle = async (newValue: boolean) => {
    if (newValue) {
      // Enabling: Require auth to confirm
      const success = await BiometricService.authenticate(`Authenticate to enable ${biometricType}`);
      if (success) {
        setBiometricEnabled(true);
        Alert.alert('Success', `${biometricType} enabled for login.`);
      }
    } else {
      // Disabling: Just turn off
      setBiometricEnabled(false);
    }
  };

  // --- HANDLERS ---
  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setPasswordModalVisible(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      Alert.alert('Success', 'Password updated successfully');
    }, 1500);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // Simulate deletion
            Alert.alert('Account Deleted', 'Your account has been scheduled for deletion.');
            navigation.popToTop(); // Or navigate to SignIn
          }
        }
      ]
    );
  };

  // --- COMPONENTS ---
  const SecurityItem = ({
    icon,
    title,
    subtitle,
    onPress,
    isSwitch = false,
    value,
    onValueChange,
    danger = false
  }: any) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={isSwitch ? () => onValueChange(!value) : onPress}
      activeOpacity={isSwitch ? 1 : 0.7}
      disabled={isSwitch} // Let the switch handle touch if it's a switch row, or container if we want whole row tappable
    >
      <View style={[styles.iconContainer, danger && { backgroundColor: COLORS.error + '1A' }]}>
        <MaterialIcons name={icon} size={24} color={danger ? COLORS.error : COLORS.primary} />
      </View>
      <View style={{ flex: 1, paddingRight: 10 }}>
        <Text style={[styles.itemTitle, danger && { color: COLORS.error }]}>{title}</Text>
        <Text style={styles.itemSubtitle}>{subtitle}</Text>
      </View>

      {isSwitch ? (
        <Switch
          trackColor={{ false: "#767577", true: COLORS.primary }}
          thumbColor={value ? "#fff" : "#f4f3f4"}
          onValueChange={onValueChange}
          value={value}
        />
      ) : (
        <MaterialIcons name="chevron-right" size={24} color={COLORS.textSecondary} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security & Privacy</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionHeader}>Security</Text>
        <SecurityItem
          icon="lock"
          title="Change Password"
          subtitle="Update your login credentials"
          onPress={() => setPasswordModalVisible(true)}
        />
        {biometricAvailable && (
          <SecurityItem
            icon="fingerprint"
            title={`Enable ${biometricType}`}
            subtitle={`Log in using ${biometricType}`}
            isSwitch
            value={biometricEnabled}
            onValueChange={handleBiometricToggle}
          />
        )}
        <SecurityItem
          icon="phonelink-lock"
          title="Two-Factor Authentication"
          subtitle="Add an extra layer of security"
          isSwitch
          value={twoFactorEnabled}
          onValueChange={setTwoFactorEnabled}
        />

        <View style={styles.divider} />

        <Text style={styles.sectionHeader}>Privacy</Text>
        <SecurityItem
          icon="visibility-off"
          title="Data Sharing"
          subtitle="Allow anonymous usage data"
          isSwitch
          value={dataSharingEnabled}
          onValueChange={setDataSharingEnabled}
        />
        <SecurityItem
          icon="download"
          title="Download My Data"
          subtitle="Get a copy of your farm data"
          onPress={() => Alert.alert('Request Sent', 'We will email you a link to download your data shortly.')}
        />
        <SecurityItem
          icon="delete-forever"
          title="Delete Account"
          subtitle="Permanently remove your data"
          onPress={handleDeleteAccount}
          danger
        />
      </ScrollView>

      {/* Change Password Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={passwordModalVisible}
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <TouchableOpacity onPress={() => setPasswordModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Current Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Enter current password"
            />

            <Text style={styles.inputLabel}>New Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Enter new password"
            />

            <Text style={styles.inputLabel}>Confirm New Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleChangePassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Update Password</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: wp(4), paddingVertical: hp(2), backgroundColor: COLORS.surface,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: COLORS.textPrimary },
  content: { padding: wp(4) },
  sectionHeader: { fontSize: 14, fontWeight: '600', color: COLORS.primary, marginBottom: hp(2), marginTop: hp(1) },
  itemContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface,
    padding: wp(4), borderRadius: wp(3), marginBottom: hp(1.5),
    shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width: 0, height: 1 }, elevation: 1
  },
  iconContainer: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary + '1A', // 10% opacity
    justifyContent: 'center', alignItems: 'center', marginRight: wp(3)
  },
  itemTitle: { fontSize: 16, fontWeight: '500', color: COLORS.textPrimary },
  itemSubtitle: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: hp(2) },

  // Modal Styles
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: COLORS.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: wp(5), paddingBottom: hp(5)
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp(3)
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
  inputLabel: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 8, fontWeight: '500' },
  input: {
    backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 12, padding: 16, fontSize: 16, marginBottom: hp(2), color: COLORS.textPrimary
  },
  saveButton: {
    backgroundColor: COLORS.primary, borderRadius: 12, height: 56,
    justifyContent: 'center', alignItems: 'center', marginTop: hp(1),
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' }
});