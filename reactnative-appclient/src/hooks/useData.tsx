import React, {useCallback, useContext, useEffect, useState} from 'react';
import Storage from '@react-native-async-storage/async-storage';

import {
  IArticle,
  ICategory,
  IProduct,
  IUser,
  IUseData,
  IBasket,
  INotification,
  ITheme,
} from '../constants/types';

import {
  USERS,
  FOLLOWING,
  TRENDING,
  CATEGORIES,
  ARTICLES,
  RECOMMENDATIONS,
  BASKET,
  NOTIFICATIONS,
} from '../constants/mocks';
import {light, dark} from '../constants';
import * as DictTypes from '../constants/types/dict';


export const DataContext = React.createContext({});

export const DataProvider = ({children}: {children: React.ReactNode}) => {
  const [dictlist, setDictlist] = useState<IProduct[]>(FOLLOWING);
  const [preDictlist, setPreDictlist] = useState<IProduct[]>(FOLLOWING);
  
  const [grouplist, setGrouplist] = useState<DictTypes.GroupList[]>([]);

  
  const [jwt, setJwt] = useState('');
  const getJwt = useCallback(async () => {
    const jwtToken = await Storage.getItem('jwt');
    if (jwtToken !== null) {
      setJwt(jwtToken);
    }
  }, []);
  const handleJwt = useCallback((token: string) => {
    setJwt(token);
    Storage.setItem('jwt', token);
  }, []);

  const [isDark, setIsDark] = useState(false);
  const [theme, setTheme] = useState<ITheme>(light);
  const [user, setUser] = useState<IUser>(USERS[0]);
  const [basket, setBasket] = useState<IBasket>(BASKET);
  const [users, setUsers] = useState<IUser[]>(USERS);
  const [following, setFollowing] = useState<IProduct[]>(FOLLOWING);
  
  const [trending, setTrending] = useState<IProduct[]>(TRENDING);
  const [categories, setCategories] = useState<ICategory[]>(CATEGORIES);
  const [recommendations, setRecommendations] =
    useState<IArticle[]>(RECOMMENDATIONS);
  const [articles, setArticles] = useState<IArticle[]>(ARTICLES);
  const [article, setArticle] = useState<IArticle>({});
  const [notifications, setNotifications] =
    useState<INotification[]>(NOTIFICATIONS);

  const getIsDark = useCallback(async () => {
    const isDarkJSON = await Storage.getItem('isDark');

    if (isDarkJSON !== null) {
      setIsDark(JSON.parse(isDarkJSON));
    }
  }, [setIsDark]);

  const handleIsDark = useCallback(
    (payload: boolean) => {
      setIsDark(payload);
      Storage.setItem('isDark', JSON.stringify(payload));
    },
    [setIsDark],
  );

  const handleUsers = useCallback(
    (payload: IUser[]) => {
      // set users / compare if has updated
      if (JSON.stringify(payload) !== JSON.stringify(users)) {
        setUsers({...users, ...payload});
      }
    },
    [users, setUsers],
  );

  // handle basket
  const handleBasket = useCallback(
    (payload: IBasket) => {
      // set basket items / compare if has updated
      if (JSON.stringify(payload) !== JSON.stringify(basket)) {
        const subtotal = payload?.items?.reduce((total, item) => {
          total += (item.price || 0) * (item.qty || 1);
          return total;
        }, 0);
        setBasket({...basket, ...payload, subtotal});
      }
    },
    [basket, setBasket],
  );

  // handle user
  const handleUser = useCallback(
    (payload: IUser) => {
      // set user / compare if has updated
      if (JSON.stringify(payload) !== JSON.stringify(user)) {
        setUser(payload);
      }
    },
    [user, setUser],
  );

  // handle Article
  const handleArticle = useCallback(
    (payload: IArticle) => {
      // set article / compare if has updated
      if (JSON.stringify(payload) !== JSON.stringify(article)) {
        setArticle(payload);
      }
    },
    [article, setArticle],
  );

  // handle Notifications
  const handleNotifications = useCallback(
    (payload: INotification[]) => {
      // set notifications / compare if has updated
      if (JSON.stringify(payload) !== JSON.stringify(notifications)) {
        setNotifications(payload);
      }
    },
    [notifications, setNotifications],
  );

  // get initial data for: isDark & language
  useEffect(() => {
    getIsDark();
    getJwt();
  }, [getIsDark, getJwt]);

  // change theme based on isDark updates
  useEffect(() => {
    setTheme(isDark ? dark : light);
  }, [isDark]);

  const contextValue = {
    isDark,
    handleIsDark,
    theme,
    setTheme,
    user,
    users,
    handleUsers,
    handleUser,
    basket,
    handleBasket,
    following,
    setFollowing,
    trending,
    dictlist,
    setDictlist,
    preDictlist, setPreDictlist,
    grouplist,
    setGrouplist,
    setTrending,
    categories,
    setCategories,
    recommendations,
    setRecommendations,
    articles,
    setArticles,
    article,
    handleArticle,
    notifications,
    handleNotifications,

    jwt,
    getJwt,
    handleJwt,
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext) as IUseData;
