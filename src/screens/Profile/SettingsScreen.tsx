import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { ProfileStackParamList } from '../../navigation/ProfileNavigator';
import { COLORS, hp, wp } from 'components/utils';

type Props = StackScreenProps<ProfileStackParamList, 'SecurityPrivacy'>;

export default function SecurityPrivacyScreen({ navigation }: Props) {

  const SecurityItem = ({ icon, title, subtitle, onPress }: any) => (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
      <View style={styles.iconContainer}>
        <MaterialIcons name={icon} size={24} color={COLORS.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemSubtitle}>{subtitle}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
          onPress={() => console.log('Change Password')}
        />
        <SecurityItem
          icon="fingerprint"
          title="Biometric Login"
          subtitle="Enable FaceID or Fingerprint"
          onPress={() => console.log('Biometric')}
        />
        <SecurityItem
          icon="phonelink-lock"
          title="Two-Factor Authentication"
          subtitle="Add an extra layer of security"
          onPress={() => console.log('2FA')}
        />

        <View style={styles.divider} />

        <Text style={styles.sectionHeader}>Privacy</Text>
        <SecurityItem
          icon="visibility-off"
          title="Data Sharing"
          subtitle="Manage how your farm data is shared"
          onPress={() => console.log('Data Sharing')}
        />
        <SecurityItem
          icon="history"
          title="Activity Log"
          subtitle="View recent account activity"
          onPress={() => console.log('Activity Log')}
        />
        <SecurityItem
          icon="delete-forever"
          title="Delete Account"
          subtitle="Permanently remove your data"
          onPress={() => console.log('Delete Account')}
        />
      </ScrollView>
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
    width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary + '1A',
    justifyContent: 'center', alignItems: 'center', marginRight: wp(3)
  },
  itemTitle: { fontSize: 16, fontWeight: '500', color: COLORS.textPrimary },
  itemSubtitle: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: hp(2) }
});