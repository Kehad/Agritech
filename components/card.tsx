// 4. Farm Summary Card (Swipeable)
const FarmSummaryCardWidget = ({ data, onTap, onToggleChanged, onLongPress }: any) => {
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