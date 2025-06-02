import { FlatList, View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from '@/assets/styles/home.styles';
import { API_URL } from '@/constants/api';
import { useAuthStore } from '@/store/auth.store';
import { Image } from 'expo-image';

export default function IndexScreen() {
  const { token } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [books, setBooks] = useState([]);

  const fetchBooks = async () => {
    try {
      setLoading(true);


      const response = await fetch(`${API_URL}/api/books`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log("lee ",token);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch books');
      }

      setBooks(data.books || []);
    } catch (error) {
      console.log('Error fetching books:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchBooks();
  }, [token]);

  const renderItem = ({ item }) => (
    <View style={styles.bookCard}>
      <View style={styles.bookHeader}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: item.user?.profileImage }}
            style={styles.avatar}
          />
          <Text style={styles.username}>{item.user?.username}</Text>
        </View>
      </View>

      <View style={styles.bookImageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.bookImage}
          contentFit="cover"
        />
      </View>

      <View style={styles.bookDetails}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookCaption}>{item.caption}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={fetchBooks}
      />
    </View>
  );
}
