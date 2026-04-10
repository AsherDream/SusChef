import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PackageCheck, ChefHat, ShieldCheck, ArrowRight } from 'lucide-react-native';
import { colors } from '../../core/theme/colors';
import { layout, typography } from '../../core/theme/typography';

interface LandingPageProps {
  navigation: any;
}

export const LandingPage: React.FC<LandingPageProps> = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isWideScreen = width > 768;

  // Responsive padding and sizes
  const padding = useMemo(() => {
    if (isWideScreen) return layout.spacing.xl * 2;
    return layout.spacing.lg;
  }, [isWideScreen]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        safeArea: {
          flex: 1,
          backgroundColor: colors.background,
        },
        scrollContainer: {
          flexGrow: 1,
          paddingHorizontal: padding,
        },
        heroSection: {
          marginTop: isWideScreen ? layout.spacing.xl * 3 : layout.spacing.xl * 2,
          marginBottom: isWideScreen ? layout.spacing.xl * 2 : layout.spacing.xl,
          alignItems: 'center',
          justifyContent: 'center',
        },
        heroTitle: {
          fontSize: isWideScreen ? 56 : typography.size.h1,
          fontWeight: '800' as const,
          color: colors.primary,
          marginBottom: layout.spacing.md,
          textAlign: 'center',
        },
        heroTagline: {
          fontSize: isWideScreen ? 24 : typography.size.h2,
          color: colors.text.secondary,
          textAlign: 'center',
          marginBottom: layout.spacing.xl,
          lineHeight: isWideScreen ? 32 : 28,
        },
        heroDescription: {
          fontSize: isWideScreen ? 18 : typography.size.body,
          color: colors.text.secondary,
          textAlign: 'center',
          marginBottom: layout.spacing.xl * 1.5,
          maxWidth: isWideScreen ? 600 : '100%',
          lineHeight: isWideScreen ? 28 : 24,
        },
        ctaButton: {
          backgroundColor: colors.primary,
          paddingVertical: layout.spacing.md,
          paddingHorizontal: layout.spacing.xl * 2,
          borderRadius: layout.radius.full,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: layout.spacing.sm,
          minWidth: isWideScreen ? 220 : 180,
          marginBottom: isWideScreen ? layout.spacing.xl * 3 : layout.spacing.xl * 2,
        },
        ctaButtonText: {
          color: colors.surface,
          fontSize: isWideScreen ? 18 : typography.size.body,
          fontWeight: '700' as const,
        },
        featuresSectionTitle: {
          fontSize: isWideScreen ? 40 : typography.size.h2,
          fontWeight: '700' as const,
          color: colors.text.primary,
          textAlign: 'center',
          marginBottom: layout.spacing.xl,
        },
        featuresContainer: {
          flexDirection: isWideScreen ? 'row' : 'column',
          justifyContent: 'center',
          gap: layout.spacing.lg,
          marginBottom: isWideScreen ? layout.spacing.xl * 3 : layout.spacing.xl * 2,
          alignItems: isWideScreen ? 'stretch' : 'center',
        },
        featureCard: {
          backgroundColor: colors.surface,
          borderRadius: layout.radius.lg,
          padding: layout.spacing.lg,
          alignItems: 'center',
          width: isWideScreen ? 280 : '100%',
          maxWidth: isWideScreen ? 320 : '100%',
          borderWidth: 1,
          borderColor: colors.border,
        },
        featureIcon: {
          marginBottom: layout.spacing.md,
          padding: layout.spacing.md,
          backgroundColor: colors.background,
          borderRadius: layout.radius.md,
        },
        featureTitle: {
          fontSize: isWideScreen ? 20 : typography.size.h2,
          fontWeight: '600' as const,
          color: colors.text.primary,
          marginBottom: layout.spacing.sm,
          textAlign: 'center',
        },
        featureDescription: {
          fontSize: isWideScreen ? 16 : typography.size.caption,
          color: colors.text.secondary,
          textAlign: 'center',
          lineHeight: isWideScreen ? 24 : 20,
        },
        benefitsSection: {
          backgroundColor: colors.surface,
          borderRadius: layout.radius.lg,
          padding: padding,
          marginBottom: isWideScreen ? layout.spacing.xl * 2 : layout.spacing.xl,
          borderLeftWidth: 4,
          borderLeftColor: colors.primary,
        },
        benefitTitle: {
          fontSize: isWideScreen ? 28 : typography.size.h2,
          fontWeight: '700' as const,
          color: colors.text.primary,
          marginBottom: layout.spacing.lg,
          textAlign: 'center',
        },
        benefitsList: {
          gap: layout.spacing.md,
        },
        benefitItem: {
          flexDirection: 'row',
          gap: layout.spacing.md,
          marginBottom: layout.spacing.md,
          paddingVertical: layout.spacing.sm,
        },
        benefitBullet: {
          color: colors.primary,
          fontSize: isWideScreen ? 24 : typography.size.h2,
          fontWeight: 'bold' as const,
        },
        benefitText: {
          fontSize: isWideScreen ? 16 : typography.size.body,
          color: colors.text.primary,
          flex: 1,
          lineHeight: isWideScreen ? 26 : 22,
        },
        footerText: {
          fontSize: isWideScreen ? 16 : typography.size.caption,
          color: colors.text.secondary,
          textAlign: 'center',
          marginVertical: layout.spacing.xl,
          lineHeight: 24,
        },
      }),
    [isWideScreen, padding]
  );

  const handleGetStarted = () => {
    navigation.navigate('Login');
  };

  const features = [
    {
      icon: PackageCheck,
      title: 'Smart Inventory',
      description: 'Track items and eliminate waste with expiration alerts.',
    },
    {
      icon: ChefHat,
      title: 'AI Recipe Engine',
      description: 'Discover delicious meals instantly from what you already have.',
    },
    {
      icon: ShieldCheck,
      title: 'Personalized Nutrition',
      description: 'Tailored meal plans respecting your allergies and preferences.',
    },
  ];

  const benefits = [
    { icon: '🌱', text: 'Reduce food waste and environmental impact' },
    { icon: '💰', text: 'Save money by avoiding duplicate purchases' },
    { icon: '⏰', text: 'Never wonder "What\'s for dinner?" again' },
    { icon: '❤️', text: 'Maintain healthy eating habits effortlessly' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>SusChef</Text>
          <Text style={styles.heroTagline}>AI in your pantry, magic on your plate</Text>
          <Text style={styles.heroDescription}>
            Transform your kitchen from cluttered and wasteful to smart and sustainable. Discover
            recipes you love from the ingredients you have.
          </Text>

          {/* CTA Button */}
          <Pressable
            style={({ pressed }) => [styles.ctaButton, pressed && { opacity: 0.8 }]}
            onPress={handleGetStarted}
          >
            <Text style={styles.ctaButtonText}>Get Started</Text>
            <ArrowRight size={isWideScreen ? 22 : 20} color={colors.surface} strokeWidth={2.5} />
          </Pressable>
        </View>

        {/* Features Section */}
        <View>
          <Text style={styles.featuresSectionTitle}>Why SusChef?</Text>
          <View style={styles.featuresContainer}>
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <View key={index} style={styles.featureCard}>
                  <View style={styles.featureIcon}>
                    <IconComponent
                      size={isWideScreen ? 48 : 40}
                      color={colors.primary}
                      strokeWidth={1.5}
                    />
                  </View>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Benefits Section */}
        <View style={styles.benefitsSection}>
          <Text style={styles.benefitTitle}>Your Benefits</Text>
          <View style={styles.benefitsList}>
            {benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <Text style={styles.benefitBullet}>{benefit.icon}</Text>
                <Text style={styles.benefitText}>{benefit.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer Text */}
        <Text style={styles.footerText}>
          Join thousands of sustainable cooks saving time, money, and reducing waste.
        </Text>

        {/* Secondary CTA */}
        <Pressable
          style={({ pressed }) => [
            styles.ctaButton,
            {
              backgroundColor: colors.primary,
              marginBottom: isWideScreen ? layout.spacing.xl * 2 : layout.spacing.xl,
            },
            pressed && { opacity: 0.8 },
          ]}
          onPress={handleGetStarted}
        >
          <Text style={styles.ctaButtonText}>Start Your Journey</Text>
          <ArrowRight size={isWideScreen ? 22 : 20} color={colors.surface} strokeWidth={2.5} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LandingPage;
