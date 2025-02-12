import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  FlatList,
  Linking,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';
import { GroupList } from '../../components/Group/GroupList';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, selectUser } from '../../redux/userReducer/userSlice';
import { FontAwesome6 } from '@expo/vector-icons';
import { useAppTheme } from '../../contexts/ThemeProvider';
import styles from './MainScreen.styles';
import {
  getRepeatedCards,
  getRepeatedCardsFromIds,
} from '../../redux/cardReducer/cardSlice';
import { useNavigation } from '@react-navigation/native';
import { AppPath } from '../../common/enums/app/app';
import {
  requestNotificationPermission,
  scheduleNotification,
} from '../../utils/notifications';
import appLogo from '../../assets/images/favicon.png';
import DefaultModal from '../../components/DefaultModal/DefaultModal';
import PressableButton from '../../common/components/PressableButton/PressableButton';

const MainScreen = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(selectUser);
  const { theme } = useAppTheme();
  const [daysPassed, setDaysPassed] = useState('');
  const [showRepeatedModal, setShowRepeatedModal] = useState(false);
  const repeatedGroupsIds = useSelector((state) => state.cards.repeatedCards);
  const repeatedCardsLength = repeatedGroupsIds.reduce(
    (prev, curr) => (prev += curr.cards.length),
    0
  );
  const navigate = useNavigation();

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

  useEffect(() => {
    const notificationText = `У вас є ${repeatedGroupsIds.length} для повторення.`;
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      if (repeatedGroupsIds.length > 0) {
        scheduleNotification('Час для повторення!', notificationText, {
          seconds: 5,
        });
      }
    } else {
      sendNotification();
    }
  }, [repeatedGroupsIds]);

  const sendNotification = () => {
    if (!('Notification' in window)) {
      throw new Error('Ваш браузер не підтримує повідомлення');
    }

    Notification.requestPermission().then((permission) => {
      if (repeatedCardsLength) {
        if (permission === 'granted') {
          const notificationOptions = {
            body: `У вас є ${repeatedCardsLength} слова для повторення.`,
            icon: appLogo.uri,
          };
          new Notification('Push Notification', notificationOptions);
        } else {
          alert('Дозвольте надсилати повідомлення про слова для повторення');
          console.log('Повідомлення заблоковані користувачем.');
        }
      }
    });
  };

  useEffect(() => {
    dispatch(getRepeatedCards());
  }, []);

  function daysSince(dateString) {
    const targetDate = new Date(dateString);
    const now = new Date();

    const totalDays = Math.floor((now - targetDate) / (1000 * 3600 * 24));
    return `${totalDays} днів`;
  }

  useEffect(() => {
    const days = daysSince('2022-02-24');
    setDaysPassed(days);
  }, []);

  useEffect(() => {
    dispatch(getUser());
  }, []);

  const openLink = () => {
    Linking.openURL('https://savelife.in.ua/en/');
  };

  const navigateToLearn = () => {
    navigate.navigate(AppPath.Learn);
    setShowRepeatedModal(false);
  };

  const learnAllRepeatedCards = () => {
    const allIds = repeatedGroupsIds.map((group) =>
      group.cards.map((id) => id)
    );
    dispatch(getRepeatedCardsFromIds(allIds));
    navigateToLearn();
  };

  const learnGroupRepeatedCards = (cardsIds) => {
    dispatch(getRepeatedCardsFromIds(cardsIds));
    navigateToLearn();
  };

  const isStreakFire =
    new Date(user.lastReviewAt).toDateString() === new Date().toDateString() &&
    user.streak > 0;
  const streakColor = isStreakFire
    ? '#F5712A'
    : user.frozen
      ? '#2aaef5'
      : theme.colors.iconColor;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Pressable
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}
        onPress={() => navigate.navigate(AppPath.Streak)}
      >
        <FontAwesome6 name="fire-flame-simple" size={30} color={streakColor} />
        <Text style={{ color: streakColor, fontSize: 35 }}>{user.streak}</Text>
      </Pressable>
      <Text style={styles.timePassedText}>
        Вже минуло {daysPassed} з початку війни.
      </Text>

      {repeatedGroupsIds.length && (
        <Pressable
          style={styles.repeatButton}
          onPress={() => setShowRepeatedModal(true)}
        >
          <Text style={{ color: theme.colors.primary, fontSize: 30 }}>
            Повторити слова - {repeatedCardsLength}
          </Text>
        </Pressable>
      )}

      <GroupList />
      <View style={styles.anouncement}>
        <Pressable onPress={openLink}>
          <Text style={styles.title}>Save Ukraine!</Text>
        </Pressable>
      </View>

      <DefaultModal
        isVisible={showRepeatedModal}
        handleClose={() => setShowRepeatedModal(!showRepeatedModal)}
      >
        <FlatList
          data={repeatedGroupsIds}
          contentContainerStyle={{ overflow: 'visible', height: 500 }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              style={[
                styles.item,
                { backgroundColor: theme.colors.lightBackground },
              ]}
              onPress={() => learnGroupRepeatedCards(item.cards)}
            >
              <Text style={{ color: theme.colors.primary, fontSize: 30 }}>
                {item.title}
              </Text>
              <Text style={{ color: theme.colors.primary, fontSize: 30 }}>
                {item.cards.length}
              </Text>
            </Pressable>
          )}
        />
        <PressableButton text="Повторити усі" onPress={learnAllRepeatedCards} />
      </DefaultModal>
    </SafeAreaView>
  );
};

export default MainScreen;
