import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { ArrowLeft, Download, MonitorSmartphone, Share2, Smartphone } from 'lucide-react-native';

const installGuides = [
  {
    title: 'iPhone / iPad',
    icon: Share2,
    steps: ['Open this app in Safari.', 'Tap the Share button.', 'Choose “Add to Home Screen”.', 'Tap “Add” to install it.'],
  },
  {
    title: 'Android',
    icon: Download,
    steps: ['Open this app in Chrome.', 'Tap the browser menu.', 'Choose “Install app” or “Add to Home screen”.', 'Confirm to install it.'],
  },
];

interface InstallProps {
  onBack?: () => void;
}

const Install = ({ onBack }: InstallProps) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ArrowLeft size={20} color="#C8D6E5" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.heroSection}>
          <View style={styles.badge}>
            <MonitorSmartphone size={16} color="#00E676" />
            <Text style={styles.badgeText}>Installable mobile app</Text>
          </View>
          <Text style={styles.title}>Install Knockout Bracket on your phone</Text>
          <Text style={styles.subtitle}>
            Use the same bracket experience on mobile, directly from your home screen.
          </Text>
        </View>

        <View style={styles.grid}>
          {installGuides.map(({ title, icon: Icon, steps }) => (
            <View key={title} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                  <Icon size={20} color="#00E676" />
                </View>
                <Text style={styles.cardTitle}>{title}</Text>
              </View>
              <View style={styles.stepsContainer}>
                {steps.map((step, index) => (
                  <View key={step} style={styles.stepRow}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={styles.aside}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: '#1E2A38' }]}>
              <Smartphone size={20} color="#00E676" />
            </View>
            <Text style={styles.cardTitle}>What you get</Text>
          </View>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>• Full-screen app feel from the home screen</Text>
            <Text style={styles.featureItem}>• Fast access to bracket editing</Text>
            <Text style={styles.featureItem}>• One shared codebase for all devices</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0A0D10',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  backText: {
    color: '#C8D6E5',
    fontSize: 14,
    fontWeight: '600',
  },
  heroSection: {
    marginBottom: 32,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 230, 118, 0.3)',
    gap: 8,
    marginBottom: 16,
  },
  badgeText: {
    color: '#00E676',
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 38,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#3A5A7C',
    lineHeight: 24,
  },
  grid: {
    gap: 16,
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#0F1520',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E2738',
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  iconContainer: {
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
    padding: 8,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepsContainer: {
    gap: 12,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1E2738',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    color: '#C8D6E5',
    fontSize: 14,
    lineHeight: 20,
  },
  aside: {
    backgroundColor: '#0F1520',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E2738',
    padding: 20,
  },
  featureList: {
    gap: 8,
  },
  featureItem: {
    color: '#C8D6E5',
    fontSize: 14,
  },
});

export default Install;