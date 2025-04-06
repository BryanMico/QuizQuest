import React, { useEffect } from "react";
import { View, Image } from "react-native";
import SplashStyles from "../../styles/SplashStyles";

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={SplashStyles.splashcontainer}>
      <Image
        source={require("../../assets/QuizQuestIcon.png")}
        style={SplashStyles.splash}
        resizeMode="cover"
      />
    </View>
  );
};

export default SplashScreen;