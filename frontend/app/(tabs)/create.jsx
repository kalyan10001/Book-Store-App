import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import styles from '../../assets/styles/create.styles.js';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '@/constants/colors.js';
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { API_URL } from '@/constants/api.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth.store.js';

export default function Create() {
  const [title, setTitle] = useState('');
  const [rating, setRating] = useState(3);
  const [image,setImage]=useState(null);
  const [imageBase64,setImageBase64]=useState(null);
  const [caption,setCaption]=useState("");
  const [IsLoading,setIsLoading]=useState(false);

const router=useRouter();
const {token}=useAuthStore();
console.log("token",token);

  const pickImage=async()=>{
    try {
      if(Platform.OS !=="web"){
        const {status}=await ImagePicker.requestMediaLibraryPermissionsAsync();
        if(status !== "granted"){
          Alert.alert("Permissions Denied","we need camera roll permissions to upload an image");
          return;
        }
      }
      const result=await ImagePicker.launchImageLibraryAsync({
        mediaTypes:"images",
        allowsEditing:true,
        aspect:[4,3],
        quality:0.3,
        base64:true,
      })

      if(!result.canceled){
        setImage(result.assets[0].uri);

        if(result.assets[0].base64){
          setImageBase64(result.assets[0].base64);
        }else{
          const base64=await FileSystem.readAsStringAsync(result.assets[0].uri,{
            encoding: FileSystem.EncodingType.Base64,
          });
          setImageBase64(base64);
        }
      }
    } catch (error) {
      console.log("Error picking image",error);
      Alert.alert("Error","There was problem selecting your image");
    }
  }

  const renderRatingPicker = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => setRating(i)}
          style={styles.starButton}
        >
          <Ionicons
            name={i <= rating ? 'star' : 'star-outline'}
            size={32}
            color={i <= rating ? '#f4b400' : COLORS.textSecondary}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  const handleSubmit= async ()=>{
    if(!title || !caption || !imageBase64){
      Alert.alert("Error","Please Fill All Fields");
      return;
    }
    try {
      setIsLoading(true);
      console.log("Submitting post", {title, caption, rating, imageType, token});

     console.log("image URI:", image);
const uriParts = image ? image.split(".") : [];
const fileType = uriParts.length > 0 ? uriParts[uriParts.length - 1] : null;
const imageType = fileType ? `image/${fileType.toLowerCase()}` : "image/jpeg";


      const imageDataUrl=`data:${imageType};base64,${imageBase64}`;

      
      const response=await fetch(`${API_URL}/api/books`,{
        method:"POST",
        headers:{
          Authorization:`Bearer ${token}`,
          "Content-Type":"application/json",
        },
        body:JSON.stringify({
          title,
          caption,
          rating:rating.toString(),
          image:imageDataUrl,
        }),
      })

      const data=await response.json();
      if(!response.ok){
        throw new Error(data.message || "something went wrong");
      }
      Alert.alert("Success","your book recommendation has posted successfully");
      setTitle("");
      setCaption("");
      setImage(null);
      setRating(3);
      setImageBase64(null);
    } catch (error) {
      console.log("Error creating post",error);
      Alert.alert("Error",error.message || "something went wrong");
    }
    finally{
      setIsLoading(false);
    }      
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container} style={styles.scrollViewStyle}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Book Recommendation</Text>
            <Text style={styles.subtitle}>Share Your Favourite Reads With Others</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Title</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="book-outline"
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Book Title"
                  placeholderTextColor={COLORS.placeholderText}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Your Rating</Text>
              <View style={{ flexDirection: 'row', gap:'10' }}>
                {renderRatingPicker()}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Book Image</Text>
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                  <Image source={{uri:image}} style={styles.previewImage}/>
                ):(
                  <View style={styles.placeholderContainer}>
                    <Ionicons 
                    name='image-outline' 
                    size={40} 
                    color={COLORS.textSecondary}/>
                    <Text style={styles.placeholderText}>Tap to select Image</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Caption</Text>
              <TextInput
              style={styles.textArea}
              placeholder='Write Your review about Book'
              placeholderTextColor={COLORS.placeholderText}
              value={caption}
              onChangeText={setCaption}
              multiline
              />
            </View>

            <TouchableOpacity 
            style={styles.button}
            disabled={IsLoading}
            onPress={handleSubmit}>
              {IsLoading?(
                <ActivityIndicator color={COLORS.white}/>
              ) : (
                <>
                <Ionicons
                name='cloud-upload-outline'
                size={20}
                color={COLORS.white}
                style={styles.buttonIcon}/>
                <Text style={styles.buttonText}>Share</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
