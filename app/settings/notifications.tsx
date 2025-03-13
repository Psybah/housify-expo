import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Switch,
  TouchableOpacity,
  Alert
} from 'react-native';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  Clock,
  Save
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';

export default function NotificationsScreen() {
  // Notification channels
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  
  // Notification types
  const [newListingsEnabled, setNewListingsEnabled] = useState(true);
  const [priceChangesEnabled, setPriceChangesEnabled] = useState(true);
  const [verificationEnabled, setVerificationEnabled] = useState(true);
  const [pointsEnabled, setPointsEnabled] = useState(true);
  const [marketingEnabled, setMarketingEnabled] = useState(false);
  
  // Quiet hours
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
  
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('Success', 'Your notification preferences have been updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update notification preferences');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleQuietHours = () => {
    Alert.alert(
      'Quiet Hours',
      'This feature allows you to set specific hours when you won\'t receive notifications. Not available in the demo version.',
      [{ text: 'OK' }]
    );
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Channels</Text>
        <Text style={styles.sectionDescription}>
          Choose how you want to receive notifications
        </Text>
        
        <View style={styles.notificationItem}>
          <View style={styles.notificationIconContainer}>
            <Bell size={20} color={colors.iconLight} />
          </View>
          <View style={styles.notificationTextContainer}>
            <Text style={styles.notificationItemTitle}>Push Notifications</Text>
            <Text style={styles.notificationItemDescription}>Receive notifications on your device</Text>
          </View>
          <Switch
            value={pushEnabled}
            onValueChange={setPushEnabled}
            trackColor={{ false: colors.card, true: colors.primary }}
            thumbColor={colors.iconLight}
          />
        </View>
        
        <View style={styles.notificationItem}>
          <View style={[styles.notificationIconContainer, { backgroundColor: colors.secondary }]}>
            <Mail size={20} color={colors.iconLight} />
          </View>
          <View style={styles.notificationTextContainer}>
            <Text style={styles.notificationItemTitle}>Email Notifications</Text>
            <Text style={styles.notificationItemDescription}>Receive notifications via email</Text>
          </View>
          <Switch
            value={emailEnabled}
            onValueChange={setEmailEnabled}
            trackColor={{ false: colors.card, true: colors.primary }}
            thumbColor={colors.iconLight}
          />
        </View>
        
        <View style={styles.notificationItem}>
          <View style={[styles.notificationIconContainer, { backgroundColor: colors.verified }]}>
            <MessageSquare size={20} color={colors.iconLight} />
          </View>
          <View style={styles.notificationTextContainer}>
            <Text style={styles.notificationItemTitle}>SMS Notifications</Text>
            <Text style={styles.notificationItemDescription}>Receive notifications via SMS</Text>
          </View>
          <Switch
            value={smsEnabled}
            onValueChange={setSmsEnabled}
            trackColor={{ false: colors.card, true: colors.primary }}
            thumbColor={colors.iconLight}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Types</Text>
        <Text style={styles.sectionDescription}>
          Choose what types of notifications you want to receive
        </Text>
        
        <View style={styles.notificationItem}>
          <View style={styles.notificationTextContainer}>
            <Text style={styles.notificationItemTitle}>New Listings</Text>
            <Text style={styles.notificationItemDescription}>When new properties matching your criteria are added</Text>
          </View>
          <Switch
            value={newListingsEnabled}
            onValueChange={setNewListingsEnabled}
            trackColor={{ false: colors.card, true: colors.primary }}
            thumbColor={colors.iconLight}
          />
        </View>
        
        <View style={styles.notificationItem}>
          <View style={styles.notificationTextContainer}>
            <Text style={styles.notificationItemTitle}>Price Changes</Text>
            <Text style={styles.notificationItemDescription}>When prices change on saved properties</Text>
          </View>
          <Switch
            value={priceChangesEnabled}
            onValueChange={setPriceChangesEnabled}
            trackColor={{ false: colors.card, true: colors.primary }}
            thumbColor={colors.iconLight}
          />
        </View>
        
        <View style={styles.notificationItem}>
          <View style={styles.notificationTextContainer}>
            <Text style={styles.notificationItemTitle}>Verification Updates</Text>
            <Text style={styles.notificationItemDescription}>When your listings are verified or need changes</Text>
          </View>
          <Switch
            value={verificationEnabled}
            onValueChange={setVerificationEnabled}
            trackColor={{ false: colors.card, true: colors.primary }}
            thumbColor={colors.iconLight}
          />
        </View>
        
        <View style={styles.notificationItem}>
          <View style={styles.notificationTextContainer}>
            <Text style={styles.notificationItemTitle}>Points Activity</Text>
            <Text style={styles.notificationItemDescription}>When you earn or spend points</Text>
          </View>
          <Switch
            value={pointsEnabled}
            onValueChange={setPointsEnabled}
            trackColor={{ false: colors.card, true: colors.primary }}
            thumbColor={colors.iconLight}
          />
        </View>
        
        <View style={styles.notificationItem}>
          <View style={styles.notificationTextContainer}>
            <Text style={styles.notificationItemTitle}>Marketing & Promotions</Text>
            <Text style={styles.notificationItemDescription}>Special offers, discounts, and news</Text>
          </View>
          <Switch
            value={marketingEnabled}
            onValueChange={setMarketingEnabled}
            trackColor={{ false: colors.card, true: colors.primary }}
            thumbColor={colors.iconLight}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quiet Hours</Text>
        <Text style={styles.sectionDescription}>
          Set times when you don't want to receive notifications
        </Text>
        
        <View style={styles.notificationItem}>
          <View style={[styles.notificationIconContainer, { backgroundColor: '#6C63FF' }]}>
            <Clock size={20} color={colors.iconLight} />
          </View>
          <View style={styles.notificationTextContainer}>
            <Text style={styles.notificationItemTitle}>Enable Quiet Hours</Text>
            <Text style={styles.notificationItemDescription}>Mute notifications during specific hours</Text>
          </View>
          <Switch
            value={quietHoursEnabled}
            onValueChange={setQuietHoursEnabled}
            trackColor={{ false: colors.card, true: colors.primary }}
            thumbColor={colors.iconLight}
          />
        </View>
        
        {quietHoursEnabled && (
          <TouchableOpacity 
            style={styles.quietHoursButton}
            onPress={handleQuietHours}
          >
            <Text style={styles.quietHoursButtonText}>Set Quiet Hours</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <Button
        title="Save Preferences"
        onPress={handleSave}
        loading={isSaving}
        disabled={isSaving}
        icon={<Save size={20} color={colors.background} />}
        style={styles.saveButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  notificationItemDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  quietHoursButton: {
    backgroundColor: colors.background,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  quietHoursButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  saveButton: {
    marginBottom: 16,
  },
});