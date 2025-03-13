import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Coins, 
  ArrowRight, 
  TrendingUp, 
  Gift, 
  Clock, 
  CheckCircle,
  PlusCircle,
  UserPlus,
  Edit3,
  Award,
  Home
} from "lucide-react-native";
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { PointsBadge } from '@/components/PointsBadge';
import { useAuthStore } from '@/store/auth-store';
import { usePointsStore } from '@/store/points-store';

export default function PointsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { transactions, fetchTransactions } = usePointsStore();
  
  useEffect(() => {
    fetchTransactions();
  }, []);
  
  const handleBuyPoints = () => {
    router.push('/buy-points');
  };
  
  const handleAddListing = () => {
    router.push('/add-listing');
  };
  
  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = new Date(transaction.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, typeof transactions>);
  
  const renderTransactionIcon = (type: string) => {
    switch (type) {
      case 'purchase':
        return <Coins size={20} color={colors.iconLight} />;
      case 'earn':
        return <Gift size={20} color={colors.iconLight} />;
      case 'unlock':
        return <CheckCircle size={20} color={colors.iconLight} />;
      case 'bonus':
        return <TrendingUp size={20} color={colors.iconLight} />;
      case 'referral':
        return <UserPlus size={20} color={colors.iconLight} />;
      default:
        return <Clock size={20} color={colors.iconLight} />;
    }
  };
  
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>House Points</Text>
        <Text style={styles.subtitle}>Manage your HP balance</Text>
      </View>
      
      <View style={styles.balanceCard}>
        <LinearGradient
          colors={[colors.primary, '#034694']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceGradient}
        >
          <Text style={styles.balanceTitle}>Your Balance</Text>
          
          <View style={styles.balanceRow}>
            <PointsBadge amount={user?.housePoints || 0} size="large" />
          </View>
          
          <View style={styles.balanceActions}>
            <Button
              label="Buy Points"
              onPress={handleBuyPoints}
              variant="primary"
              size="small"
              icon={<Coins size={16} color={colors.iconLight} />}
              style={styles.balanceButton}
            />
            
            <Button
              label="Earn Points"
              onPress={handleAddListing}
              variant="outline"
              size="small"
              icon={<PlusCircle size={16} color={colors.primary} />}
              style={styles.balanceButton}
              textStyle={{ color: colors.text }}
            />
          </View>
        </LinearGradient>
      </View>
      
      <View style={styles.plansSection}>
        <Text style={styles.sectionTitle}>Points Plans</Text>
        
        <View style={styles.planCard}>
          <View style={styles.planHeader}>
            <Text style={styles.planName}>Free Plan</Text>
            <Text style={styles.planPrice}>₦0</Text>
          </View>
          <Text style={styles.planDescription}>Get started at no cost</Text>
          
          <View style={styles.planFeatures}>
            <View style={styles.planFeature}>
              <CheckCircle size={16} color={colors.verified} />
              <Text style={styles.planFeatureText}>Browse nearby listings on the map</Text>
            </View>
            <View style={styles.planFeature}>
              <CheckCircle size={16} color={colors.verified} />
              <Text style={styles.planFeatureText}>Save & bookmark favorite houses</Text>
            </View>
            <View style={styles.planFeature}>
              <CheckCircle size={16} color={colors.verified} />
              <Text style={styles.planFeatureText}>Earn 50 HP Free on sign-up!</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.planCard}>
          <View style={styles.planHeader}>
            <Text style={styles.planName}>HP Unlock</Text>
            <Text style={styles.planSubtitle}>Pay-As-You-Go</Text>
          </View>
          <Text style={styles.planDescription}>Buy HP when you need it</Text>
          
          <View style={styles.unlockOptions}>
            <View style={styles.unlockOption}>
              <Text style={styles.unlockTitle}>Unlock One Listing</Text>
              <View style={styles.unlockPricing}>
                <Text style={styles.unlockPoints}>100 HP</Text>
                <Text style={styles.unlockPrice}>(₦500)</Text>
              </View>
            </View>
            
            <View style={[styles.unlockOption, styles.popularOption]}>
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>Popular</Text>
              </View>
              <Text style={styles.unlockTitle}>Unlock Three Listings</Text>
              <View style={styles.unlockPricing}>
                <Text style={styles.unlockPoints}>250 HP</Text>
                <Text style={styles.unlockPrice}>(₦1,200)</Text>
              </View>
            </View>
            
            <View style={styles.unlockOption}>
              <Text style={styles.unlockTitle}>Unlock Five Listings</Text>
              <View style={styles.unlockPricing}>
                <Text style={styles.unlockPoints}>400 HP</Text>
              </View>
            </View>
          </View>
          
          <Button
            label="Buy House Points"
            onPress={handleBuyPoints}
            variant="primary"
            icon={<Coins size={18} color={colors.iconLight} />}
            style={styles.buyButton}
          />
        </View>
      </View>
      
      <View style={styles.earnSection}>
        <Text style={styles.sectionTitle}>How to Earn Free HP</Text>
        
        <View style={styles.earnGrid}>
          <View style={styles.earnCard}>
            <View style={[styles.earnIconContainer, { backgroundColor: colors.primary }]}>
              <Award size={24} color={colors.iconLight} />
            </View>
            <Text style={styles.earnTitle}>Sign-Up Bonus</Text>
            <Text style={styles.earnPoints}>50 HP</Text>
            <Text style={styles.earnDescription}>Just create an account</Text>
          </View>
          
          <View style={styles.earnCard}>
            <View style={[styles.earnIconContainer, { backgroundColor: colors.referral }]}>
              <UserPlus size={24} color={colors.iconLight} />
            </View>
            <Text style={styles.earnTitle}>Refer a Friend</Text>
            <Text style={styles.earnPoints}>100 HP</Text>
            <Text style={styles.earnDescription}>Per successful referral</Text>
          </View>
          
          <View style={styles.earnCard}>
            <View style={[styles.earnIconContainer, { backgroundColor: colors.verified }]}>
              <Home size={24} color={colors.iconLight} />
            </View>
            <Text style={styles.earnTitle}>List a Property</Text>
            <Text style={styles.earnPoints}>200 HP</Text>
            <Text style={styles.earnDescription}>For verified listings</Text>
          </View>
          
          <View style={styles.earnCard}>
            <View style={[styles.earnIconContainer, { backgroundColor: colors.secondary }]}>
              <Edit3 size={24} color={colors.iconLight} />
            </View>
            <Text style={styles.earnTitle}>Complete Profile</Text>
            <Text style={styles.earnPoints}>30 HP</Text>
            <Text style={styles.earnDescription}>Update all your details</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.transactionsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Transaction History</Text>
        </View>
        
        <View style={styles.transactionsList}>
          {Object.keys(groupedTransactions).length > 0 ? (
            Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
              <View key={date} style={styles.transactionGroup}>
                <Text style={styles.transactionDate}>{date}</Text>
                
                {dayTransactions.map((transaction, index) => (
                  <View key={index} style={styles.transactionItem}>
                    <View style={[
                      styles.transactionIconContainer,
                      { backgroundColor: getTransactionColor(transaction.type) }
                    ]}>
                      {renderTransactionIcon(transaction.type)}
                    </View>
                    
                    <View style={styles.transactionDetails}>
                      <Text style={styles.transactionTitle}>{transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</Text>
                      <Text style={styles.transactionDescription}>{transaction.description}</Text>
                    </View>
                    
                    <Text style={[
                      styles.transactionAmount,
                      transaction.type === 'spent' ? styles.transactionNegative : styles.transactionPositive
                    ]}>
                      {transaction.type === 'spent' ? '-' : '+'}{transaction.amount} HP
                    </Text>
                  </View>
                ))}
              </View>
            ))
          ) : (
            <View style={styles.emptyTransactions}>
              <Text style={styles.emptyTransactionsText}>No transactions yet</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

// Helper function to get transaction icon background color
const getTransactionColor = (type: string) => {
  switch (type) {
    case 'purchase':
      return colors.housePoints;
    case 'earn':
      return colors.verified;
    case 'unlock':
      return colors.primary;
    case 'bonus':
      return colors.accent;
    case 'referral':
      return colors.referral;
    default:
      return colors.textSecondary;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  balanceCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  balanceGradient: {
    padding: 16,
  },
  balanceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.iconLight,
    marginBottom: 16,
  },
  balanceRow: {
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  plansSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  planPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  planSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  planDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  planFeatures: {
    marginTop: 8,
  },
  planFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  planFeatureText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  unlockOptions: {
    marginTop: 8,
    marginBottom: 16,
  },
  unlockOption: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  popularOption: {
    borderColor: colors.popular,
    borderWidth: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: 12,
    backgroundColor: colors.popular,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  popularText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.iconLight,
  },
  unlockTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  unlockPricing: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unlockPoints: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  unlockPrice: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  buyButton: {
    marginTop: 8,
  },
  earnSection: {
    marginBottom: 24,
  },
  earnGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  earnCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  earnIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  earnTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  earnPoints: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  earnDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  transactionsContainer: {
    flex: 1,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  transactionsList: {
    flex: 1,
  },
  transactionGroup: {
    marginBottom: 16,
  },
  transactionDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  transactionDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionNegative: {
    color: colors.unverified,
  },
  transactionPositive: {
    color: colors.verified,
  },
  emptyTransactions: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTransactionsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
});