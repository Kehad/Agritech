import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS, hp, wp } from 'components/utils';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const InsightDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { insight } = route.params as any || {
        insight: {
            title: "Optimize Irrigation",
            text: "Based on soil moisture levels, reducing water usage by 10% in Zone A will not affect yield.",
            icon: "lightbulb",
            color: "#FFC107",
            bg: "#FFF8E1",
            fullDetails: "Our soil sensors in Zone A have detected consistently high moisture levels retention over the last 7 days. Providing the standard irrigation volume is currently leading to runoff and potential root stress.\n\nReducing water flow by 10% will maintain optimal field capacity while saving approximately 2,400 Liters of water this week.",
            impact: "High",
            savings: "₦15,000 / week"
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header Image/Banner */}
                <View style={styles.headerBanner}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <MaterialIcons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <LinearGradient
                        colors={[insight.color || COLORS.primary, '#000000']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.bannerGradient}
                    >
                        <FontAwesome5 name={insight.icon} size={60} color="rgba(255,255,255,0.3)" style={styles.bgIcon} />
                        <View style={styles.iconCircle}>
                            <MaterialIcons name={insight.icon} size={40} color={insight.color} />
                        </View>
                        <Text style={styles.bannerTitle}>{insight.title}</Text>
                        <View style={styles.badgeContainer}>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>AI CONFIG: 98%</Text>
                            </View>
                            <View style={[styles.badge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                                <Text style={styles.badgeText}>IMPACT: {insight.impact || 'MEDIUM'}</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                {/* Content Body */}
                <View style={styles.contentContainer}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Observation</Text>
                        <Text style={styles.description}>
                            {insight.fullDetails || insight.text || "No details available."}
                        </Text>
                    </View>

                    {/* Stats Row */}
                    <View style={styles.statsRow}>
                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>Potential Savings</Text>
                            <Text style={[styles.statValue, { color: COLORS.success }]}>{insight.savings || "N/A"}</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statLabel}>Confidence</Text>
                            <Text style={styles.statValue}>98%</Text>
                        </View>
                    </View>

                    {/* Recommended Action */}
                    <View style={styles.actionCard}>
                        <View style={styles.actionHeader}>
                            <MaterialIcons name="bolt" size={24} color={COLORS.primary} />
                            <Text style={styles.actionTitle}>Recommended Action</Text>
                        </View>
                        <Text style={styles.actionText}>
                            Adjust the irrigation controller for Zone A. Reduce flow rate from 45 L/min to 40 L/min for the next 3 scheduled cycles.
                        </Text>
                        <TouchableOpacity style={styles.applyButton} onPress={() => { }}>
                            <LinearGradient
                                colors={[COLORS.primary, COLORS.secondary]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.applyGradient}
                            >
                                <Text style={styles.applyButtonText}>Apply Adjustment Now</Text>
                                <MaterialIcons name="arrow-forward" size={20} color="#fff" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Feedback */}
                    <View style={styles.feedbackSection}>
                        <Text style={styles.feedbackText}>Was this insight helpful?</Text>
                        <View style={styles.feedbackButtons}>
                            <TouchableOpacity style={styles.thumbBtn}>
                                <MaterialIcons name="thumb-up" size={20} color={COLORS.textSecondary} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.thumbBtn}>
                                <MaterialIcons name="thumb-down" size={20} color={COLORS.textSecondary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    headerBanner: {
        height: hp(35),
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 10,
        padding: 8,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
    },
    bannerGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    bgIcon: {
        position: 'absolute',
        bottom: -10,
        right: -10,
        opacity: 0.2,
        transform: [{ rotate: '-15deg' }]
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    bannerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 12,
    },
    badgeContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    badge: {
        backgroundColor: 'rgba(255,255,255,0.25)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    badgeText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 10,
    },
    contentContainer: {
        padding: 24,
        marginTop: -20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: COLORS.textSecondary,
        lineHeight: 24,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        gap: 16,
    },
    statBox: {
        flex: 1,
        backgroundColor: COLORS.surface,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    statLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    actionCard: {
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        elevation: 3,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    actionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginLeft: 8,
    },
    actionText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 20,
        lineHeight: 20,
    },
    applyButton: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    applyGradient: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
    },
    applyButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
        marginRight: 8,
    },
    feedbackSection: {
        alignItems: 'center',
        marginTop: 10,
    },
    feedbackText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 12,
    },
    feedbackButtons: {
        flexDirection: 'row',
        gap: 20,
    },
    thumbBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default InsightDetailScreen;
