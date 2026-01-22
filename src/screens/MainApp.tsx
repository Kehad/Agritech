import { COLORS, hp, wp } from "components/utils";
import { QuickActionMenuWidget } from "components/weatherDetail";
import { BottomNavBar, TabType } from "components/BottomNavBar";
import ProfileNavigator from "../navigation/ProfileNavigator";
import AnalyticsScreen from "./Analytics/AnalyticsScreen";
import ChatScreen from "./Chat/ChatScreen";
import DashboardScreen from "./Dashboard/DashboardScreen";
import { StatusBar } from "expo-status-bar";
import React, { JSX, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

// --- MAIN SCREEN ---
export default function FarmDashboardInitialPage(): JSX.Element {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  return (
    <GestureHandlerRootView style={{ flex: 1, width: '100%' }}>
      {/* Container without SafeAreaView for content, as screens manage their own safe area */}
      <View style={styles.container}>
        <StatusBar backgroundColor={COLORS.primary} />

        {/* Main Content Area */}
        {activeTab === 'dashboard' ? (
          <DashboardScreen />
        ) : activeTab === 'analytics' ? (
          <AnalyticsScreen />
        ) : activeTab === 'chat' ? (
          <ChatScreen />
        ) : activeTab === 'profile' ? (
          <ProfileNavigator />
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: COLORS.textSecondary }}>Feature coming soon</Text>
          </View>
        )}


        {/* Floating Action Button (Alternative to Quick Menu logic for demo) or Menu Trigger */}
        <BottomNavBar
          activeTab={activeTab}
          onTabPress={setActiveTab}
          onFabPress={() => setModalVisible(true)}
        />

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

      </View>
    </GestureHandlerRootView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    width: '100%',
    height: '100%',
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