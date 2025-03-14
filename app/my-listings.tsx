import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, Home, Plus, Edit, Trash2, Clock, FileEdit, Check } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Image } from 'expo-image';
import { Button } from '@/components/Button';
import { usePropertyStore } from '@/store/property-store';
import { useAuthStore } from '@/store/auth-store';
import { Property } from '@/types/property';

export default function MyListingsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { 
    properties, 
    draftProperties, 
    fetchDraftProperties,
    deleteDraftProperty
  } = usePropertyStore();
  
  const [loading, setLoading] = useState(true);
  const [myVerifiedListings, setMyVerifiedListings] = useState<Property[]>([]);
  const [myDraftListings, setMyDraftListings] = useState<Property[]>([]);
  
  useEffect(() => {
    const loadProperties = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      await fetchDraftProperties();
      
      // Get verified properties submitted by the user
      const verifiedProps = properties.filter(property => 
        property.submittedBy === user.id || property.landlordId === user.id
      );
      
      setMyVerifiedListings(verifiedProps);
      setMyDraftListings(draftProperties);
      setLoading(false);
    };
    
    loadProperties();
  }, [user, properties, draftProperties]);
  
  const handleDeleteDraft = (propertyId: string) => {
    Alert.alert(
      'Delete Draft',
      'Are you sure you want to delete this draft? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDraftProperty(propertyId);
              // Update the local state
              setMyDraftListings(myDraftListings.filter(p => p.id !== propertyId));
            } catch (error) {
              Alert.alert('Error', 'Failed to delete draft. Please try again.');
            }
          }
        }
      ]
    );
  };
  
  const handleEditDraft = (propertyId: string) => {
    // Navigate to edit screen (would be implemented in a real app)
    Alert.alert('Edit Draft', 'Edit functionality would be implemented here.');
  };
  
  const renderPropertyItem = ({ item }: { item: Property }) => {
    const isDraft = item.status === 'draft' || item.status === 'pending-verification';
    
    const statusColors = {
      'draft': Colors.neutral.gray,
      'pending-verification': Colors.status.warning,
      'available': Colors.status.success
    };
    
    const statusText = {
      'draft': 'Draft',
      'pending-verification': 'Pending Verification',
      'available': 'Verified & Listed'
    };
    
    const statusIcon = {
      'draft': <FileEdit size={14} color={statusColors[item.status as keyof typeof statusColors]} />,
      'pending-verification': <Clock size={14} color={statusColors[item.status as keyof typeof statusColors]} />,
      'available': <Check size={14} color={statusColors[item.status as keyof typeof statusColors]} />
    };
    
    return (
      <View style={styles.propertyItem}>
        <TouchableOpacity 
          style={styles.propertyContent}
          onPress={() => router.push(`/property/${item.id}`)}
        >
          <View style={styles.propertyImageContainer}>
            <Image
              source={{ uri: item.images[0] || 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0' }}
              style={styles.propertyImage}
              contentFit="cover"
            />
          </View>
          
          <View style={styles.propertyDetails}>
            <Text style={styles.propertyTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.propertyPrice}>₦{item.price.toLocaleString('en-NG')}/yr</Text>
            <View style={styles.propertyStatus}>
              {statusIcon[item.status as keyof typeof statusIcon]}
              <Text style={[
                styles.propertyStatusText, 
                { color: statusColors[item.status as keyof typeof statusColors] }
              ]}>
                {statusText[item.status as keyof typeof statusText]}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        
        {isDraft && (
          <View style={styles.propertyActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleEditDraft(item.id)}
            >
              <Edit size={18} color={Colors.primary.main} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleDeleteDraft(item.id)}
            >
              <Trash2 size={18} color={Colors.status.error} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };
  
  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['right', 'left', 'top', 'bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background.card} />
        <Stack.Screen 
          options={{
            title: 'My Listings',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <ArrowLeft size={24} color={Colors.text.primary} />
              </TouchableOpacity>
            ),
            headerStyle: {
              backgroundColor: Colors.background.card,
            },
            headerTitleStyle: {
              color: Colors.text.primary,
              fontWeight: '600',
            },
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary.main} />
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container} edges={['right', 'left', 'top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background.card} />
      <Stack.Screen 
        options={{
          title: 'My Listings',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: Colors.background.card,
          },
          headerTitleStyle: {
            color: Colors.text.primary,
            fontWeight: '600',
          },
        }}
      />
      
      <FlatList
        data={[...myDraftListings, ...myVerifiedListings]}
        keyExtractor={(item) => item.id}
        renderItem={renderPropertyItem}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>My Property Listings</Text>
            <Text style={styles.headerSubtitle}>
              Manage your property listings and drafts
            </Text>
            <Button
              title="Add New Listing"
              onPress={() => router.push('/add-listing')}
              icon={<Plus size={18} color={Colors.neutral.white} />}
              style={styles.addButton}
            />
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Home size={64} color={Colors.neutral.lightGray} />
            <Text style={styles.emptyTitle}>No listings yet</Text>
            <Text style={styles.emptyText}>
              Start adding your properties to earn points when they get verified.
            </Text>
            <View style={styles.emptyButtonContainer}>
              <Button
                title="Add New Listing"
                onPress={() => router.push('/add-listing')}
                icon={<Plus size={18} color={Colors.neutral.white} />}
                fullWidth
              />
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    backgroundColor: Colors.background.card,
    marginBottom: 16,
    borderRadius: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  addButton: {
    marginTop: 8,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  propertyItem: {
    backgroundColor: Colors.background.card,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  propertyContent: {
    flexDirection: 'row',
    padding: 12,
  },
  propertyImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
  },
  propertyImage: {
    width: '100%',
    height: '100%',
  },
  propertyDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  propertyPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary.main,
  },
  propertyStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  propertyStatusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  propertyActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.neutral.lightGray,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 40,
    marginBottom: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButtonContainer: {
    width: '100%',
    paddingHorizontal: 16,
  },
});