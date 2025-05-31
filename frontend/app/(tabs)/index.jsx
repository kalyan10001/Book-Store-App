import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import styles from '@/assets/styles/home.styles';
import { API_URL } from '@/constants/api';
import { useAuthStore } from '@/store/auth.store';

export default function Index() {
  const { token } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [books, setBooks] = useState([]);


useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else if (pageNum === 1) setLoading(true);

      const response = await fetch(`${API_URL}/api/books?page=${pageNum}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      console.log("Response Data:", data);

      if (!response.ok) throw new Error(data.message || 'Failed to Fetch Books');

      setBooks(prevBooks => (refresh || pageNum === 1 ? data.books : [...prevBooks, ...data.books]));
      setHasMore(pageNum < data.totalPages);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching books', error.message);
    } finally {
      if (refresh) setRefreshing(false);
      else setLoading(false);
    }
  };


  const handleLoadMore = () => {
    if (hasMore && !loading && !refreshing) {
      fetchBooks(page + 1);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.bookCard}>
      <View style={styles.bookHeader}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: item.user.profileImage }}
            style={styles.avatar}
          />
          <Text style={styles.username}>{item.user.username}</Text>
        </View>
      </View>

      <View style={styles.bookImageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.bookImage}
          contentFit="cover"
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading && books.length === 0 ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <FlatList
          data={books}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          onRefresh={() => fetchBooks(1, true)}
          refreshing={refreshing}
          ListFooterComponent={
            loading && books.length > 0 ? (
              <ActivityIndicator size="small" color="#000" />
            ) : null
          }
        />
      )}
    </View>
  );
}
