// 3. Quick Action Menu (Bottom Sheet Content)
const QuickActionMenuWidget = ({ onClose }: { onClose: () => void }) => {
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