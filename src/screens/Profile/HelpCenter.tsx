import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { ProfileStackParamList } from '../../navigation/ProfileNavigator';
import { COLORS, hp, wp } from 'components/utils';

type Props = StackScreenProps<ProfileStackParamList, 'HelpCenter'>;

export default function HelpCenterScreen({ navigation }: Props) {

  const FAQItem = ({ question }: { question: string }) => (
    <TouchableOpacity style={styles.faqItem}>
      <Text style={styles.faqText}>{question}</Text>
      <MaterialIcons name="add" size={20} color={COLORS.primary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={24} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for issues..."
            placeholderTextColor={COLORS.textSecondary}
          />
        </View>

        {/* Support Card */}
        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>Need more help?</Text>
          <Text style={styles.contactSubtitle}>Our support team is available 24/7</Text>
          <TouchableOpacity style={styles.chatButton}>
            <MaterialIcons name="chat" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.chatButtonText}>Chat with Support</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionHeader}>Frequently Asked Questions</Text>
        <FAQItem question="How do I add a new farm zone?" />
        <FAQItem question="Why are my weather alerts delayed?" />
        <FAQItem question="How do I export my harvest data?" />
        <FAQItem question="Can I change my subscription plan?" />
        <FAQItem question="App crashes when taking photos" />
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
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface,
    paddingHorizontal: wp(4), paddingVertical: hp(1.5), borderRadius: wp(2),
    marginBottom: hp(3), borderWidth: 1, borderColor: COLORS.border
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: COLORS.textPrimary },
  contactCard: {
    backgroundColor: COLORS.secondary + '1A', // Light blue bg
    padding: wp(5), borderRadius: wp(3), marginBottom: hp(3), alignItems: 'center'
  },
  contactTitle: { fontSize: 18, fontWeight: '700', color: COLORS.secondary, marginBottom: 4 },
  contactSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginBottom: hp(2) },
  chatButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.secondary,
    paddingHorizontal: wp(6), paddingVertical: hp(1.5), borderRadius: wp(10)
  },
  chatButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  sectionHeader: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary, marginBottom: hp(2) },
  faqItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: COLORS.surface, padding: wp(4), borderRadius: wp(2), marginBottom: hp(1.5),
    borderWidth: 1, borderColor: COLORS.border
  },
  faqText: { fontSize: 14, color: COLORS.textPrimary, flex: 1 }
});