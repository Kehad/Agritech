import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, LayoutAnimation, Platform, UIManager, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { ProfileStackParamList } from '../../navigation/ProfileNavigator';
import { COLORS, hp, wp } from 'components/utils';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = StackScreenProps<ProfileStackParamList, 'HelpCenter'>;

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Account' | 'Technical' | 'Billing';
}

const FAQ_DATA: FAQ[] = [
  {
    id: '1',
    question: 'How do I add a new farm zone?',
    answer: 'To add a new zone, navigate to the Dashboard, tap on the "Active Crops" card, and select the "+" icon in the top right corner. Follow the prompts to define your zone details.',
    category: 'General'
  },
  {
    id: '2',
    question: 'Why are my weather alerts delayed?',
    answer: 'Weather alerts rely on local network connectivity. Ensure you have a stable internet connection. You can also check your notification settings in the Profile tab to ensure "High Priority" alerts are enabled.',
    category: 'Technical'
  },
  {
    id: '3',
    question: 'How do I export my harvest data?',
    answer: 'Go to the Analytics tab, select the "Yearly" view, and tap the three dots icon in the top right corner. Select "Export Data" and choose your preferred format (PDF or CSV).',
    category: 'General'
  },
  {
    id: '4',
    question: 'Can I change my subscription plan?',
    answer: 'Yes. Go to Profile > Account Settings > Subscription to view available plans. You can upgrade or downgrade at any time.',
    category: 'Billing'
  },
  {
    id: '5',
    question: 'App crashes when taking photos',
    answer: 'Please ensure you have granted camera permissions to the app. Go to your device Settings > Apps > FarmTech > Permissions and enable Camera access.',
    category: 'Technical'
  },
  {
    id: '6',
    question: 'How do I reset my password?',
    answer: 'On the Sign In screen, tap "Forgot Password?". Enter your registered email address, and we will send you a link to reset your password.',
    category: 'Account'
  }
];

export default function HelpCenterScreen({ navigation }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredFAQs = FAQ_DATA.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', 'General', 'Account', 'Technical', 'Billing'];

  const handleContactSupport = () => {
    Alert.alert(
      "Contact Support",
      "Choose a method to contact us",
      [
        { text: "Call Us", onPress: () => Linking.openURL('tel:+234800FARMTECH') },
        { text: "Email", onPress: () => Linking.openURL('mailto:support@farmtech.osun') },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const FAQItem = ({ item }: { item: FAQ }) => {
    const isExpanded = expandedId === item.id;
    return (
      <View style={styles.faqItemContainer}>
        <TouchableOpacity
          style={[styles.faqHeader, isExpanded && styles.faqHeaderActive]}
          onPress={() => toggleExpand(item.id)}
          activeOpacity={0.7}
        >
          <Text style={[styles.faqQuestion, isExpanded && styles.faqQuestionActive]}>{item.question}</Text>
          <MaterialIcons
            name={isExpanded ? "remove" : "add"}
            size={20}
            color={isExpanded ? COLORS.primary : COLORS.textSecondary}
          />
        </TouchableOpacity>
        {isExpanded && (
          <View style={styles.faqAnswerContainer}>
            <Text style={styles.faqAnswer}>{item.answer}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchSection}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={24} color={COLORS.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for issues..."
            placeholderTextColor={COLORS.textSecondary}
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialIcons name="close" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryPill, selectedCategory === cat && styles.categoryPillActive]}
              onPress={() => {
                setSelectedCategory(cat);
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              }}
            >
              <Text style={[styles.categoryText, selectedCategory === cat && styles.categoryTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Support Card */}
        {searchQuery.length === 0 && selectedCategory === 'All' && (
          <View style={styles.contactCard}>
            <View style={styles.contactIconBg}>
              <MaterialIcons name="support-agent" size={32} color={COLORS.secondary} />
            </View>
            <Text style={styles.contactTitle}>Need more help?</Text>
            <Text style={styles.contactSubtitle}>Our support team is available 24/7 to assist you with any issues.</Text>
            <TouchableOpacity style={styles.chatButton} onPress={handleContactSupport}>
              <MaterialIcons name="chat" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.chatButtonText}>Chat with Support</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.sectionHeader}>
          {searchQuery ? `Results` : `Frequently Asked Questions`}
        </Text>

        {filteredFAQs.map((faq) => (
          <FAQItem key={faq.id} item={faq} />
        ))}

        {filteredFAQs.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons name="search-off" size={48} color={COLORS.border} />
            <Text style={styles.emptyStateText}>No results found</Text>
          </View>
        )}

        <View style={{ height: hp(5) }} />
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

  searchSection: {
    backgroundColor: COLORS.surface,
    paddingBottom: hp(2),
    shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, elevation: 2,
    zIndex: 1
  },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background,
    paddingHorizontal: wp(4), paddingVertical: Platform.OS === 'ios' ? 12 : 8, borderRadius: wp(3),
    marginHorizontal: wp(4), marginTop: hp(2), marginBottom: hp(2),
    borderWidth: 1, borderColor: COLORS.border
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: COLORS.textPrimary },

  categoryScroll: { paddingHorizontal: wp(4) },
  categoryPill: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border,
    marginRight: 8,
  },
  categoryPillActive: {
    backgroundColor: COLORS.primary, borderColor: COLORS.primary
  },
  categoryText: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '500' },
  categoryTextActive: { color: '#fff' },

  content: { padding: wp(4) },

  contactCard: {
    backgroundColor: '#E3F2FD', // Very light blue
    padding: wp(5), borderRadius: wp(4), marginBottom: hp(3), alignItems: 'center',
    borderWidth: 1, borderColor: '#BBDEFB'
  },
  contactIconBg: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center', marginBottom: hp(1.5)
  },
  contactTitle: { fontSize: 18, fontWeight: '700', color: COLORS.secondary, marginBottom: 4 },
  contactSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginBottom: hp(2), textAlign: 'center', lineHeight: 20 },
  chatButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.secondary,
    paddingHorizontal: wp(6), paddingVertical: hp(1.5), borderRadius: wp(10),
    shadowColor: COLORS.secondary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4
  },
  chatButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },

  sectionHeader: { fontSize: 16, fontWeight: '600', color: COLORS.textPrimary, marginBottom: hp(2) },

  faqItemContainer: {
    backgroundColor: COLORS.surface, borderRadius: wp(3), marginBottom: hp(1.5),
    borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden'
  },
  faqHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: wp(4), backgroundColor: COLORS.surface
  },
  faqHeaderActive: {
    backgroundColor: COLORS.surface // Could add slight highlight if needed
  },
  faqQuestion: { fontSize: 15, color: COLORS.textPrimary, fontWeight: '500', flex: 1, paddingRight: 16 },
  faqQuestionActive: { color: COLORS.primary, fontWeight: '600' },

  faqAnswerContainer: {
    paddingHorizontal: wp(4), paddingBottom: wp(4), paddingTop: 0,
    backgroundColor: COLORS.surface
  },
  faqAnswer: {
    fontSize: 14, color: COLORS.textSecondary, lineHeight: 22
  },

  emptyState: { alignItems: 'center', marginTop: hp(5) },
  emptyStateText: { marginTop: 16, fontSize: 16, color: COLORS.textSecondary }
});