import { MaterialIcons } from "@expo/vector-icons";
import { COLORS, hp, wp } from "components/utils";
import { FarmSummaryCardWidget, WeatherCardWidget } from "components/weatherDetail";
import React, { JSX, useCallback, useState } from "react";
import { Alert, StyleSheet, Text, View, RefreshControl, Platform } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { DashboardStackParamList } from "../../navigation/DashboardNavigator";

interface FarmDataItem {
    id: number;
    title: string;
    icon: string;
    value: string;
    statusColor: string;
    subtitle: string;
    details: string;
    actionLabel: string;
    hasToggle?: boolean;
    toggleValue?: boolean;
    hasBadge?: boolean;
    badgeCount?: number;
    screen?: keyof DashboardStackParamList;
}

export default function DashboardScreen(): JSX.Element {
    const navigation = useNavigation<StackNavigationProp<DashboardStackParamList>>();
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());

    const [farmData, setFarmData] = useState<FarmDataItem[]>([
        {
            id: 1,
            title: "Active Crops",
            icon: "eco",
            value: "5 Crops",
            statusColor: "#4CAF50",
            subtitle: "Maize - Flowering Stage",
            details: "Growth stage: 65% complete",
            actionLabel: "View Details",
            screen: "ActiveCrops",
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
            screen: "Irrigation",
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
            screen: "Tasks",
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
            screen: "AIRecommendations",
        },
    ]);

    const onRefresh = useCallback(async (): Promise<void> => {
        setRefreshing(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setLastSyncTime(new Date());
        setRefreshing(false);
    }, []);

    const getTimeAgo = (date: Date): string => {
        const diff = (new Date().getTime() - date.getTime()) / 1000 / 60; // minutes
        if (diff < 1) return 'Just now';
        if (diff < 60) return `${Math.floor(diff)}m ago`;
        return 'Recently';
    };

    const toggleSwitch = (id: number, newValue: boolean): void => {
        setFarmData(prev =>
            prev.map(item => item.id === id ? { ...item, toggleValue: newValue } : item)
        );
    };

    const handleLongPress = (item: FarmDataItem): void => {
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

    const handleItemPress = (item: FarmDataItem) => {
        if (item.screen) {
            navigation.navigate(item.screen as any);
        } else {
            console.log(`Tapped ${item.title}`);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
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
                        onTap={() => handleItemPress(item)}
                        onLongPress={() => handleLongPress(item)}
                        onToggleChanged={item.hasToggle ? (val: boolean) => toggleSwitch(item.id, val) : null}
                        navigateTo={item.screen}
                    />
                ))}

                <View style={{ height: hp(10) }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
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
});
