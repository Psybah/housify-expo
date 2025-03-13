import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { 
  HelpCircle, 
  MessageSquare, 
  Phone, 
  Mail, 
  ChevronDown,
  ChevronUp,
  Send
} from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';

// FAQ data
const faqs = [
  {
    question: "How do I earn free points?",
    answer: "You can earn free points by adding new listings, getting your listings verified, referring friends, or completing your profile information. Free points can be used to unlock basic listings."
  },
  {
    question: "What's the difference between free and paid points?",
    answer: "Free points can be earned through activities on the platform and can be used to unlock basic listings. Paid points are purchased and can be used to unlock premium verified listings with higher-quality information."
  },
  {
    question: "How do I get my listing verified?",
    answer: "When adding a listing, enable the verification option. Our team will contact the landlord to verify the information. Verified listings get more visibility and earn you bonus points."
  },
  {
    question: "Can I delete my listing?",
    answer: "Yes, you can delete your listings from your profile page. Go to 'My Listings', find the listing you want to remove, and use the delete option."
  },
  {
    question: "How long does verification take?",
    answer: "Verification typically takes 1-3 business days. We'll notify you once the process is complete or if we need additional information."
  },
  {
    question: "Are my contact details shared with others?",
    answer: "Your contact details are only shared with landlords when you unlock their listing. You can control your privacy settings in the Privacy & Security section."
  },
];

export default function SupportScreen() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  const toggleFaq = (index: number) => {
    if (expandedFaq === index) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(index);
    }
  };
  
  const handleSendMessage = async () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Missing Information', 'Please provide both a subject and message');
      return;
    }
    
    setIsSending(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Message Sent',
        'Thank you for contacting us. We will respond to your inquiry within 24 hours.',
        [
          {
            text: 'OK',
            onPress: () => {
              setSubject('');
              setMessage('');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        
        {faqs.map((faq, index) => (
          <TouchableOpacity 
            key={index}
            style={styles.faqItem}
            onPress={() => toggleFaq(index)}
          >
            <View style={styles.faqHeader}>
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              {expandedFaq === index ? (
                <ChevronUp size={20} color={colors.primary} />
              ) : (
                <ChevronDown size={20} color={colors.textSecondary} />
              )}
            </View>
            
            {expandedFaq === index && (
              <Text style={styles.faqAnswer}>{faq.answer}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.sectionDescription}>
          Have a question or need help? Send us a message and we'll get back to you.
        </Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Subject</Text>
          <TextInput
            style={styles.input}
            placeholder="What's your inquiry about?"
            value={subject}
            onChangeText={setSubject}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Message</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe your issue or question..."
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>
        
        <Button
          title="Send Message"
          onPress={handleSendMessage}
          loading={isSending}
          disabled={isSending}
          icon={<Send size={20} color={colors.background} />}
          style={styles.sendButton}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Other Ways to Reach Us</Text>
        
        <View style={styles.contactItem}>
          <View style={styles.contactIconContainer}>
            <Phone size={20} color={colors.iconLight} />
          </View>
          <View style={styles.contactTextContainer}>
            <Text style={styles.contactItemTitle}>Phone Support</Text>
            <Text style={styles.contactItemValue}>+234 801 234 5678</Text>
            <Text style={styles.contactItemDescription}>Available Mon-Fri, 9am-5pm WAT</Text>
          </View>
        </View>
        
        <View style={styles.contactItem}>
          <View style={[styles.contactIconContainer, { backgroundColor: colors.secondary }]}>
            <Mail size={20} color={colors.iconLight} />
          </View>
          <View style={styles.contactTextContainer}>
            <Text style={styles.contactItemTitle}>Email Support</Text>
            <Text style={styles.contactItemValue}>support@housify.ng</Text>
            <Text style={styles.contactItemDescription}>We respond within 24 hours</Text>
          </View>
        </View>
        
        <View style={styles.contactItem}>
          <View style={[styles.contactIconContainer, { backgroundColor: '#6C63FF' }]}>
            <MessageSquare size={20} color={colors.iconLight} />
          </View>
          <View style={styles.contactTextContainer}>
            <Text style={styles.contactItemTitle}>Live Chat</Text>
            <Text style={styles.contactItemValue}>Available in the app</Text>
            <Text style={styles.contactItemDescription}>Chat with our support team in real-time</Text>
          </View>
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
  sectionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 12,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    lineHeight: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 120,
  },
  sendButton: {
    marginTop: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactTextContainer: {
    flex: 1,
  },
  contactItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  contactItemValue: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: 2,
  },
  contactItemDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});