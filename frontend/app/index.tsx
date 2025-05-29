import { StyleSheet, Text, View } from "react-native";
import {Image} from "expo-image";

export default function Index() {
  return (
    <View
      style={styles.container}
    >
      <Text style={styles.text}> this </Text>
      <Image source={require('../assets/images/favicon.png')} style={styles.image}/>
    </View>
  );
}

const styles=StyleSheet.create({
  container:{
        flex: 1,
        color:"blue",
        justifyContent: "center",
        alignItems: "center",
      },
      text:{
        color:"red",
      },
      image: {
    width: 200, height: 200
  }

});