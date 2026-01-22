import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, hp, wp } from 'components/utils';

const SCREEN_WIDTH = Dimensions.get('window').width;

const AnalyticsScreen = () => {
    const [period, setPeriod] = useState<'Week' | 'Month' | 'Year'>('Week');

    const analyticsData = {
        Week: {
            chart: [
                { label: 'Mon', height: 40 },
                { label: 'Tue', height: 60 },
                { label: 'Wed', height: 35 },
                { label: 'Thu', height: 80, active: true },
                { label: 'Fri', height: 55 },
                { label: 'Sat', height: 45 },
                { label: 'Sun', height: 30 },
            ],
            stats: [
                { label: "Total Revenue", value: "₦ 4.2M", trend: "+12%", icon: "attach-money", color: COLORS.primary },
                { label: "Expenses", value: "₦ 1.1M", trend: "-5%", icon: "trending-down", color: COLORS.error },
                { label: "Crop Health", value: "94%", trend: "+2%", icon: "local-florist", color: COLORS.success },
                { label: "Water Usage", value: "2.4k L", trend: "+8%", icon: "water-drop", color: COLORS.secondary },
            ],
            insights: [
                { title: "Optimize Irrigation", text: "Based on soil moisture levels, reducing water usage by 10% in Zone A will not affect yield.", icon: "lightbulb", iconColor: "#FFC107" },
                { title: "Market Opportunity", text: "Maize prices in Lagos markets have risen 15%. Consider harvesting early next week.", icon: "trending-up", iconColor: COLORS.primary },
            ]
        },
        Month: {
            chart: [
                { label: 'Wk1', height: 50 },
                { label: 'Wk2', height: 75, active: true },
                { label: 'Wk3', height: 60 },
                { label: 'Wk4', height: 90 },
            ],
            stats: [
                { label: "Total Revenue", value: "₦ 18.5M", trend: "+8%", icon: "attach-money", color: COLORS.primary },
                { label: "Expenses", value: "₦ 5.2M", trend: "-2%", icon: "trending-down", color: COLORS.error },
                { label: "Crop Health", value: "92%", trend: "0%", icon: "local-florist", color: COLORS.success },
                { label: "Water Usage", value: "11.5k L", trend: "-5%", icon: "water-drop", color: COLORS.secondary },
            ],
            insights: [
                { title: "Fertilizer Schedule", text: "Upcoming rain predicted for next week. Apply fertilizer within 3 days for maximum absorption.", icon: "event", iconColor: "#FF9800" },
                { title: "Pest Alert", text: "Regional reports of Fall Armyworm. Inspect maize crops immediately.", icon: "warning", iconColor: COLORS.error },
            ]
        },
        Year: {
            chart: [
                { label: 'Q1', height: 45 },
                { label: 'Q2', height: 85 },
                { label: 'Q3', height: 65, active: true },
                { label: 'Q4', height: 70 },
            ],
            stats: [
                { label: "Total Revenue", value: "₦ 245M", trend: "+25%", icon: "attach-money", color: COLORS.primary },
                { label: "Expenses", value: "₦ 85M", trend: "+10%", icon: "trending-down", color: COLORS.error },
                { label: "Crop Health", value: "95%", trend: "+5%", icon: "local-florist", color: COLORS.success },
                { label: "Water Usage", value: "145k L", trend: "-12%", icon: "water-drop", color: COLORS.secondary },
            ],
            insights: [
                { title: "Expansion Plan", text: "Annual yield up 25%. Feasible to expand to 50 more acres next season.", icon: "map", iconColor: COLORS.secondary },
                { title: "Equipment Upgrade", text: "Tractor maintenance costs high. Consider upgrading fleet.", icon: "build", iconColor: COLORS.textSecondary },
            ]
        }
    };

    const togglePeriod = () => {
        setPeriod(current =>
            current === 'Week' ? 'Month' : current === 'Month' ? 'Year' : 'Week'
        );
    };

    const currentData = analyticsData[period];

    const Bar = ({ height, label, active }: { height: number, label: string, active?: boolean }) => (
        <View style={{ alignItems: 'center', marginRight: wp(3) }}>
            <View style={{
                width: wp(8),
                height: hp(20),
                justifyContent: 'flex-end',
                backgroundColor: '#F0F0F0',
                borderRadius: wp(2),
                overflow: 'hidden'
            }}>
                <View style={{
                    width: '100%',
                    height: `${height}%`,
                    backgroundColor: active ? COLORS.primary : COLORS.secondary,
                    borderRadius: wp(2)
                }} />
            </View>
            <Text style={{ marginTop: 8, fontSize: 12, color: COLORS.textSecondary }}>{label}</Text>
        </View>
    );

    const StatCard = ({ label, value, trend, icon, color }: any) => (
        <View style={styles.statCard}>
            <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
                <MaterialIcons name={icon} size={24} color={color} />
            </View>
            <View>
                <Text style={styles.statLabel}>{label}</Text>
                <Text style={styles.statValue}>{value}</Text>
                <Text style={[styles.statTrend, { color: trend.startsWith('+') ? COLORS.success : COLORS.error }]}>
                    {trend} vs last {period.toLowerCase()}
                </Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Farm Analytics</Text>
                <TouchableOpacity style={styles.filterBtn} onPress={togglePeriod}>
                    <Text style={styles.filterText}>{period}</Text>
                    <MaterialIcons name="keyboard-arrow-down" size={20} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Chart Section */}
                <View style={styles.chartContainer}>
                    <View style={styles.chartHeader}>
                        <Text style={styles.sectionTitle}>Harvest Yield</Text>
                        <TouchableOpacity>
                            <MaterialIcons name="more-horiz" size={24} color={COLORS.textSecondary} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: hp(2) }}>
                        {currentData.chart.map((item, index) => (
                            <Bar key={index} height={item.height} label={item.label} active={item.active} />
                        ))}
                    </ScrollView>
                </View>

                {/* Key Metrics */}
                <View style={styles.statsGrid}>
                    {currentData.stats.map((stat, index) => (
                        <StatCard
                            key={index}
                            {...stat}
                        />
                    ))}
                </View>

                {/* Insights */}
                <Text style={styles.sectionTitle}>AI Insights</Text>
                {currentData.insights.map((insight, index) => (
                    <View key={index} style={styles.insightCard}>
                        <MaterialIcons name={insight.icon as any} size={24} color={insight.iconColor} style={{ marginRight: wp(3) }} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.insightTitle}>{insight.title}</Text>
                            <Text style={styles.insightText}>{insight.text}</Text>
                        </View>
                    </View>
                ))}

                <View style={{ height: hp(10) }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp(4),
        paddingVertical: hp(2),
        backgroundColor: COLORS.surface,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    filterBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary + '15',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    filterText: {
        color: COLORS.primary,
        fontWeight: '600',
        marginRight: 4,
    },
    content: {
        padding: wp(4),
    },
    chartContainer: {
        backgroundColor: COLORS.surface,
        borderRadius: wp(4),
        padding: wp(4),
        marginBottom: hp(3),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: hp(2),
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: hp(3),
    },
    statCard: {
        width: '48%',
        backgroundColor: COLORS.surface,
        borderRadius: wp(3),
        padding: wp(3),
        marginBottom: hp(2),
        elevation: 2,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: hp(1.5),
    },
    statLabel: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    statTrend: {
        fontSize: 12,
        fontWeight: '500',
    },
    insightCard: {
        flexDirection: 'row',
        backgroundColor: COLORS.surface,
        padding: wp(4),
        borderRadius: wp(3),
        marginBottom: hp(1.5),
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
        elevation: 1,
    },
    insightTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    insightText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        lineHeight: 20,
    }
});

export default AnalyticsScreen;
