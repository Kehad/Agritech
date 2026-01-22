import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS, hp, wp } from 'components/utils';
import { useNavigation } from '@react-navigation/native';

const AIRecommendationsScreen = () => {
    const navigation = useNavigation();

    // Recommendation State
    const [recommendations, setRecommendations] = useState([
        {
            id: 1,
            type: 'urgent',
            title: 'Pest Alert: Fall Armyworm',
            description: 'Early signs detected in Zone A. Immediate application of Neem Oil or registered pesticide recommended.',
            action: 'View Treatment',
            icon: 'bug',
            color: COLORS.error
        },
        {
            id: 2,
            type: 'warning',
            title: 'Irrigation Adjustment',
            description: 'Soil moisture is high in Zone B. Skip scheduled watering for tomorrow to prevent root rot.',
            action: 'Adjust Schedule',
            icon: 'water',
            color: '#2196F3' // Blue
        },
        {
            id: 3,
            type: 'info',
            title: 'Market Opportunity',
            description: 'Cassava prices are trending up (+15%). Consider harvesting mature tubers next week.',
            action: 'Check Prices',
            icon: 'chart-line',
            color: COLORS.success
        },
        {
            id: 4,
            type: 'info',
            title: 'Fertilizer Application',
            description: 'Optimal time for NPK application in Zone C is within the next 48 hours relative to rain forecast.',
            action: 'Set Reminder',
            icon: 'seedling',
            color: '#FFC107' // Amber
        }
    ]);

    const handleAction = (item: any) => {
        Alert.alert(
            item.title,
            `Do you want to proceed with "${item.action}"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Proceed",
                    onPress: () => {
                        // Simulate action completion
                        Alert.alert("Success", "Action initiated successfully!");
                        // Optional: Remove item if it's a one-time task
                        if (item.type === 'urgent' || item.type === 'warning') {
                            setRecommendations(prev => prev.filter(r => r.id !== item.id));
                        }
                    }
                }
            ]
        );
    };

    const RecommendationCard = ({ item }: any) => (
        <View style={[styles.card, { borderLeftColor: item.color }]}>
            <View style={styles.cardHeader}>
                <View style={[styles.iconBox, { backgroundColor: item.color + '20' }]}>
                    <FontAwesome5 name={item.icon} size={18} color={item.color} />
                </View>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={[styles.cardType, { color: item.color }]}>{item.type.toUpperCase()}</Text>
                </View>
            </View>
            <Text style={styles.cardDesc}>{item.description}</Text>
            <TouchableOpacity
                style={[styles.actionBtn, { borderColor: item.color }]}
                onPress={() => handleAction(item)}
            >
                <Text style={[styles.actionText, { color: item.color }]}>{item.action}</Text>
                <MaterialIcons name="arrow-forward" size={16} color={item.color} />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>AI Recommendations</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.banner}>
                    <MaterialIcons name="auto-awesome" size={32} color="#fff" />
                    <View style={{ marginLeft: wp(3), flex: 1 }}>
                        <Text style={styles.bannerTitle}>Smart Insights</Text>
                        <Text style={styles.bannerText}> tailored for your farm's success.</Text>
                    </View>
                </View>

                {recommendations.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <MaterialIcons name="check-circle" size={64} color={COLORS.success} />
                        <Text style={styles.emptyText}>All caught up! No new recommendations.</Text>
                    </View>
                ) : (
                    recommendations.map(item => (
                        <RecommendationCard key={item.id} item={item} />
                    ))
                )}
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
    banner: {
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#673AB7', // Deep Purple
        padding: wp(4), borderRadius: wp(3), marginBottom: hp(3),
        shadowColor: "#673AB7", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5
    },
    bannerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
    bannerText: { fontSize: 14, color: 'rgba(255,255,255,0.9)' },
    card: {
        backgroundColor: COLORS.surface, borderRadius: wp(3), padding: wp(4), marginBottom: hp(2),
        borderLeftWidth: 4, elevation: 2, shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2,
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: hp(1.5) },
    iconBox: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
    headerTextContainer: { marginLeft: wp(3), flex: 1 },
    cardTitle: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary },
    cardType: { fontSize: 10, fontWeight: '700', marginTop: 2 },
    cardDesc: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20, marginBottom: hp(2) },
    actionBtn: {
        flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start',
        borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    },
    actionText: { fontSize: 12, fontWeight: '600', marginRight: 4 },
    emptyContainer: { alignItems: 'center', marginTop: hp(5) },
    emptyText: { marginTop: 10, fontSize: 16, color: COLORS.textSecondary },
});

export default AIRecommendationsScreen;
