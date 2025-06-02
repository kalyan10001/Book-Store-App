import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { API_URL } from '@/constants/api';
import { useAuthStore } from '../../store/auth.store.js'

export default function Profile() {


  useEffect(() => {
    const {token}=useAuthStore();
    const fetchBooks = async () => {
      console.log("📦 Fetching books with token:", token);

      try {
        const res = await fetch(`${API_URL}/api/books?page=1&limit=5`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("✅ Fetched books:", data);

        if (!res.ok) {
          throw new Error(data.message || "Something went wrong");
        }
      } catch (err) {
        console.error("❌ Error fetching books:", err.message);
      }
    };

    fetchBooks();
  },[]);

  return (
    <View>
      <TouchableOpacity>
        <Text>hii</Text>
      </TouchableOpacity>
    </View>
  );
}
