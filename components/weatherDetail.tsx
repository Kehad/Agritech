// --- SUB-COMPONENTS ---

import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { COLORS, wp, hp } from "./utils";
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Swipeable } from "react-native-gesture-handler";

// 1. Custom Icon Widget
const CustomIconWidget = ({ iconName, color, size = 24 }: { iconName: any; color: string; size?: number }) => (
  <MaterialIcons name={iconName} size={size} color={color} />
);

// 2. Weather Card Widget


export const WeatherCardWidget = () => {
  return (
    <LinearGradient
      colors={[COLORS.primary, '#388E3C']} // Gradient approximation
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.weatherCard}
    >
      <View style={styles.weatherHeader}>
        <View>
          <Text style={styles.weatherLocation}>Osogbo, Osun</Text>
          <Text style={styles.weatherDate}>Tuesday, Jan 20, 2026</Text>
        </View>
        <MaterialIcons name="wb-sunny" size={40} color={COLORS.onPrimary} />
      </View>

      <View style={styles.weatherBody}>
        <Text style={styles.weatherTemp}>32°</Text>
        <View style={styles.weatherInfoContainer}>
          <Text style={styles.weatherCondition}>Partly Cloudy</Text>
          <View style={styles.weatherRow}>
            <View style={styles.weatherDetailRow}>
              <MaterialIcons name="water-drop" size={16} color="rgba(255,255,255,0.9)" />
              <Text style={styles.weatherDetailText}> 35% Rain</Text>
            </View>
            <View style={[styles.weatherDetailRow, { marginLeft: 16 }]}>
              <MaterialIcons name="air" size={16} color="rgba(255,255,255,0.9)" />
              <Text style={styles.weatherDetailText}> 12 km/h</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.weatherFooter}>
        <WeatherDetailItem label="High" value="34°" icon="arrow-upward" />
        <View style={styles.verticalDivider} />
        <WeatherDetailItem label="Low" value="24°" icon="arrow-downward" />
        <View style={styles.verticalDivider} />
        <WeatherDetailItem label="Humidity" value="68%" icon="opacity" />
      </View>
    </LinearGradient>
  );
};

export const WeatherDetailItem = ({ label, value, icon }: any) => (
  <View style={styles.weatherDetailItem}>
    <MaterialIcons name={icon} size={20} color="rgba(255,255,255,0.9)" />
    <Text style={styles.weatherDetailValue}>{value}</Text>
    <Text style={styles.weatherDetailLabel}>{label}</Text>
  </View>
);

// 3. Quick Action Menu (Bottom Sheet Content)
export const QuickActionMenuWidget = ({ onClose }: { onClose: () => void }) => {
  const ActionTile = ({ title, subtitle, icon, color }: any) => (
    <TouchableOpacity style={[styles.actionTile, { borderColor: color + '4D' }]} onPress={onClose}>
      <View style={[styles.actionIconBox, { backgroundColor: color + '1A' }]}>
        <MaterialIcons name={icon} size={24} color={color} />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSubtitle}>{subtitle}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.bottomSheetContainer}>
      <View style={styles.bottomSheetHandle} />
      <Text style={styles.bottomSheetTitle}>Quick Actions</Text>
      <ActionTile
        title="Log Activity"
        subtitle="Record farming activities"
        icon="edit-note"
        color={COLORS.primary}
      />
      <ActionTile
        title="Take Photo"
        subtitle="Capture crop or field images"
        icon="photo-camera"
        color={COLORS.secondary}
      />
      <ActionTile
        title="Record Harvest"
        subtitle="Log harvest data and yields"
        icon="agriculture"
        color={COLORS.tertiary}
      />
    </View>
  );
};

// 4. Farm Summary Card (Swipeable)
export const FarmSummaryCardWidget = ({ data, onTap, onToggleChanged, onLongPress }: any) => {
  const renderRightActions = () => {
    return (
      <View style={styles.swipeActionsContainer}>
        <TouchableOpacity style={[styles.swipeAction, { backgroundColor: COLORS.secondary }]}>
          <MaterialIcons name="water-drop" size={24} color="white" />
          <Text style={styles.swipeActionText}>Water</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.swipeAction, { backgroundColor: COLORS.tertiary }]}>
          <MaterialIcons name="note-add" size={24} color="black" />
          <Text style={[styles.swipeActionText, { color: 'black' }]}>Note</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity 
        style={[styles.cardContainer, { borderColor: data.statusColor + '4D' }]} // 4D = 30% opacity hex
        onPress={onTap}
        onLongPress={onLongPress}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.cardIconBox, { backgroundColor: data.statusColor + '1A' }]}>
             {/* Using MaterialCommunityIcons for some specific icons might be better, sticking to MaterialIcons for consistency */}
            <MaterialIcons name={data.icon} size={24} color={data.statusColor} />
          </View>
          
          <View style={styles.cardHeaderTextContainer}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.cardTitle}>{data.title}</Text>
              {data.hasBadge && (
                <View style={[styles.badge, { backgroundColor: data.statusColor }]}>
                  <Text style={styles.badgeText}>{data.badgeCount}</Text>
                </View>
              )}
            </View>
            <Text style={styles.cardValue}>{data.value}</Text>
          </View>

          {data.hasToggle ? (
            <Switch
              value={data.toggleValue}
              onValueChange={onToggleChanged}
              trackColor={{ false: '#767577', true: COLORS.primary + '80' }} // +80 for opacity
              thumbColor={data.toggleValue ? COLORS.primary : '#f4f3f4'}
            />
          ) : (
            <MaterialIcons name="chevron-right" size={24} color={COLORS.textSecondary} />
          )}
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.cardSubtitle}>{data.subtitle}</Text>
          <Text style={styles.cardDetails}>{data.details}</Text>
        </View>

        <TouchableOpacity style={styles.cardActionBtn} onPress={onTap}>
          <Text style={[styles.cardActionLabel, { color: COLORS.primary }]}>{data.actionLabel}</Text>
          <MaterialIcons name="arrow-forward" size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({

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

  // Swipe Actions
  swipeActionsContainer: {
    flexDirection: 'row',
    marginBottom: hp(2),
    paddingLeft: 8,
  },
  swipeAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: wp(3),
    marginLeft: 8,
  },
  swipeActionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },

  // Farm Summary Card
  cardContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: wp(3),
    borderWidth: 1.5,
    padding: wp(4),
    marginBottom: hp(2),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cardIconBox: {
    padding: wp(2),
    borderRadius: wp(2),
    marginRight: wp(3),
  },
  cardHeaderTextContainer: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  badge: {
    marginLeft: wp(2),
    paddingHorizontal: wp(2),
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  cardValue: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  cardBody: {
    marginTop: hp(2),
    backgroundColor: '#F5F5F580', // Transparent grey
    padding: wp(2),
    borderRadius: wp(2),
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  cardDetails: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  cardActionBtn: {
    marginTop: hp(1),
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1),
    paddingHorizontal: wp(2),
  },
  cardActionLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
  },
});