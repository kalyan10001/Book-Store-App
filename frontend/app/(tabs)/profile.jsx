import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Image } from 'expo-image';
import styles from '@/assets/styles/profile.styles';
import { useAuthStore } from '@/store/auth.store';
import { API_URL } from '@/constants/api';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const { token, user, logout } = useAuthStore();
  console.log("user",user);
  const navigation = useNavigation();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserBooks = async () => {
    try {
      const response = await fetch(`${API_URL}/api/books/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch books');
      }

      setBooks(data || []);
    } catch (error) {
      console.error('Error fetching books:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  useEffect(() => {
    if (token) fetchUserBooks();
  }, [token]);

  const renderItem = ({ item }) => (
    <View style={styles.bookItem}>
      <Image source={{ uri: item.image }} style={styles.bookImage} contentFit="cover" />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookCaption}>{item.caption}</Text>
        <Text style={styles.bookDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#666" />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.booksTitle}>Profile</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={20} color="white" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>


      <View style={styles.profileHeader}>
        <Image
          source={{ uri: user?.profileImage || 'https://via.placeholder.com/150' }}
          style={styles.profileImage}
          contentFit="cover"
        />
        <View style={styles.profileInfo}>
          <Text style={styles.username}>{user?.username || 'Anonymous'}</Text>
          <Text style={styles.email}>{user?.email || 'Not provided'}</Text>
          <Text style={styles.memberSince}>Member since {new Date(user?.createdAt).toLocaleDateString()}</Text>
        </View>
      </View>


      <View style={styles.booksHeader}>
        <Text style={styles.booksTitle}>Your Posts</Text>
        <Text style={styles.booksCount}>{books.length} items</Text>
      </View>

      {books.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You haven’t posted any books yet.</Text>
        </View>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.booksList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
