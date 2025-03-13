import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Alert,
  Share,
  Clipboard,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  User, 
  Settings, 
  LogOut, 
  Heart, 
  Home, 
  Bell, 
  Lock, 
  HelpCircle,
  ChevronRight,
  Edit3,
  Camera,
  Share2,
  Copy,
  Gift,
  Users
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/store/auth-store';
import { useListingsStore } from '@/store/listings-store';
import { usePointsStore } from '@/store/points-store';
import { PointsBadge } from '@/components/PointsBadge';
import { ListingCard } from '@/components/ListingCard';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, updateUser } = useAuthStore();
  const { getSavedListings, userListings, fetchUserListings } = useListingsStore();
  const { generateReferralCode, referralInfo } = usePointsStore();
  
  const [savedListings, setSavedListings] = useState(getSavedListings());
  const [activeTab, setActiveTab] = useState('saved');
  const [referralCode, setReferralCode] = useState('');
  
  useEffect(() => {
    fetchUserListings();
    initReferralCode();
  }, []);
  
  useEffect(() => {
    setSavedListings(getSavedListings());
  }, [getSavedListings]);
  
  const initReferralCode = async () => {
    if (user?.referralCode) {
      setReferralCode(user.referralCode);
    } else {
      try {
        const code = await generateReferralCode();
        setReferralCode(code);
      } catch (error) {
        console.error('Error generating referral code:', error);
      }
    }
  };
  
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
  
  const handleChangeProfileImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    
    if (!result.canceled) {
      updateUser({ profileImage: result.assets[0].uri });
    }
  };
  
  const handleShareReferralCode = async () => {
    try {
      await Share.share({
        message: `Join Housify with my referral code: ${referralCode} and get 50 HP (House Points) to unlock property listings! Download the app now.`,
      });
    } catch (error) {
      console.error('Error sharing referral code:', error);
    }
  };
  
  const handleCopyReferralCode = () => {
    Clipboard.setString(referralCode);
    Alert.alert('Copied!', 'Referral code copied to clipboard');
  };
  
  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Please login to view your profile</Text>
      </View>
    );
  }
  
  // Get first name for display
  const firstName = user.name.split(' ')[0];
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <TouchableOpacity 
            style={styles.profileImage}
            onPress={handleChangeProfileImage}
          >
            {user.profileImage ? (
              <Image 
                source={{ uri: user.profileImage }} 
                style={styles.image} 
              />
            ) : (
              <View style={styles.profilePlaceholder}>
                <Text style={styles.profileInitial}>
                  {user.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View style={styles.editIconContainer}>
              <Camera size={16} color={colors.background} />
            </View>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        
        <View style={styles.pointsContainer}>
          <PointsBadge amount={user.housePoints || 0} />
        </View>
        
        <TouchableOpacity 
          style={styles.editProfileButton}
          onPress={() => router.push('/settings/account')}
        >
          <Edit3 size={16} color={colors.primary} />
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.referralSection}>
        <View style={styles.referralHeader}>
          <View style={styles.referralIconContainer}>
            <Gift size={20} color={colors.iconLight} />
          </View>
          <View style={styles.referralTextContainer}>
            <Text style={styles.referralTitle}>Refer & Earn</Text>
            <Text style={styles.referralSubtitle}>
              Share your code and earn 100 HP for each friend who joins
            </Text>
          </View>
        </View>
        
        <View style={styles.referralCodeContainer}>
          <Text style={styles.referralCodeLabel}>Your Referral Code</Text>
          <View style={styles.referralCodeBox}>
            <Text style={styles.referralCode}>{referralCode}</Text>
            <TouchableOpacity 
              style={styles.copyButton}
              onPress={handleCopyReferralCode}
            >
              <Copy size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.shareButton}
            onPress={handleShareReferralCode}
          >
            <Share2 size={16} color={colors.iconLight} />
            <Text style={styles.shareButtonText}>Share Your Code</Text>
          </TouchableOpacity>
          
          <View style={styles.referralStats}>
            <View style={styles.referralStat}>
              <Users size={16} color={colors.textSecondary} />
              <Text style={styles.referralStatText}>
                {referralInfo.totalReferred} friends referred
              </Text>
            </View>
            <View style={styles.referralStat}>
              <Gift size={16} color={colors.textSecondary} />
              <Text style={styles.referralStatText}>
                {referralInfo.pointsEarned} HP earned
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Settings</Text>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => router.push('/settings/account')}
        >
          <View style={styles.settingsIconContainer}>
            <User size={20} color={colors.iconLight} />
          </View>
          <View style={styles.settingsTextContainer}>
            <Text style={styles.settingsItemTitle}>Account Settings</Text>
            <Text style={styles.settingsItemDescription}>Manage your account details</Text>
          </View>
          <ChevronRight size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => router.push('/settings/notifications')}
        >
          <View style={[styles.settingsIconContainer, { backgroundColor: colors.secondary }]}>
            <Bell size={20} color={colors.iconLight} />
          </View>
          <View style={styles.settingsTextContainer}>
            <Text style={styles.settingsItemTitle}>Notifications</Text>
            <Text style={styles.settingsItemDescription}>Manage notification preferences</Text>
          </View>
          <ChevronRight size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => router.push('/settings/privacy')}
        >
          <View style={[styles.settingsIconContainer, { backgroundColor: colors.verified }]}>
            <Lock size={20} color={colors.iconLight} />
          </View>
          <View style={styles.settingsTextContainer}>
            <Text style={styles.settingsItemTitle}>Privacy & Security</Text>
            <Text style={styles.settingsItemDescription}>Manage privacy settings</Text>
          </View>
          <ChevronRight size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.settingsItem}
          onPress={() => router.push('/settings/support')}
        >
          <View style={[styles.settingsIconContainer, { backgroundColor: '#6C63FF' }]}>
            <HelpCircle size={20} color={colors.iconLight} />
          </View>
          <View style={styles.settingsTextContainer}>
            <Text style={styles.settingsItemTitle}>Help & Support</Text>
            <Text style={styles.settingsItemDescription}>Get help and contact support</Text>
          </View>
          <ChevronRight size={20} color={colors.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.settingsItem, styles.logoutItem]}
          onPress={handleLogout}
        >
          <View style={[styles.settingsIconContainer, { backgroundColor: colors.error }]}>
            <LogOut size={20} color={colors.iconLight} />
          </View>
          <View style={styles.settingsTextContainer}>
            <Text style={[styles.settingsItemTitle, { color: colors.error }]}>Logout</Text>
            <Text style={styles.settingsItemDescription}>Sign out of your account</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      <View style={styles.listingsSection}>
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[
              styles.tab,
              activeTab === 'saved' && styles.activeTab
            ]}
            onPress={() => setActiveTab('saved')}
          >
            <Heart 
              size={16} 
              color={activeTab === 'saved' ? colors.primary : colors.textSecondary} 
            />
            <Text style={[
              styles.tabText,
              activeTab === 'saved' && styles.activeTabText
            ]}>
              Saved Listings
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tab,
              activeTab === 'my' && styles.activeTab
            ]}
            onPress={() => setActiveTab('my')}
          >
            <Home 
              size={16} 
              color={activeTab === 'my' ? colors.primary : colors.textSecondary} 
            />
            <Text style={[
              styles.tabText,
              activeTab === 'my' && styles.activeTabText
            ]}>
              My Listings
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.listingsContainer}>
          {activeTab === 'saved' ? (
            savedListings.length > 0 ? (
              savedListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Heart size={48} color={colors.textSecondary} />
                <Text style={styles.emptyTitle}>No Saved Listings</Text>
                <Text style={styles.emptyDescription}>
                  Properties you save will appear here
                </Text>
                <TouchableOpacity 
                  style={styles.browseButton}
                  onPress={() => router.push('/(tabs)')}
                >
                  <Text style={styles.browseButtonText}>Browse Listings</Text>
                </TouchableOpacity>
              </View>
            )
          ) : (
            userListings.length > 0 ? (
              userListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Home size={48} color={colors.textSecondary} />
                <Text style={styles.emptyTitle}>No Listings Yet</Text>
                <Text style={styles.emptyDescription}>
                  You haven't added any properties yet
                </Text>
                <TouchableOpacity 
                  style={styles.browseButton}
                  onPress={() => router.push('/add-listing')}
                >
                  <Text style={styles.browseButtonText}>Add New Listing</Text>
                </TouchableOpacity>
              </View>
            )
          )}
        </View>
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
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  profilePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.background,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  pointsContainer: {
    marginBottom: 16,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  editProfileText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginLeft: 8,
  },
  referralSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  referralHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  referralIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.referral,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  referralTextContainer: {
    flex: 1,
  },
  referralTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },
  referralSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  referralCodeContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  referralCodeLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  referralCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  referralCode: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    letterSpacing: 1,
  },
  copyButton: {
    padding: 4,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    marginBottom: 16,
  },
  shareButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.iconLight,
    marginLeft: 8,
  },
  referralStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  referralStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  referralStatText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  settingsSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsTextContainer: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  settingsItemDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  logoutItem: {
    borderBottomWidth: 0,
    marginTop: 8,
  },
  listingsSection: {
    padding: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: colors.card,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: colors.background,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  activeTabText: {
    color: colors.text,
    fontWeight: '500',
  },
  listingsContainer: {
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: colors.card,
    borderRadius: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  browseButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  browseButtonText: {
    fontSize: 14,
    color: colors.background,
    fontWeight: '500',
  },
});