import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import {
  ChevronRight,
  Settings,
  RefreshCcw,
  LogOut,
  Shield,
  Moon,
  Bell,
  User,
} from 'lucide-react-native';
import { layout, typography } from '../../core/theme/typography';
import { useThemeColors } from '../../core/theme/theme';

const iconMap = {
  settings: Settings,
  refresh: RefreshCcw,
  logout: LogOut,
  shield: Shield,
  moon: Moon,
  bell: Bell,
  user: User,
};

type IconName = keyof typeof iconMap;

interface SettingRowProps {
  iconName: IconName;
  label: string;
  onPress: () => void;
  isDestructive?: boolean;
}

export function SettingRow({ iconName, label, onPress, isDestructive }: SettingRowProps) {
  const colors = useThemeColors();
  const Icon = iconMap[iconName] ?? Settings;
  const tint = isDestructive ? colors.status.error : colors.text.primary;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
    >
      <View style={styles.left}>
        <Icon size={22} color={tint} />
        <Text style={[styles.label, { color: tint }]}>{label}</Text>
      </View>
      <ChevronRight size={20} color={colors.text.secondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: layout.spacing.md,
    paddingHorizontal: layout.spacing.lg,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: layout.spacing.md,
  },
  label: {
    fontSize: typography.size.body,
    fontWeight: typography.weight.medium as any,
  },
  pressed: {
    backgroundColor: '#F3F4F6',
    borderRadius: layout.radius.md,
  },
});
