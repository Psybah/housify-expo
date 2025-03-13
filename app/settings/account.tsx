import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Switch
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Shield, 
  Trash2,
  Save
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

export default function AccountSettingsScreen() {
  const router = useRouter();
  const { user, updateUser, logout } = useAuthStore();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSaving, setIsSaving] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  
  const handleSave = async () => {
    if (!name || !email || !phone) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }
    
    // Validate Nigerian phone number format
    const phoneRegex = /^\+234[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      Alert.alert('Invalid Phone Number', 'Please enter a valid Nigerian phone number (format: +2341234567890)');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateUser({
        name,
        email,
        phone
      });
      
      Alert.alert('Success', 'Your account information has been updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update account information');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleChangePassword = () => {
    Alert.alert(
      'Change Password',
      'This feature is not available in the demo version',
      [{ text: 'OK' }]
    );
  };
  
  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            // In a real app, this would call an API to delete the account
            Alert.alert(
              'Account Deleted',
              'Your account has been deleted successfully',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    logout();
                    router.replace('/(auth)');
                  },
                },
              ]
            );
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          value={name}
          onChangeText={setName}
          icon={<User size={20} color={colors.primary} />}
        />
        
        <Input
          label="Email Address"
          placeholder="Enter your email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          icon={<Mail size={20} color={colors.primary} />}
        />
        
        <Input
          label="Phone Number"
          placeholder="Enter your phone number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          icon={<Phone size={20} color={colors.primary} />}
        />
        
        <Button
          title="Save Changes"
          onPress={handleSave}
          loading={isSaving}
          disabled={isSaving}
          icon={<Save size={20} color={colors.background} />}
          style={styles.saveButton}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Security</Text>
        
        <TouchableOpacity 
          style={styles.securityItem}
          onPress={handleChangePassword}
        >
          <View style={styles.securityIconContainer}>
            <Lock size={20} color={colors.iconLight} />
          </View>
          <View style={styles.securityTextContainer}>
            <Text style={styles.securityItemTitle}>Change Password</Text>
            <Text style={styles.securityItemDescription}>Update your password</Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.securityItem}>
          <View style={styles.securityIconContainer}>
            <Shield size={20} color={colors.iconLight} />
          </View>
          <View style={styles.securityTextContainer}>
            <Text style={styles.securityItemTitle}>Biometric Login</Text>
            <Text style={styles.securityItemDescription}>Use fingerprint or face ID to login</Text>
          </View>
          <Switch
            value={biometricEnabled}
            onValueChange={setBiometricEnabled}
            trackColor={{ false: colors.card, true: colors.primary }}
            thumbColor={colors.iconLight}
          />
        </View>
      </View>
      
      <View style={styles.dangerSection}>
        <Text style={styles.dangerTitle}>Danger Zone</Text>
        
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
        >
          <Trash2 size={20} color={colors.error} />
          <Text style={styles.deleteButtonText}>Delete Account</Text>
        </TouchableOpacity>
        
        <Text style={styles.dangerDescription}>
          Deleting your account will permanently remove all your data, including listings, saved properties, and points. This action cannot be undone.
        </Text>
      </View>
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
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 16,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  securityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  securityTextContainer: {
    flex: 1,
  },
  securityItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  securityItemDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  dangerSection: {
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.error,
  },
  dangerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.error,
    marginBottom: 16,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.error,
    marginLeft: 8,
  },
  dangerDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});