import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, hp, wp } from "components/utils";
import { FarmSummaryCardWidget, QuickActionMenuWidget, WeatherCardWidget } from "components/weatherDetail";
import { BottomNavBar } from "components/BottomNavBar";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useState } from "react";
import { Alert, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView, RefreshControl, ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";



// --- MAIN SCREEN ---
export default function FarmDashboardInitialPage() {
  const [refreshing, setRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);

  // State for data (to allow toggling)
  const [farmData, setFarmData] = useState([
    {
      id: 1,
      title: "Active Crops",
      icon: "eco",
      value: "5 Crops",
      statusColor: "#4CAF50",
      subtitle: "Maize - Flowering Stage",
      details: "Growth stage: 65% complete",
      actionLabel: "View Details",
    },
    {
      id: 2,
      title: "Irrigation System",
      icon: "water-drop",
      value: "Active",
      statusColor: "#2196F3",
      subtitle: "Zone 1 & 2 Running",
      details: "Next cycle: 6:00 AM tomorrow",
      actionLabel: "Control",
      hasToggle: true,
      toggleValue: true,
    },
    {
      id: 3,
      title: "Pending Tasks",
      icon: "assignment",
      value: "8 Tasks",
      statusColor: "#FFC107",
      subtitle: "3 High Priority",
      details: "Fertilizer application due today",
      actionLabel: "View Tasks",
      hasBadge: true,
      badgeCount: 3,
    },
    {
      id: 4,
      title: "AI Recommendations",
      icon: "lightbulb",
      value: "4 New",
      statusColor: "#9C27B0",
      subtitle: "Pest Control Advisory",
      details: "Apply neem oil spray this week",
      actionLabel: "View All",
    },
  ]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLastSyncTime(new Date());
    setRefreshing(false);
  }, []);

  const getTimeAgo = (date: Date) => {
    const diff = (new Date().getTime() - date.getTime()) / 1000 / 60; // minutes
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${Math.floor(diff)}m ago`;
    return 'Recently';
  };

  const toggleSwitch = (id: number, newValue: boolean) => {
    setFarmData(prev =>
      prev.map(item => item.id === id ? { ...item, toggleValue: newValue } : item)
    );
  };

  const handleLongPress = (item: any) => {
    Alert.alert(
      "Options",
      `Manage ${item.title}`,
      [
        { text: "Share with Extension Officer", onPress: () => console.log("Share") },
        { text: "Export Data", onPress: () => console.log("Export") },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, width: '100%' }}>
      <SafeAreaView style={styles.container}>
        {/* <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" /> */}
        <StatusBar backgroundColor={COLORS.primary} />

        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.headerTitle}>FarmTech Osun</Text>
            <Text style={styles.headerSubtitle}>Last synced: {getTimeAgo(lastSyncTime)}</Text>
          </View>
          <View style={styles.headerIcons}>
            <MaterialIcons name="gps-fixed" size={20} color={COLORS.onPrimary} style={{ marginRight: 15 }} />
            <MaterialIcons name="wifi" size={20} color={COLORS.onPrimary} />
          </View>
        </View>

        {/* Scrollable Body */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
          }
        >
          <WeatherCardWidget />

          <Text style={styles.sectionTitle}>Farm Overview</Text>

          {farmData.map((item) => (
            <FarmSummaryCardWidget
              key={item.id}
              data={item}
              onTap={() => console.log(`Tapped ${item.title}`)}
              onLongPress={() => handleLongPress(item)}
              onToggleChanged={item.hasToggle ? (val: boolean) => toggleSwitch(item.id, val) : null}
            />
          ))}

          <View style={{ height: hp(10) }} />
        </ScrollView>

        {/* Floating Action Button (Alternative to Quick Menu logic for demo) or Menu Trigger */}
        {/* Floating Action Button (Alternative to Quick Menu logic for demo) or Menu Trigger */}
        <BottomNavBar onFabPress={() => setModalVisible(true)} />

        {/* Quick Actions Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <TouchableOpacity activeOpacity={1} onPress={() => { }}>
              <QuickActionMenuWidget onClose={() => setModalVisible(false)} />
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    // backgroundColor: 'blue',
    width: '100%',
    height: '100%',
  },
  // Header
  headerContainer: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: wp(4),
    paddingBottom: hp(2),
    paddingTop: Platform.OS === 'android' ? hp(2) : 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  headerTitle: {
    color: COLORS.onPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 4,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  // Scroll
  scrollContent: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: hp(2),
    marginBottom: hp(1),
  },
  // Weather Card
  weatherCard: {
    borderRadius: wp(4),
    padding: wp(4),
    width: '100%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  weatherLocation: {
    color: COLORS.onPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  weatherDate: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 4,
  },
  weatherBody: {
    marginTop: hp(2),
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  weatherTemp: {
    color: COLORS.onPrimary,
    fontSize: 64,
    fontWeight: '300',
    lineHeight: 70, // Adjust for font rendering
  },
  weatherInfoContainer: {
    marginLeft: wp(4),
    marginTop: hp(1),
  },
  weatherCondition: {
    color: COLORS.onPrimary,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: hp(1),
  },
  weatherRow: {
    flexDirection: 'row',
  },
  weatherDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherDetailText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    marginLeft: 4,
  },
  weatherFooter: {
    marginTop: hp(2),
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: wp(2),
    padding: wp(2),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  verticalDivider: {
    width: 1,
    height: hp(4),
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  weatherDetailItem: {
    alignItems: 'center',
  },
  weatherDetailValue: {
    color: COLORS.onPrimary,
    fontWeight: '600',
    fontSize: 14,
    marginTop: 4,
  },
  weatherDetailLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
  },


  // Bottom Sheet
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheetContainer: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: wp(4),
    borderTopRightRadius: wp(4),
    padding: wp(4),
    paddingBottom: hp(5),
  },
  bottomSheetHandle: {
    width: wp(12),
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: hp(2),
  },
  bottomSheetTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: hp(2),
    textAlign: 'center',
  },
  actionTile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(3),
    marginBottom: hp(2),
    borderRadius: wp(2),
    borderWidth: 1,
  },
  actionIconBox: {
    padding: wp(2),
    borderRadius: wp(2),
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  actionSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },

});