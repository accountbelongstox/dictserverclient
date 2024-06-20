import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Linking, StyleSheet } from 'react-native';

import {
  useDrawerStatus,
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';

import Screens from './Screens';
import { Block, Text, Switch, Button, Image } from '../components';
import { useData, useTheme, useTranslation } from '../hooks';

const Drawer = createDrawerNavigator();

/* drawer menu screens navigation */
const ScreensStack = () => {
  const { colors } = useTheme();
  const isDrawerOpen = useDrawerStatus();
  const animation = useRef(new Animated.Value(0)).current;

  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.88],
  });

  const borderRadius = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 16],
  });

  const animatedStyle = {
    borderRadius: borderRadius,
    transform: [{ scale: scale }],
  };

  useEffect(() => {
    Animated.timing(animation, {
      duration: 200,
      useNativeDriver: true,
      toValue: isDrawerOpen ? 1 : 0,
    }).start();
  }, [isDrawerOpen, animation]);

  return (
    <Animated.View
      style={StyleSheet.flatten([
        animatedStyle,
        {
          flex: 1,
          overflow: 'hidden',
          borderColor: colors.card,
          borderWidth: isDrawerOpen ? 1 : 0,
          margin: 0,
          padding: 0,
        },
      ])}>
      {/*  */}
      <Screens />
    </Animated.View>
  );
};

/* custom drawer menu */
const DrawerContent = (
  props: DrawerContentComponentProps,
) => {
  const { navigation } = props;
  const { isDark, handleIsDark } = useData();
  const { t } = useTranslation();
  const [active, setActive] = useState('Home');
  const { assets, colors, gradients, sizes } = useTheme();
  const labelColor = isDark ? colors.white : colors.text;

  const handleNavigation = useCallback(
    (to: any) => {
      setActive(to);
      navigation.navigate(to);
    },
    [navigation, setActive],
  );

  const handleWebLink = useCallback((url: any) => Linking.openURL(url), []);

  // screen list for Drawer menu
  const screens = [
    { name: t('screens.home'), to: 'Home', icon: assets.home },
    { name: t('screens.components'), to: 'Components', icon: assets.components },
    { name: t('screens.articles'), to: 'Articles', icon: assets.document },
    { name: t('screens.rental'), to: 'Rentals', icon: assets.rental },
    { name: t('screens.profile'), to: 'Profile', icon: assets.profile },
    { name: t('screens.settings'), to: 'Settings', icon: assets.settings },
    { name: t('screens.register'), to: 'Register', icon: assets.register },
    { name: t('screens.extra'), to: 'Extra', icon: assets.extras },
  ];

  return (
    <DrawerContentScrollView
      {...props}
      scrollEnabled
      removeClippedSubviews
      renderToHardwareTextureAndroid
      contentContainerStyle={{ paddingBottom: sizes.padding }}>
      <Block paddingHorizontal={sizes.padding}>
        <Block flex={0} row align="center" marginBottom={sizes.l}>
          <Image
            radius={0}
            width={33}
            height={33}
            color={colors.text}
            source={assets.logo}
            marginRight={sizes.sm}
          />
          <Block>
            <Text size={12} semibold>
              {t('app.name')}
            </Text>
            <Text size={12} semibold>
              {t('app.native')}
            </Text>
          </Block>
        </Block>

        {screens?.map((screen, index) => {
          const isActive = active === screen.to;
          return (
            <Button
              row
              justify="flex-start"
              marginBottom={sizes.s}
              key={`menu-screen-${screen.name}-${index}`}
              onPress={() => handleNavigation(screen.to)}>
              <Block
                flex={0}
                radius={6}
                align="center"
                justify="center"
                width={sizes.md}
                height={sizes.md}
                marginRight={sizes.s}
                gradient={gradients[isActive ? 'primary' : 'white']}>
                <Image
                  radius={0}
                  width={14}
                  height={14}
                  source={screen.icon}
                  color={colors[isActive ? 'white' : 'black']}
                />
              </Block>
              <Text p semibold={isActive} color={labelColor}>
                {screen.name}
              </Text>
            </Button>
          );
        })}

        <Block
          flex={0}
          height={1}
          marginRight={sizes.md}
          marginVertical={sizes.sm}
          gradient={gradients.menu}
        />

        <Text semibold transform="uppercase" opacity={0.5}>
          {t('menu.documentation')}
        </Text>

        <Button
          row
          justify="flex-start"
          marginTop={sizes.sm}
          marginBottom={sizes.s}
          onPress={() =>
            handleWebLink('https://github.com/creativetimofficial')
          }>
          <Block
            flex={0}
            radius={6}
            align="center"
            justify="center"
            width={sizes.md}
            height={sizes.md}
            marginRight={sizes.s}
            gradient={gradients.white}>
            <Image
              radius={0}
              width={14}
              height={14}
              color={colors.black}
              source={assets.documentation}
            />
          </Block>
          <Text p color={labelColor}>
            {t('menu.started')}
          </Text>
        </Button>

        <Block row justify="space-between" marginTop={sizes.sm}>
          <Text color={labelColor}>{t('darkMode')}</Text>
          <Switch
            checked={isDark}
            onPress={(checked) => handleIsDark(checked)}
          />
        </Block>
      </Block>
    </DrawerContentScrollView>
  );
};

/* drawer menu navigation */
export default () => {
  const { isDark } = useData();
  const { gradients } = useTheme();
  return (
    <Block gradient={gradients[isDark ? 'dark' : 'light']}>
      <Drawer.Navigator
        drawerContent={(props) => <DrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          sceneContainerStyle: { backgroundColor: 'transparent' },
          drawerType: "slide",
          overlayColor: "transparent",
          drawerStyle: {
            flex: 1,
            width: '60%',
            borderRightWidth: 0,
            backgroundColor: 'transparent',
            margin: 0,
            padding: 0
          }
        }}
      >
        <Drawer.Screen
          options={{
            drawerStyle: {
              margin: 0,
              padding: 0
            }
          }}
          name="Screens"
          component={ScreensStack} />
      </Drawer.Navigator>
    </Block>
  );

};


// export default () => {
//   const { isDark } = useData();
//   const { gradients } = useTheme();

//   const screenOptionsStack = useScreenOptions().stack; // 获取屏幕选项

//   return (
//     <Block gradient={gradients[isDark ? 'dark' : 'light']}>
//       <Drawer.Navigator
//         drawerContent={(props) => <DrawerContent {...props} />}
//         screenOptions={{
//           sceneContainerStyle: { backgroundColor: 'transparent' },
//           drawerType: "slide",
//           overlayColor: "transparent",
//           drawerStyle: {
//             flex: 1,
//             width: '100%',
//             borderRightWidth: 0,
//             backgroundColor: 'transparent',
//           },
//           ...screenOptionsStack, // 合并屏幕选项
//         }}
//       >
//         {/* 将每个 Stack.Screen 移到 Drawer.Screen 中 */}
//         <Drawer.Screen
//           name="Home"
//           component={Home}
//           options={{ title: t('navigation.home') }}
//         />
//         {/* ... 其他 Drawer.Screen 组件 */}
//       </Drawer.Navigator>
//     </Block>
//   );
// };