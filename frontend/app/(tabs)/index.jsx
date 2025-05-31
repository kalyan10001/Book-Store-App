import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useAuthStore } from '@/store/auth.store'

export default function index() {

  const {logout}=useAuthStore();

  return (
    <View>
      <TouchableOpacity onPress={logout}>
        <Text>logout</Text>
      </TouchableOpacity>
    </View>
  )
}