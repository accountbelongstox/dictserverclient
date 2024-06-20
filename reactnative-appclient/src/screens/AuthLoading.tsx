// src/screens/AuthLoading.tsx
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import { checkLoginStatus, checkLoginStatusLocal } from '../api/auth';
import { useNavigation } from '@react-navigation/native';
import {Block} from '../components/';

export default function AuthLoading() {
    const navigation = useNavigation();

    useEffect(() => {
        const isLoggedIn = checkLoginStatusLocal()
        if (isLoggedIn) {
            navigation.navigate('Screens', {
                screen: 'Dictlist',
            }
            );
        } else {
            navigation.navigate('Screens', {
                screen: 'Login',
            }
            );
        }
    }, [navigation]);

    return (

        <Block>
            <ActivityIndicator />
        </Block>

    );
}
