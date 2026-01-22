import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { ProfileStackParamList } from '../../navigation/ProfileNavigator';
import { COLORS, hp, wp } from 'components/utils';

type Props = StackScreenProps<ProfileStackParamList, 'Notifications'>;

export default function NotificationsScreen({ navigation }: Props) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [marketUpdates, setMarketUpdates] = useState(false);
  const [taskReminders, setTaskReminders] = useState(true);

  const NotificationItem = ({ label, subLabel, value, onValueChange }: any) => (
    <View style={styles.itemContainer}>
      <View style={{ flex: 1, paddingRight: 16 }}>
        <Text style={styles.itemLabel}>{label}</Text>
        {subLabel && <Text style={styles.itemSubLabel}>{subLabel}</Text>}
      </View>
      <Switch
        trackColor={{ false: "#767577", true: COLORS.primary }}
        thumbColor={value ? "#fff" : "#f4f3f4"}
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionHeader}>General</Text>
        <NotificationItem
          label="Push Notifications"
          subLabel="Receive alerts on your device"
          value={pushEnabled}
          onValueChange={setPushEnabled}
        />
        <NotificationItem
          label="Email Notifications"
          subLabel="Receive summaries and reports via email"
          value={emailEnabled}
          onValueChange={setEmailEnabled}
        />

        <View style={styles.divider} />

        <Text style={styles.sectionHeader}>Alert Types</Text>
        <NotificationItem
          label="Weather Alerts"
          subLabel="Severe weather warnings and forecasts"
          value={weatherAlerts}
          onValueChange={setWeatherAlerts}
        />
        <NotificationItem
          label="Market Prices"
          subLabel="Daily updates on crop prices"
          value={marketUpdates}
          onValueChange={setMarketUpdates}
        />
        <NotificationItem
          label="Task Reminders"
          subLabel="Deadlines for planting and harvesting"
          value={taskReminders}
          onValueChange={setTaskReminders}
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
  sectionHeader: {
    fontSize: 14, fontWeight: '600', color: COLORS.primary,
    marginBottom: hp(2), marginTop: hp(1), textTransform: 'uppercase'
  },
  itemContainer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.surface, padding: wp(4), borderRadius: wp(2), marginBottom: hp(1.5),
    shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width: 0, height: 1 }, shadowRadius: 2, elevation: 1
  },
  itemLabel: { fontSize: 16, color: COLORS.textPrimary, fontWeight: '500' },
  itemSubLabel: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: hp(2) }
});