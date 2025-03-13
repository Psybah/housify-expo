import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Coins, TrendingUp, TrendingDown, CreditCard, ArrowRight } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { PointsBadge } from '@/components/PointsBadge';
import { Button } from '@/components/Button';
import { useAuthStore } from '@/store/auth-store';
import { usePointsStore } from '@/store/points-store';
import { PointsTransaction } from '@/types';

export default function PointsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { transactions, packages, fetchTransactions, fetchPackages, isLoading } = usePointsStore();
  
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    fetchTransactions();
    fetchPackages();
  }, []);
  
  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchTransactions(), fetchPackages()]);
    setRefreshing(false);
  };
  
  const handleBuyPoints = () => {
    router.push('/buy-points');
  };
  
  const renderTransactionItem = ({ item }: { item: PointsTransaction }) => {
    const isEarned = item.type === 'earned' || item.type === 'purchased';
    
    return (
      <View style={styles.transactionItem}>
        <View style={styles.transactionIconContainer}>
          {isEarned ? (
            <TrendingUp size={20} color={colors.success} />
          ) : (
            <TrendingDown size={20} color={colors.error} />
          )}
        </View>
        
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionDescription}>{item.description}</Text>
          <Text style={styles.transactionDate}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        
        <Text style={[
          styles.transactionAmount,
          { color: isEarned ? colors.success : colors.error }
        ]}>
          {isEarned ? '+' : '-'}{item.amount} {item.pointsType === 'free' ? 'F' : 'P'}-Points
        </Text>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Points Balance</Text>
        
        <View style={styles.balanceContainer}>
          <View style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <Coins size={20} color={colors.fPoints} />
              <Text style={styles.balanceTitle}>Free Points</Text>
            </View>
            <Text style={styles.balanceAmount}>{user?.fPoints || 0}</Text>
            <Text style={styles.balanceDescription}>Use for unverified listings</Text>
          </View>
          
          <View style={styles.balanceCard}>
            <View style={styles.balanceHeader}>
              <Coins size={20} color={colors.pPoints} />
              <Text style={styles.balanceTitle}>Paid Points</Text>
            </View>
            <Text style={styles.balanceAmount}>{user?.pPoints || 0}</Text>
            <Text style={styles.balanceDescription}>Use for verified listings</Text>
          </View>
        </View>
        
        <Button
          title="Buy More Points"
          onPress={handleBuyPoints}
          icon={<CreditCard size={18} color={colors.text} />}
          style={styles.buyButton}
        />
      </View>
      
      <View style={styles.transactionsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Transaction History</Text>
        </View>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
            renderItem={renderTransactionItem}
            contentContainerStyle={styles.transactionsList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No transactions yet</Text>
                <Text style={styles.emptySubtext}>Your transaction history will appear here</Text>
              </View>
            }
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )}
      </View>
      
      <View style={styles.earnPointsCard}>
        <View style={styles.earnPointsContent}>
          <Text style={styles.earnPointsTitle}>Earn More Points</Text>
          <Text style={styles.earnPointsDescription}>
            Add house listings to earn free points and help others find homes
          </Text>
        </View>
        
        <TouchableOpacity 
          style={styles.earnPointsButton}
          onPress={() => router.push('/add-listing')}
        >
          <Text style={styles.earnPointsButtonText}>Add Listing</Text>
          <ArrowRight size={16} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  balanceCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginRight: 8,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceTitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  balanceDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  buyButton: {
    marginTop: 8,
  },
  transactionsContainer: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionsList: {
    flexGrow: 1,
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
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  earnPointsCard: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  earnPointsContent: {
    flex: 1,
  },
  earnPointsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  earnPointsDescription: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.8,
  },
  earnPointsButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  earnPointsButtonText: {
    color: colors.text,
    fontWeight: 'bold',
    marginRight: 4,
  },
});