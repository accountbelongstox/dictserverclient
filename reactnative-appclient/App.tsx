// import React, { useRef } from 'react';
// import { View, Text, TouchableOpacity, Animated } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// const Tab = createBottomTabNavigator();

// const AnimatedIcon = ({ name, onPress }) => {
//   const scaleValue = useRef(new Animated.Value(0)).current;

//   const animateIcon = () => {
//     Animated.sequence([
//       Animated.timing(scaleValue, {
//         toValue: 1,
//         duration: 150,
//         useNativeDriver: true,
//       }),
//       Animated.timing(scaleValue, {
//         toValue: 0,
//         duration: 150,
//         useNativeDriver: true,
//       }),
//     ]).start();
//     onPress();
//   };

//   return (
//     <TouchableOpacity onPress={animateIcon}>
//       <Animated.Text
//         style={{
//           transform: [{
//             scale: scaleValue.interpolate({
//               inputRange: [0, 1],
//               outputRange: [1, 1.5],
//             })
//           }],
//           fontSize: 24,
//         }}
//       >
//         {name}
//       </Animated.Text>
//     </TouchableOpacity>
//   );
// };

// const Screen = ({ name }) => (
//   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//     <Text>{name} Screen</Text>
//   </View>
// );

// const HomeScreen = () => <Screen name="Home" />;
// const SettingsScreen = () => <Screen name="Settings" />;
// const ProfileScreen = () => <Screen name="Profile" />;
// const ExploreScreen = () => <Screen name="Explore" />;
// const MoreScreen = () => <Screen name="More" />;


// const BottomTabs = () => {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => (
//           <AnimatedIcon name={route.name.charAt(0)} onPress={() => { }} />
//         ),
//         tabBarActiveTintColor: 'tomato',
//         tabBarInactiveTintColor: 'gray',
//       })}
//     >
//       <Tab.Screen name="Home" component={HomeScreen} />
//       <Tab.Screen name="Settings" component={SettingsScreen} />
//       <Tab.Screen name="Profile" component={ProfileScreen} />
//       <Tab.Screen name="Explore" component={ExploreScreen} />
//       <Tab.Screen name="More" component={MoreScreen} />
//     </Tab.Navigator>
//   );
// };

// export default function App() {
//   return (
//     <NavigationContainer>
//       <BottomTabs />
//     </NavigationContainer>
//   );
// }



// import React from 'react';
// import { View, Text, Button } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import { createStackNavigator } from '@react-navigation/stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// const Drawer = createDrawerNavigator();
// const Stack = createStackNavigator();
// const BottomTab = createBottomTabNavigator();

// const PageScreen = ({ route, navigation }) => (
//   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//     <Text>{route.name} Page</Text>
//     {route.name === 'TopPage3' && (
//       <Button
//         title="Toggle Drawer"
//         onPress={() => {
//           if (navigation.isDrawerOpen) {
//             navigation.closeDrawer();
//           } else {
//             navigation.openDrawer();
//           }
//         }}
//       />
//     )}
//   </View>
// );


// const createTabNavigator = (prefix) => () => {
//   return (
//     <BottomTab.Navigator>
      
//   //请将该处抽出来，不要使用循环，并且告诉我怎么给每个部底部加样式，图片，文字，按钮，并独立成一个文件
//       {[...Array(5)].map((_, idx) => (
//         <BottomTab.Screen
//           name={`${prefix}Page${idx + 1}`}
//           component={PageScreen}
//           key={idx}
//         />
//       ))}
//     </BottomTab.Navigator>
//   );
// };

// const BottomTabs = createTabNavigator('Bottom');
// const TopTabs = createTabNavigator('Top');

// const StackNavigator = () => (
//   <Stack.Navigator
//     screenOptions={{
//       headerShown: false,
//       cardStyle: { opacity: 1 },
//       cardOverlayEnabled: false,
//       cardStyleInterpolator: ({ current: { progress } }) => {
//         return {
//           cardStyle: {
//             opacity: progress.interpolate({
//               inputRange: [0, 1],
//               outputRange: [0, 1],
//             }),
//           },
//         };
//       },
//     }}
//   >
//     <Stack.Screen name="TopTabs" component={TopTabs} />
//     <Stack.Screen name="BottomTabs" component={BottomTabs} />
//   </Stack.Navigator>
// );

// const DrawerNavigator = () => (
//   <Drawer.Navigator
//     screenOptions={{
//       headerShown: false,
//     }}
//     initialRouteName="StackNavigator">
//     <Drawer.Screen name="StackNavigator" component={StackNavigator} />
//     {/* Add more Drawer.Screen components here if needed */}
//   </Drawer.Navigator>
// );

// export default function App() {
//   return (
//     <NavigationContainer>
//       <DrawerNavigator />
//     </NavigationContainer>
//   );
// }




import 'react-native-gesture-handler';
import React from 'react';

import {DataProvider} from './src/hooks';
import AppNavigation from './src/navigation/App';

export default function App() {
  return (
    <DataProvider>
      <AppNavigation />
    </DataProvider>
  );
}
