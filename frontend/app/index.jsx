import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View
      style={styles.container}
    >
      <Text style={styles.text}> this </Text>
      <Link href="/(auth)/signup">signup</Link>
      <Link href="/(auth)">login</Link>
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