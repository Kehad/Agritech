import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS, hp, wp } from 'components/utils';
import { BarChart, LineChart, PieChart } from 'react-native-gifted-charts';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const SCREEN_WIDTH = Dimensions.get('window').width;

const AnalyticsScreen = () => {
    const navigation = useNavigation();
    const [period, setPeriod] = useState<'Week' | 'Month' | 'Year'>('Week');
    const [selectedStat, setSelectedStat] = useState<'Revenue' | 'Yield'>('Revenue');

    // --- Mock Data ---

    const revenueData = {
        Week: [
            { value: 15000, label: 'Mon', dataPointText: '15k' },
            { value: 28000, label: 'Tue', dataPointText: '28k' },
            { value: 12000, label: 'Wed', dataPointText: '12k' },
            { value: 45000, label: 'Thu', dataPointText: '45k' },
            { value: 32000, label: 'Fri', dataPointText: '32k' },
            { value: 18000, label: 'Sat', dataPointText: '18k' },
            { value: 24000, label: 'Sun', dataPointText: '24k' },
        ],
        Month: [
            { value: 120000, label: 'W1', dataPointText: '120k' },
            { value: 180000, label: 'W2', dataPointText: '180k' },
            { value: 150000, label: 'W3', dataPointText: '150k' },
            { value: 210000, label: 'W4', dataPointText: '210k' },
        ],
        Year: [
            { value: 450000, label: 'Q1', dataPointText: '450k' },
            { value: 850000, label: 'Q2', dataPointText: '850k' },
            { value: 650000, label: 'Q3', dataPointText: '650k' },
            { value: 950000, label: 'Q4', dataPointText: '950k' },
        ]
    };

    const yieldData = {
        Week: [
            { value: 40, label: 'Mon', frontColor: COLORS.secondary },
            { value: 60, label: 'Tue', frontColor: COLORS.secondary },
            { value: 35, label: 'Wed', frontColor: COLORS.secondary },
            { value: 80, label: 'Thu', frontColor: COLORS.primary },
            { value: 55, label: 'Fri', frontColor: COLORS.secondary },
            { value: 45, label: 'Sat', frontColor: COLORS.secondary },
            { value: 30, label: 'Sun', frontColor: COLORS.secondary },
        ],
        Month: [
            { value: 200, label: 'W1', frontColor: COLORS.secondary },
            { value: 450, label: 'W2', frontColor: COLORS.primary },
            { value: 300, label: 'W3', frontColor: COLORS.secondary },
            { value: 380, label: 'W4', frontColor: COLORS.secondary },
        ],
        Year: [
            { value: 1200, label: 'Q1', frontColor: COLORS.secondary },
            { value: 2500, label: 'Q2', frontColor: COLORS.primary },
            { value: 1800, label: 'Q3', frontColor: COLORS.secondary },
            { value: 2100, label: 'Q4', frontColor: COLORS.secondary },
        ]
    };

    const expenseData = [
        { value: 40, color: COLORS.primary, text: '40%', labels: 'Seeds' },
        { value: 25, color: COLORS.secondary, text: '25%', labels: 'Labor' },
        { value: 20, color: '#FF9800', text: '20%', labels: 'Fertilizer' },
        { value: 15, color: COLORS.textSecondary, text: '15%', labels: 'Equip' },
    ];

    const stats = [
        { label: "Total Revenue", value: "₦4.2M", trend: "+12%", icon: "wallet", color: COLORS.primary, bg: "#E3F2FD" },
        { label: "Expenses", value: "₦1.1M", trend: "-5%", icon: "trending-down", color: COLORS.error, bg: "#FFEBEE" },
        { label: "Crop Health", value: "94%", trend: "+2%", icon: "leaf", color: COLORS.success, bg: "#E8F5E9" },
        { label: "Water Usage", value: "2.4k L", trend: "+8%", icon: "water", color: COLORS.secondary, bg: "#E1F5FE" },
    ];

    const insights = [
        {
            title: "Optimize Irrigation",
            text: "Based on soil moisture levels, reducing water usage by 10% in Zone A will not affect yield.",
            icon: "lightbulb",
            color: "#FFC107",
            bg: "#FFF8E1",
            fullDetails: "Soil sensors in Zone A indicate consistent moisture retention. Reducing irrigation volume by 10% prevents runoff while maintaining optimal field capacity.",
            impact: "High",
            savings: "₦15,000 / week"
        },
        {
            title: "Market Opportunity",
            text: "Maize prices in Lagos markets have risen 15%. Consider harvesting early next week.",
            icon: "trending-up",
            color: COLORS.primary,
            bg: "#E3F2FD",
            fullDetails: "Current market analysis shows a 15% spike in maize prices due to regional supply shortages. Harvesting 3 days early captures this peak value.",
            impact: "Medium",
            savings: "+15% Revenue"
        },
    ];

    const handleInsightPress = (insight: any) => {
        // Navigate to the Dashboard stack --> InsightDetail screen
        // Depending on navigation structure, might need: navigation.getParent() or simply root 'Dashboard'
        navigation.navigate('Dashboard', {
            screen: 'InsightDetail',
            params: { insight }
        } as any);
    };

    // --- Components ---

    const renderHeader = () => (
        <View style={styles.header}>
            <View>
                <Text style={styles.headerTitle}>Analytics</Text>
                <Text style={styles.headerSubtitle}>Overview of farm performance</Text>
            </View>
            <View style={styles.periodContainer}>
                {['Week', 'Month', 'Year'].map((p) => (
                    <TouchableOpacity
                        key={p}
                        style={[styles.periodBtn, period === p && styles.periodBtnActive]}
                        onPress={() => setPeriod(p as any)}
                    >
                        <Text style={[styles.periodText, period === p && styles.periodTextActive]}>{p}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    const renderChartSection = () => {
        const data = selectedStat === 'Revenue' ? revenueData[period] : yieldData[period];
        const isLine = selectedStat === 'Revenue';

        return (
            <View style={styles.card}>
                <View style={styles.chartHeader}>
                    <Text style={styles.cardTitle}>{selectedStat} Analysis</Text>
                    <View style={styles.chartToggle}>
                        <TouchableOpacity
                            style={[styles.toggleBtn, selectedStat === 'Revenue' && styles.toggleBtnActive]}
                            onPress={() => setSelectedStat('Revenue')}
                        >
                            <Text style={[styles.toggleText, selectedStat === 'Revenue' && styles.toggleTextActive]}>Revenue</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.toggleBtn, selectedStat === 'Yield' && styles.toggleBtnActive]}
                            onPress={() => setSelectedStat('Yield')}
                        >
                            <Text style={[styles.toggleText, selectedStat === 'Yield' && styles.toggleTextActive]}>Yield</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ alignItems: 'center', marginTop: 20 }}>
                    {isLine ? (
                        <LineChart
                            data={data}
                            color={COLORS.primary}
                            thickness={3}
                            dataPointsColor={COLORS.primary}
                            startFillColor={COLORS.primary}
                            endFillColor={COLORS.primary}
                            startOpacity={0.2}
                            endOpacity={0.0}
                            areaChart
                            curved
                            width={SCREEN_WIDTH - wp(16)}
                            height={hp(25)}
                            spacing={wp(10)}
                            initialSpacing={10}
                            yAxisTextStyle={{ color: COLORS.textSecondary, fontSize: 10 }}
                            xAxisLabelTextStyle={{ color: COLORS.textSecondary, fontSize: 10 }}
                            hideRules
                            hideYAxisText={false}
                            yAxisColor="transparent"
                            xAxisColor={COLORS.border}
                            pointerConfig={{
                                pointerStripHeight: 160,
                                pointerStripColor: 'lightgray',
                                pointerStripWidth: 2,
                                pointerColor: 'lightgray',
                                radius: 6,
                                pointerLabelWidth: 100,
                                pointerLabelHeight: 90,
                                activatePointersOnLongPress: true,
                                autoAdjustPointerLabelPosition: false,
                                pointerLabelComponent: (items: any) => {
                                    return (
                                        <View
                                            style={{
                                                height: 90,
                                                width: 100,
                                                justifyContent: 'center',
                                                marginTop: -30,
                                                marginLeft: -40,
                                            }}>
                                            <Text style={{ color: 'white', fontSize: 14, marginBottom: 6, textAlign: 'center' }}>
                                                {items[0].date}
                                            </Text>
                                            <View style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: 'white' }}>
                                                <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
                                                    {'₦' + items[0].value}
                                                </Text>
                                            </View>
                                        </View>
                                    );
                                },
                            }}
                        />
                    ) : (
                        <BarChart
                            data={data}
                            barWidth={24}
                            spacing={24}
                            roundedTop
                            roundedBottom
                            hideRules
                            width={SCREEN_WIDTH - wp(16)}
                            height={hp(25)}
                            yAxisTextStyle={{ color: COLORS.textSecondary, fontSize: 10 }}
                            xAxisLabelTextStyle={{ color: COLORS.textSecondary, fontSize: 10 }}
                            yAxisColor="transparent"
                            xAxisColor={COLORS.border}
                            frontColor={COLORS.primary}
                        />
                    )}
                </View>
            </View>
        );
    };

    const renderStatsGrid = () => (
        <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
                <View key={index} style={styles.statCard}>
                    <View style={[styles.iconBox, { backgroundColor: stat.bg }]}>
                        <MaterialCommunityIcons name={stat.icon as any} size={22} color={stat.color} />
                    </View>
                    <View>
                        <Text style={styles.statLabel}>{stat.label}</Text>
                        <Text style={styles.statValue}>{stat.value}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons
                                name={stat.trend.startsWith('+') ? "trending-up" : "trending-down"}
                                size={14}
                                color={stat.trend.startsWith('+') ? COLORS.success : COLORS.error}
                            />
                            <Text style={[styles.statTrend, { color: stat.trend.startsWith('+') ? COLORS.success : COLORS.error }]}>
                                {stat.trend}
                            </Text>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );

    const renderExpensePie = () => (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Expense Breakdown</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                <PieChart
                    data={expenseData}
                    donut
                    showGradient
                    sectionAutoFocus
                    radius={70}
                    innerRadius={45}
                    innerCircleColor={COLORS.surface}
                    centerLabelComponent={() => {
                        return (
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 18, color: COLORS.textPrimary, fontWeight: 'bold' }}>1.1M</Text>
                                <Text style={{ fontSize: 10, color: COLORS.textSecondary }}>Total</Text>
                            </View>
                        );
                    }}
                />
                <View style={{ flex: 1, paddingLeft: 20 }}>
                    {expenseData.map((item, index) => (
                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                            <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: item.color, marginRight: 8 }} />
                            <Text style={{ color: COLORS.textPrimary, fontSize: 12, flex: 1 }}>{item.labels}</Text>
                            <Text style={{ color: COLORS.textSecondary, fontSize: 12, fontWeight: '600' }}>{item.text}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );

    const renderInsights = () => (
        <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, marginTop: 8 }}>
                <Text style={styles.sectionTitle}>AI Insights</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Dashboard', { screen: 'AIRecommendations' } as any)}>
                    <Text style={{ color: COLORS.primary, fontWeight: '600', fontSize: 13 }}>View All</Text>
                </TouchableOpacity>
            </View>
            {insights.map((insight, index) => (
                <TouchableOpacity
                    key={index}
                    style={[styles.insightCard, { backgroundColor: COLORS.surface }]}
                    onPress={() => handleInsightPress(insight)}
                >
                    <View style={[styles.insightIconBox, { backgroundColor: insight.bg }]}>
                        <MaterialIcons name={insight.icon as any} size={24} color={insight.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.insightTitle}>{insight.title}</Text>
                        <Text style={styles.insightText}>{insight.text}</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
            ))}
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {renderHeader()}
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {renderChartSection()}
                {renderStatsGrid()}
                {renderExpensePie()}
                {renderInsights()}
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
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: COLORS.textPrimary,
    },
    headerSubtitle: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    periodContainer: {
        flexDirection: 'row',
        backgroundColor: '#F5F5F5',
        borderRadius: 20,
        padding: 4,
    },
    periodBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    periodBtnActive: {
        backgroundColor: COLORS.surface,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
        elevation: 2,
    },
    periodText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
    periodTextActive: {
        color: COLORS.primary,
        fontWeight: '700',
    },
    content: {
        padding: wp(4),
    },
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        padding: wp(4),
        marginBottom: hp(2),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    chartToggle: {
        flexDirection: 'row',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 2,
    },
    toggleBtn: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 10,
    },
    toggleBtnActive: {
        backgroundColor: COLORS.primary,
    },
    toggleText: {
        fontSize: 10,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    toggleTextActive: {
        color: '#fff',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: hp(1),
    },
    statCard: {
        width: '48%',
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        padding: 16,
        marginBottom: hp(2),
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    statTrend: {
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 12,
        marginTop: 8,
    },
    insightCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        elevation: 1,
    },
    insightIconBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    insightTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    insightText: {
        fontSize: 13,
        color: COLORS.textSecondary,
        lineHeight: 18,
    }
});

export default AnalyticsScreen;
