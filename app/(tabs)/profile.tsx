import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Mail, Phone, LogOut, ChevronRight, Shield, Bell, HelpCircle, Settings, Home } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { useAuthStore } from '@/store/auth-store';
import { useListingsStore } from '@/store/listings-store';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { userListings, fetchUserListings } = useListingsStore();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            logout();
            router.replace('/(auth)');
          },
          style: 'destructive',
        },
      ]
    );
  };
  
  const handleViewListings = () => {
    fetchUserListings();
    router.push({
      pathname: '/search',
      params: { filter: 'my-listings' },
    });
  };
  
  const renderProfileItem = (
    icon: React.ReactNode,
    title: string,
    subtitle?: string,
    onPress?: () => void,
    rightElement?: React.ReactNode
  ) => {
    return (
      <TouchableOpacity 
        style={styles.profileItem}
        onPress={onPress}
        disabled={!onPress}
      >
        <View style={styles.profileItemIcon}>
          {icon}
        </View>
        
        <View style={styles.profileItemContent}>
          <Text style={styles.profileItemTitle}>{title}</Text>
          {subtitle && <Text style={styles.profileItemSubtitle}>{subtitle}</Text>}
        </View>
        
        {rightElement || (onPress && <ChevronRight size={20} color={colors.textSecondary} />)}
      </TouchableOpacity>
    );
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
        </View>
        
        <Text style={styles.name}>{user?.name || 'User'}</Text>
        <Text style={styles.joinDate}>
          Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
        </Text>
        
        <Button
          title="Edit Profile"
          variant="outline"
          size="small"
          style={styles.editButton}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        {renderProfileItem(
          <User size={20} color={colors.primary} />,
          'Full Name',
          user?.name
        )}
        
        {renderProfileItem(
          <Mail size={20} color={colors.primary} />,
          'Email',
          user?.email
        )}
        
        {renderProfileItem(
          <Phone size={20} color={colors.primary} />,
          'Phone',
          user?.phone
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Listings</Text>
        
        {renderProfileItem(
          <Home size={20} color={colors.primary} />,
          'My Listings',
          `${user?.listings?.length || 0} listings`,
          handleViewListings
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        
        {renderProfileItem(
          <Bell size={20} color={colors.primary} />,
          'Notifications',
          notificationsEnabled ? 'Enabled' : 'Disabled',
          undefined,
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.text}
          />
        )}
        
        {renderProfileItem(
          <Shield size={20} color={colors.primary} />,
          'Privacy & Security',
          'Manage your privacy settings',
          () => {}
        )}
        
        {renderProfileItem(
          <HelpCircle size={20} color={colors.primary} />,
          'Help & Support',
          'Get help with Housify',
          () => {}
        )}
        
        {renderProfileItem(
          <Settings size={20} color={colors.primary} />,
          'App Settings',
          'Manage app preferences',
          () => {}
        )}
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={20} color={colors.error} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      
      <Text style={styles.versionText}>Housify v1.0.0</Text>
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
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  editButton: {
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  profileItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(108, 92, 231, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileItemContent: {
    flex: 1,
  },
  profileItemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  profileItemSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 82, 82, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.error,
    marginLeft: 8,
  },
  versionText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});