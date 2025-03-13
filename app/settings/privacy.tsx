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
  Lock, 
  Eye, 
  Fingerprint, 
  Database, 
  Download,
  Save,
  Trash2
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';

export default function PrivacySecurityScreen() {
  // Privacy settings
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [contactVisibility, setContactVisibility] = useState(false);
  const [locationTracking, setLocationTracking] = useState(true);
  
  // Security settings
  const [biometricAuth, setBiometricAuth] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('Success', 'Your privacy and security settings have been updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update privacy and security settings');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDownloadData = () => {
    Alert.alert(
      'Download Your Data',
      'This will prepare a file with all your personal data. You will receive an email with a download link once it\'s ready.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Request Data',
          onPress: () => Alert.alert('Request Submitted', 'You will receive an email with your data shortly.'),
        },
      ]
    );
  };
  
  const handleDeleteData = () => {
    Alert.alert(
      'Delete Your Data',
      'This will permanently delete all your personal data from our servers. This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => Alert.alert('Request Submitted', 'Your data deletion request has been submitted.'),
          style: 'destructive',
        },
      ]
    );
  };
  
  const handleSetupTwoFactor = () => {
    Alert.alert(
      'Two-Factor Authentication',
      'This feature adds an extra layer of security to your account. Not available in the demo version.',
      [{ text: 'OK' }]
    );
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy Settings</Text>
        <Text style={styles.sectionDescription}>
          Control how your information is used and shared
        </Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingIconContainer}>
            <Eye size={20} color={colors.iconLight} />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingItemTitle}>Profile Visibility</Text>
            <Text style={styles.settingItemDescription}>Allow others to see your profile information</Text>
          </View>
          <Switch
            value={profileVisibility}
            onValueChange={setProfileVisibility}
            trackColor={{ false: colors.card, true: colors.primary }}
            thumbColor={colors.iconLight}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={[styles.settingIconContainer, { backgroundColor: colors.secondary }]}>
            <Lock size={20} color={colors.iconLight} />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingItemTitle}>Contact Information</Text>
            <Text style={styles.settingItemDescription}>Show your contact details to property owners</Text>
          </View>
          <Switch
            value={contactVisibility}
            onValueChange={setContactVisibility}
            trackColor={{ false: colors.card, true: colors.primary }}
            thumbColor={colors.iconLight}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={[styles.settingIconContainer, { backgroundColor: colors.verified }]}>
            <Database size={20} color={colors.iconLight} />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingItemTitle}>Location Tracking</Text>
            <Text style={styles.settingItemDescription}>Allow app to use your location for better recommendations</Text>
          </View>
          <Switch
            value={locationTracking}
            onValueChange={setLocationTracking}
            trackColor={{ false: colors.card, true: colors.primary }}
            thumbColor={colors.iconLight}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security Settings</Text>
        <Text style={styles.sectionDescription}>
          Enhance the security of your account
        </Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingIconContainer}>
            <Fingerprint size={20} color={colors.iconLight} />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingItemTitle}>Biometric Authentication</Text>
            <Text style={styles.settingItemDescription}>Use fingerprint or face ID to secure your account</Text>
          </View>
          <Switch
            value={biometricAuth}
            onValueChange={setBiometricAuth}
            trackColor={{ false: colors.card, true: colors.primary }}
            thumbColor={colors.iconLight}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={[styles.settingIconContainer, { backgroundColor: '#6C63FF' }]}>
            <Lock size={20} color={colors.iconLight} />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingItemTitle}>Two-Factor Authentication</Text>
            <Text style={styles.settingItemDescription}>Add an extra layer of security to your account</Text>
          </View>
          <Switch
            value={twoFactorAuth}
            onValueChange={setTwoFactorAuth}
            trackColor={{ false: colors.card, true: colors.primary }}
            thumbColor={colors.iconLight}
          />
        </View>
        
        {twoFactorAuth && (
          <TouchableOpacity 
            style={styles.setupButton}
            onPress={handleSetupTwoFactor}
          >
            <Text style={styles.setupButtonText}>Set Up Two-Factor Authentication</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Data</Text>
        <Text style={styles.sectionDescription}>
          Manage your personal data
        </Text>
        
        <TouchableOpacity 
          style={styles.dataButton}
          onPress={handleDownloadData}
        >
          <Download size={20} color={colors.primary} />
          <Text style={styles.dataButtonText}>Download Your Data</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.dataButton, styles.deleteDataButton]}
          onPress={handleDeleteData}
        >
          <Trash2 size={20} color={colors.error} />
          <Text style={[styles.dataButtonText, styles.deleteDataText]}>Delete Your Data</Text>
        </TouchableOpacity>
      </View>
      
      <Button
        title="Save Settings"
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  settingItemDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  setupButton: {
    backgroundColor: colors.background,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  setupButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  dataButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  dataButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
    marginLeft: 8,
  },
  deleteDataButton: {
    borderColor: colors.error,
    backgroundColor: '#FFF5F5',
  },
  deleteDataText: {
    color: colors.error,
  },
  saveButton: {
    marginBottom: 16,
  },
});