import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NaviButton from '../components/NaviButton';

import Page1 from './Page1';
import Page2 from './Page2';
import Page3 from './Page3';
import Page4 from './Page4';
import Page5 from './Page5';

const BottomTab = createBottomTabNavigator();

const BottomTabs = () => {
    return (
        <BottomTab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName, gradient, backgroundImage;
                    switch (route.name) {
                        case 'Page1':
                            iconName = focused ? 'home' : 'home-outline';
                            gradient = focused ? ['#ff7e5f', '#feb47b'] : undefined;
                            break;
                        case 'Page2':
                            iconName = focused ? 'settings' : 'settings-outline';
                            gradient = focused ? ['#6oC1FF', '#736EFE'] : undefined;
                            break;
                        case 'Page3':
                            iconName = focused ? 'person' : 'person-outline';
                            gradient = focused ? ['#48c6ef', '#6f86d6'] : undefined;
                            break;
                        case 'Page4':
                            iconName = focused ? 'search' : 'search-outline';
                            gradient = focused ? ['#f87078', '#fe5196'] : undefined;
                            break;
                        case 'Page5':
                            iconName = focused ? 'menu' : 'menu-outline';
                            gradient = focused ? ['#70f570', '#49c628'] : undefined;
                            break;
                        default:
                            break;
                    }
                    return (
                        <NaviButton
                            focused={focused}
                            color={color}
                            size={size}
                            iconName={iconName}
                            gradient={gradient}
                            backgroundImage={backgroundImage}
                        />
                    );
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <BottomTab.Screen name="Page1" component={Page1} options={{ tabBarLabel: 'Home' }} />
            <BottomTab.Screen name="Page2" component={Page2} options={{ tabBarLabel: 'Settings' }} />
            <BottomTab.Screen name="Page3" component={Page3} options={{ tabBarLabel: 'Profile' }} />
            <BottomTab.Screen name="Page4" component={Page4} options={{ tabBarLabel: 'Search' }} />
            <BottomTab.Screen name="Page5" component={Page5} options={{ tabBarLabel: 'More' }} />
        </BottomTab.Navigator>
    );
};

export default BottomTabs;
