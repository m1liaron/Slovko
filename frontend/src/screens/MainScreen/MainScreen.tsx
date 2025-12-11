import { Entypo, FontAwesome6 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useCallback } from 'react';
import {
  FlatList,
  Image,
  Linking,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';

import appLogo from '@/assets/images/favicon.png';
import ThemeBackground from '@/common/components/ThemeBackground/Themebackground';
import { useLanguage } from '@/contexts/LanguageProvider';
import { useAppTheme } from '@/contexts/ThemeProvider';
import { enqueueOrDispatch } from '@/helpers/offlineHelpers/enqueueOrDispatch';
import { useAppDispatch, useAppSelector } from '@/hooks/redux.hooks';
import { i18n } from '@/localization/i18n';
import { CustomDrawerContent } from '@/navigation/DrawerNavigator/CustomDrawerContent';
import type { StackNavigation } from '@/navigation/ProtectedRoute/ProtectedRoute';
import { getAllGroups } from '@/redux/groupReducer/groupThunk';
import {
  getSections,
  setActiveSectionId,
} from '@/redux/sectionReducer/sectionSlice';

import PressableButton from '../../common/components/PressableButton/PressableButton';
import { AppPath } from '../../common/enums/app/app';
import DefaultModal from '../../components/DefaultModal/DefaultModal';
import { GroupList } from '../../components/Group/GroupList/GroupList';
import {
  getRepeatedCards,
  getRepeatedCardsFromIds,
} from '../../redux/cardReducer/cardSlice';
import { getUser, selectUser } from '../../redux/userReducer/userSlice';
import {
  requestNotificationPermission,
  scheduleNotification,
} from '../../utils/notifications';

import styles from './MainScreen.styles';
import ThemeText from '@/common/components/ThemeText/ThemeText';
import { HAS_TOKEN } from '@/utils/storage/initToken';

const MainScreen = () => {
  useLanguage();
  const dispatch = useAppDispatch();
  const navigate = useNavigation<StackNavigation>();
  const { user } = useAppSelector(selectUser);
  const {
    theme: { colors },
  } = useAppTheme();
  const { isAuthenticated } = useAppSelector((state) => state.user);
  // const repeatedGroupsIds = useAppSelector(
  //   (state) => state.cards.repeatedCards,
  // );
  // const repeatedCardsLength = repeatedGroupsIds.length > 0 ? repeatedGroupsIds.reduce(
  //   (prev, curr) => prev + curr.cards.length,
  //   0,
  // ) : 0;
  const { sections, activeSectionId } = useAppSelector(
    (state) => state.sections,
  );

  const [daysPassed, setDaysPassed] = useState('');
  const [showRepeatedModal, setShowRepeatedModal] = useState<boolean>(false);
  const [showDrawerMenu, setShowDrawerMenu] = useState(false);

  useEffect(() => {
    dispatch(enqueueOrDispatch(getUser, {}));
    dispatch(getSections());
  }, []);

  useEffect(() => {
    dispatch(getAllGroups(activeSectionId));
  }, [activeSectionId]);

  useEffect(() => {
    if (!activeSectionId) {
      dispatch(setActiveSectionId(sections[0]));
    }
  }, []);

  useEffect(() => {
    if (activeSectionId) {
      dispatch(
        enqueueOrDispatch(getRepeatedCards, { sectionId: activeSectionId }),
      );
    }
  }, [dispatch, activeSectionId]);

  useEffect(() => {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      const setupNotifications = async () => {
        const hasPermission = await requestNotificationPermission();
        if (!hasPermission) {
          console.log('Notifications permission not granted');
        }
      };
      setupNotifications();
    }
  }, []);

  // useEffect(() => {
  //   if (Platform.OS === 'android' || Platform.OS === 'ios') {
  //     if (repeatedGroupsIds.length > 0) {
  //       scheduleNotification(
  //         i18n.t('mainScreen.notificationTitle'),
  //         i18n.t('mainScreen.notificationBody', { count: repeatedCardsLength }),
  //         null,
  //       );
  //     }
  //   } else {
  //     sendNotification();
  //   }
  // }, [repeatedGroupsIds, repeatedCardsLength]);

  const sendNotification = () => {
    if (!('Notification' in window)) {
      throw new Error('Ваш браузер не підтримує повідомлення');
    }

    // if (Notification.permission !== 'granted') {
    //   Notification.requestPermission().then((permission) => {
    //     if (repeatedCardsLength) {
    //       if (permission === 'granted') {
    //         const appLogoUri = Image.resolveAssetSource(appLogo).uri;
    //         const notificationOptions = {
    //           body: i18n.t('mainScreen.notificationBody', {
    //             count: repeatedCardsLength,
    //           }),
    //           icon: appLogoUri,
    //         };
    //         new Notification(
    //           i18n.t('mainScreen.notificationTitle'),
    //           notificationOptions,
    //         );
    //       } else {
    //         console.log('Повідомлення заблоковані користувачем.');
    //       }
    //     }
    //   });
    // }
  };

  const daysSince = useCallback((dateString: string) => {
    const targetDate = new Date(dateString).getTime();
    const now = new Date().getTime();
    const totalDays = Math.floor((now - targetDate) / (1000 * 3600 * 24));
    return `${totalDays}`;
  }, []);

  useEffect(() => {
    const days = daysSince('2022-02-24');
    setDaysPassed(days);
  }, [daysSince]);

  const openLink = () => {
    Linking.openURL('https://savelife.in.ua/en/');
  };

  const navigateToLearn = () => {
    navigate.navigate(AppPath.Learn);
    setShowRepeatedModal(false);
  };

  // const learnAllRepeatedCards = () => {
  //   const allIds =
  //     repeatedGroupsIds.length > 1
  //       ? repeatedGroupsIds.flatMap((group) => group.cards.map((id) => id))
  //       : repeatedGroupsIds[0].cards;
  //   dispatch(enqueueOrDispatch(getRepeatedCardsFromIds, allIds));
  //   navigateToLearn();
  // };

  const learnGroupRepeatedCards = (cardsIds: string[]) => {
    dispatch(enqueueOrDispatch(getRepeatedCardsFromIds, cardsIds));
    navigateToLearn();
  };

  const navigateToLogin = () => {
    navigate.navigate(AppPath.Login);
  };

  const isStreakFire = !user
    ? false
    : new Date(user?.lastReviewAt).toDateString() ===
        new Date().toDateString() && user?.streak > 0;
  const streakColor = isStreakFire
    ? '#F5712A'
    : user?.frozen
      ? '#2aaef5'
      : colors.iconColor;

  return (
    <ThemeBackground>
      {showDrawerMenu && (
        <Pressable
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            flexDirection: 'row',
            zIndex: 20,
          }}
          onPress={() => setShowDrawerMenu(false)}
        >
          <CustomDrawerContent handleClose={() => setShowDrawerMenu(false)} />
        </Pressable>
      )}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}
      >
        <Pressable onPress={() => setShowDrawerMenu((prev) => !prev)}>
          <Entypo name="menu" size={30} color={colors.primary} />
        </Pressable>
        <Pressable
          onPress={() => navigate.navigate(AppPath.Streak)}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <FontAwesome6
            name="fire-flame-simple"
            size={30}
            color={streakColor}
          />
          <Text style={{ color: streakColor, fontSize: 35 }}>
            {user?.streak || 0}
          </Text>
        </Pressable>
      </View>

      {(!HAS_TOKEN || !isAuthenticated) && (
        <View
          style={{
            backgroundColor: colors.lightBackground,
            padding: 20,
            borderRadius: 10,
            flexDirection: 'row',
            justifyContent: 'center',
            marginHorizontal: 20,
          }}
        >
          {Platform.OS === 'web' ? (
            <>
              <ThemeText>{i18n.t('mainScreen.unAuthorized')}</ThemeText>

              <Pressable onPress={navigateToLogin}>
                <Text
                  style={{ color: colors.highlightColor, fontWeight: 'bold' }}
                >
                  {` ${i18n.t('loginScreen.loginButton')}`}
                </Text>
              </Pressable>
            </>
          ) : (
            <ThemeText>
              {i18n.t('mainScreen.unAuthorized')}

              <Pressable onPress={navigateToLogin}>
                <Text
                  style={{ color: colors.highlightColor, fontWeight: 'bold' }}
                >
                  {` ${i18n.t('loginScreen.loginButton')}`}
                </Text>
              </Pressable>
            </ThemeText>
          )}
        </View>
      )}

      <Text style={styles.timePassedText}>
        {i18n.t('mainScreen.alreadyPassed')} {daysPassed}{' '}
        {i18n.t('mainScreen.daysPassed')}
      </Text>

      {/* {repeatedGroupsIds.length ? (
        <Pressable
          style={[
            styles.repeatButton,
            { backgroundColor: colors.highlightColor },
          ]}
          onPress={() => setShowRepeatedModal(true)}
        >
          <Text style={{ color: colors.background, fontSize: 20 }}>
            {i18n.t('mainScreen.repeatWords')} - {repeatedCardsLength}
          </Text>
        </Pressable>
      ) : null} */}

      <GroupList />

      <View style={styles.anouncement}>
        <Pressable onPress={openLink}>
          <Text style={styles.title}>{i18n.t('mainScreen.saveUkraine')}</Text>
        </Pressable>
      </View>

      {/* <DefaultModal
        isVisible={showRepeatedModal}
        handleClose={() => setShowRepeatedModal(!showRepeatedModal)}
      >
        <FlatList
          data={repeatedGroupsIds}
          contentContainerStyle={{ overflow: 'visible', height: 500 }}
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => (
            <Pressable
              key={item.title}
              style={[styles.item, { backgroundColor: colors.lightBackground }]}
              onPress={() => learnGroupRepeatedCards(item.cards)}
            >
              <Text style={{ color: colors.primary, fontSize: 30 }}>
                {item.title}
              </Text>
              <Text style={{ color: colors.primary, fontSize: 30 }}>
                {item.cards.length}
              </Text>
            </Pressable>
          )}
        />
        <PressableButton
          text={i18n.t('mainScreen.repeatAll')}
          onPress={learnAllRepeatedCards}
        />
      </DefaultModal> */}
    </ThemeBackground>
  );
};
export default MainScreen;
