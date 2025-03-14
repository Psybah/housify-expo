import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  Switch,
  StatusBar,
  FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { 
  User, 
  Settings, 
  LogOut, 
  Heart, 
  Home, 
  ChevronRight,
  Bell,
  Shield,
  HelpCircle,
  Star,
  FileEdit,
  Clock,
  AlertTriangle,
  Coins
} from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { PointsEarnedModal } from '@/components/PointsEarnedModal';
import { useAuthStore } from '@/store/auth-store';
import { usePropertyStore } from '@/store/property-store';
import { Property } from '@/types/property';

export default function ProfileScreen() {
  const router = useRouter();
  const { 
    user, 
    isAuthenticated, 
    login, 
    logout, 
    register, 
    completeProfile,
    showPointsEarnedModal,
    pointsEarnedAmount,
    pointsEarnedReason,
    hidePointsEarnedModal
  } = useAuthStore();
  const { 
    savedProperties, 
    properties, 
    draftProperties, 
    fetchDraftProperties 
  } = usePropertyStore();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showDrafts, setShowDrafts] = useState(false);
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchDraftProperties();
    }
  }, [isAuthenticated]);
  
  const validateLoginForm = () => {
    let isValid = true;
    
    // Reset errors
    setEmailError('');
    setPasswordError('');
    
    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }
    
    // Validate password
    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }
    
    return isValid;
  };
  
  const validateRegisterForm = () => {
    let isValid = validateLoginForm();
    
    // Reset additional errors
    setNameError('');
    setPhoneError('');
    
    // Validate name
    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    }
    
    // Validate phone
    if (!phone.trim()) {
      setPhoneError('Phone number is required');
      isValid = false;
    } else if (!/^\+?[0-9]{10,15}$/.test(phone.replace(/\s/g, ''))) {
      setPhoneError('Please enter a valid phone number');
      isValid = false;
    }
    
    return isValid;
  };
  
  const handleAuth = async () => {
    if (isLogin) {
      if (!validateLoginForm()) return;
    } else {
      if (!validateRegisterForm()) return;
    }
    
    setLoading(true);
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register({ name, email, phone }, password);
      }
    } catch (error) {
      Alert.alert('Error', 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
          }
        }
      ]
    );
  };
  
  const handleCompleteProfile = async () => {
    if (!user || user.profileCompleted) return;
    
    Alert.alert(
      'Complete Profile',
      'Would you like to complete your profile now? You will earn 10 HP!',
      [
        { text: 'Later', style: 'cancel' },
        { 
          text: 'Complete Now', 
          onPress: async () => {
            await completeProfile();
          }
        }
      ]
    );
  };
  
  const toggleSwitch = () => {
    setNotificationsEnabled(previousState => !previousState);
  };
  
  const toggleDrafts = () => {
    setShowDrafts(!showDrafts);
  };
  
  const navigateToSavedProperties = () => {
    router.push('/saved-properties');
  };
  
  const navigateToMyListings = () => {
    router.push('/my-listings');
  };
  
  const renderDraftItem = ({ item }: { item: Property }) => {
    const statusColors = {
      'draft': Colors.neutral.gray,
      'pending-verification': Colors.status.warning
    };
    
    const statusText = {
      'draft': 'Draft',
      'pending-verification': 'Pending Verification'
    };
    
    const statusIcon = {
      'draft': <FileEdit size={14} color={statusColors[item.status as 'draft' | 'pending-verification']} />,
      'pending-verification': <Clock size={14} color={statusColors[item.status as 'draft' | 'pending-verification']} />
    };
    
    return (
      <TouchableOpacity 
        style={styles.draftItem}
        onPress={() => router.push(`/property/${item.id}`)}
      >
        <View style={styles.draftImageContainer}>
          <Image
            source={{ uri: item.images[0] || 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0' }}
            style={styles.draftImage}
            contentFit="cover"
          />
        </View>
        <View style={styles.draftContent}>
          <Text style={styles.draftTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.draftPrice}>₦{item.price.toLocaleString('en-NG')}/yr</Text>
          <View style={styles.draftStatus}>
            {statusIcon[item.status as 'draft' | 'pending-verification']}
            <Text style={[styles.draftStatusText, { color: statusColors[item.status as 'draft' | 'pending-verification'] }]}>
              {statusText[item.status as 'draft' | 'pending-verification']}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  const renderAuthForm = () => {
    return (
      <View style={styles.authContainer}>
        <View style={styles.authHeader}>
          <Text style={styles.authTitle}>{isLogin ? 'Login' : 'Create Account'}</Text>
          <Text style={styles.authSubtitle}>
            {isLogin 
              ? 'Sign in to access your account' 
              : 'Join Housify to find your perfect home'}
          </Text>
        </View>
        
        {!isLogin && (
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (text.trim()) setNameError('');
            }}
            leftIcon={<User size={18} color={Colors.neutral.gray} />}
            error={nameError}
            required
          />
        )}
        
        <Input
          label="Email Address"
          placeholder="Enter your email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (text.trim()) setEmailError('');
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          error={emailError}
          required
        />
        
        {!isLogin && (
          <Input
            label="Phone Number"
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              if (text.trim()) setPhoneError('');
            }}
            keyboardType="phone-pad"
            error={phoneError}
            required
          />
        )}
        
        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (text.trim()) setPasswordError('');
          }}
          isPassword
          error={passwordError}
          required
        />
        
        <Button
          title={isLogin ? 'Login' : 'Create Account'}
          onPress={handleAuth}
          fullWidth
          loading={loading}
          style={styles.authButton}
        />
        
        <TouchableOpacity 
          onPress={() => setIsLogin(!isLogin)}
          style={styles.switchAuthMode}
        >
          <Text style={styles.switchAuthText}>
            {isLogin 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Login"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  const renderUserProfile = () => {
    if (!user) return null;
    
    const savedPropertiesCount = savedProperties.length;
    const listedPropertiesCount = user.listedProperties.length;
    const draftsCount = draftProperties.length;
    
    // Ensure points is a number
    const userPoints = typeof user.points === 'object' && user.points !== null 
      ? (user.points.hp || 0) // If it's an object with hp property, use that
      : (typeof user.points === 'number' ? user.points : 0); // Otherwise use the number or default to 0
    
    return (
      <View style={styles.profileContainer}>
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: user.avatar || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d' }}
            style={styles.avatar}
            contentFit="cover"
          />
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
            <View style={styles.verificationBadge}>
              <Shield size={12} color={Colors.neutral.white} />
              <Text style={styles.verificationText}>
                {user.verifiedStatus ? 'Verified Account' : 'Unverified Account'}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={styles.pointsContainer}>
          <View style={styles.pointsContent}>
            <Text style={styles.pointsLabel}>Housify Points</Text>
            <View style={styles.pointsValueContainer}>
              <Coins size={20} color={Colors.accent.main} />
              <Text style={styles.pointsValue}>{userPoints}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.buyPointsButton}
            onPress={() => router.push('/points')}
          >
            <Text style={styles.buyPointsText}>Buy Points</Text>
          </TouchableOpacity>
        </View>
        
        {!user.profileCompleted && (
          <TouchableOpacity 
            style={styles.completeProfileCard}
            onPress={handleCompleteProfile}
          >
            <View style={styles.completeProfileContent}>
              <Text style={styles.completeProfileTitle}>Complete Your Profile</Text>
              <Text style={styles.completeProfileText}>
                Complete your profile to earn 10 Housify Points!
              </Text>
            </View>
            <View style={styles.completeProfilePoints}>
              <Coins size={16} color={Colors.accent.main} />
              <Text style={styles.completeProfilePointsText}>+10 HP</Text>
            </View>
          </TouchableOpacity>
        )}
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{savedPropertiesCount}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{listedPropertiesCount}</Text>
            <Text style={styles.statLabel}>Listed</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.unlockedProperties.length}</Text>
            <Text style={styles.statLabel}>Unlocked</Text>
          </View>
        </View>
        
        {draftsCount > 0 && (
          <View style={styles.draftsSection}>
            <TouchableOpacity 
              style={styles.draftsSectionHeader}
              onPress={toggleDrafts}
            >
              <View style={styles.draftsSectionTitle}>
                <AlertTriangle size={16} color={Colors.status.warning} />
                <Text style={styles.draftsSectionTitleText}>
                  Pending Listings ({draftsCount})
                </Text>
              </View>
              <ChevronRight 
                size={20} 
                color={Colors.neutral.gray} 
                style={{ transform: [{ rotate: showDrafts ? '90deg' : '0deg' }] }}
              />
            </TouchableOpacity>
            
            {showDrafts && (
              <FlatList
                data={draftProperties}
                renderItem={renderDraftItem}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                contentContainerStyle={styles.draftsList}
              />
            )}
          </View>
        )}
        
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>My Properties</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={navigateToSavedProperties}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuItemIcon, { backgroundColor: Colors.primary.light + '20' }]}>
                <Heart size={20} color={Colors.primary.main} />
              </View>
              <Text style={styles.menuItemText}>Saved Properties</Text>
            </View>
            <ChevronRight size={20} color={Colors.neutral.gray} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={navigateToMyListings}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuItemIcon, { backgroundColor: Colors.accent.light + '20' }]}>
                <Home size={20} color={Colors.accent.main} />
              </View>
              <Text style={styles.menuItemText}>My Listings</Text>
            </View>
            <ChevronRight size={20} color={Colors.neutral.gray} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Settings</Text>
          
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuItemIcon, { backgroundColor: '#F59E0B20' }]}>
                <Bell size={20} color={Colors.status.warning} />
              </View>
              <Text style={styles.menuItemText}>Notifications</Text>
            </View>
            <Switch
              trackColor={{ false: Colors.neutral.lightGray, true: Colors.primary.light }}
              thumbColor={notificationsEnabled ? Colors.primary.main : Colors.neutral.white}
              onValueChange={toggleSwitch}
              value={notificationsEnabled}
            />
          </View>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuItemIcon, { backgroundColor: '#10B98120' }]}>
                <Settings size={20} color={Colors.status.success} />
              </View>
              <Text style={styles.menuItemText}>Account Settings</Text>
            </View>
            <ChevronRight size={20} color={Colors.neutral.gray} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuItemIcon, { backgroundColor: '#3B82F620' }]}>
                <HelpCircle size={20} color={Colors.status.info} />
              </View>
              <Text style={styles.menuItemText}>Help & Support</Text>
            </View>
            <ChevronRight size={20} color={Colors.neutral.gray} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuItemIcon, { backgroundColor: '#F59E0B20' }]}>
                <Star size={20} color={Colors.status.warning} />
              </View>
              <Text style={styles.menuItemText}>Rate the App</Text>
            </View>
            <ChevronRight size={20} color={Colors.neutral.gray} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut size={20} color={Colors.status.error} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left', 'top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background.primary} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {isAuthenticated ? renderUserProfile() : renderAuthForm()}
      </ScrollView>
      
      <PointsEarnedModal
        visible={showPointsEarnedModal}
        onClose={hidePointsEarnedModal}
        points={pointsEarnedAmount}
        reason={pointsEarnedReason}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  authContainer: {
    padding: 16,
  },
  authHeader: {
    marginBottom: 24,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  authSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  authButton: {
    marginTop: 16,
    height: 56, // Ensure consistent button height
  },
  switchAuthMode: {
    marginTop: 16,
    alignItems: 'center',
  },
  switchAuthText: {
    fontSize: 14,
    color: Colors.primary.main,
    fontWeight: '500',
  },
  profileContainer: {
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.status.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 4,
  },
  verificationText: {
    fontSize: 12,
    color: Colors.neutral.white,
    fontWeight: '500',
  },
  pointsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primary.main,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  pointsContent: {
    flex: 1,
  },
  pointsLabel: {
    fontSize: 14,
    color: Colors.neutral.white,
    opacity: 0.8,
    marginBottom: 4,
  },
  pointsValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.neutral.white,
  },
  buyPointsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buyPointsText: {
    color: Colors.neutral.white,
    fontSize: 14,
    fontWeight: '500',
  },
  completeProfileCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.accent.light + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.accent.main,
  },
  completeProfileContent: {
    flex: 1,
  },
  completeProfileTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  completeProfileText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  completeProfilePoints: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent.light + '20',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  completeProfilePointsText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.accent.main,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.neutral.lightGray,
    marginHorizontal: 8,
  },
  draftsSection: {
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    marginBottom: 24,
    overflow: 'hidden',
  },
  draftsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  draftsSectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  draftsSectionTitleText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  draftsList: {
    padding: 16,
    paddingTop: 0,
  },
  draftItem: {
    flexDirection: 'row',
    backgroundColor: Colors.background.primary,
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  draftImageContainer: {
    width: 80,
    height: 80,
  },
  draftImage: {
    width: '100%',
    height: '100%',
  },
  draftContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  draftTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  draftPrice: {
    fontSize: 14,
    color: Colors.primary.main,
    fontWeight: '500',
  },
  draftStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  draftStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  menuSection: {
    marginBottom: 24,
  },
  menuSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    height: 72, // Ensure consistent height for menu items
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuItemText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.status.error + '10',
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
    gap: 8,
    height: 56, // Ensure consistent button height
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.status.error,
  },
});