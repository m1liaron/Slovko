import CardList from "../../components/Card/CardList";
import {SafeAreaView} from "react-native-safe-area-context";
import BackButton from "../../components/BackButton/BackButton";
import { Pressable, Text, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {filterCardsByStatus, getAllStatusCards, selectCard} from "../../redux/cardReducer/cardSlice";
import {useAppTheme} from "../../contexts/ThemeProvider";
import {useEffect} from "react";
import {getGroup} from "../../redux/groupReducer/groupSlice";

const GroupScreen = ({route}) => {
    const { theme: { colors } } = useAppTheme();
    const { groupId } = route.params
    const { group } = useSelector(state => state.groups);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getGroup(groupId));
    }, [dispatch, groupId]);

    const statusCardsButtons = [
        { title: 'Вивчаю', status: 'To Learn', amount: group.learnToCardsAmount, color: '#32C74D' },
        { title: 'Вивченні', status: 'Learned', amount: group.learnedCardsAmount, color: '#62CBE9' },
        { title: 'Знаю', status: 'Know', amount: group.knowCardsAmount, color: '#a8a800' },
    ];

    const renderStatusButtons = () => {
        return statusCardsButtons.map(({ status, title, amount, color }, id) => (
            <Pressable
                key={id}
                style={{
                    padding: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: color,
                    marginHorizontal: 10,
                }}
                onPress={() => dispatch(filterCardsByStatus({ status }))}
            >
                <Text style={{ color, fontWeight: 'bold' }}>{amount} {title}</Text>
            </Pressable>
        ));
    };

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: colors.background }}>
            <View style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
            }}>
                <BackButton />
                <Text style={{ fontSize: 30, fontWeight: 'bold', color: colors.primary }}>{group.title}</Text>
            </View>
            <View
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                {renderStatusButtons()}
            </View>
            <CardList groupId={groupId} />
        </SafeAreaView>
    )
}

export default GroupScreen;