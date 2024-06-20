// NaviButton.tsx
import React from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';  // 使用Ionicons图标，你可以选择其他图标库

const NaviButton = ({
  focused,
  color,
  size,
  iconName,
  gradient,
  backgroundImage
}) => (
  <TouchableOpacity
    onPress={() => {}}
    style={{
      borderRadius: 2,
      overflow: 'hidden',  // 使得borderRadius应用于背景图像和渐变
    }}
  >
    {backgroundImage && <Image source={backgroundImage} style={{ position: 'absolute', width: '100%', height: '100%' }} />}
    {gradient ? (
      <LinearGradient
        colors={gradient}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        {iconName && <Icon name={iconName} size={size} color={color} />}
      </LinearGradient>
    ) : (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {iconName && <Icon name={iconName} size={size} color={color} />}
      </View>
    )}
  </TouchableOpacity>
);

export default NaviButton;
