import CardList from "../../components/Card/CardList";
    import {SafeAreaView} from "react-native-safe-area-context";
import BackButton from "../../components/BackButton/BackButton";
import { Pressable, Text, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {getAllStatusCards, selectCard} from "../../redux/cardReducer/cardSlice";
import {useAppTheme} from "../../contexts/ThemeProvider";
import {useEffect, useMemo, useState} from "react";
import {getGroup} from "../../redux/groupReducer/groupSlice";

const GroupScreen = ({route}) => {
    const { theme: { colors } } = useAppTheme();
    const { groupId } = route.params
    const dispatch = useDispatch();
    const { group } = useSelector(state => state.groups);
    const cards = useSelector(selectCard);
    const [toLearnAmountCards, setToLearnAmountCards] = useState(0);
    const [learnedAmountCards, setLearnedAmountCards] = useState(0);
    const [knowAmountCards, setKnowAmountCards] = useState(0);

    useEffect(() => {
        dispatch(getGroup(groupId));
    }, [dispatch, groupId]);

    const cardCounts = useMemo(() => {
        return cards.reduce((acc, curr) => {
            if (curr.status === 'To learn') {
                acc.toLearn += 1; // Increment the 'To learn' count
            } else if (curr.status === 'Learned') {
                acc.learned += 1; // Increment the 'Learned' count
            } else if(curr.status === 'Know') {
                acc.know += 1;
            }
            return acc;
        }, { toLearn: 0, learned: 0, know: 0 }); // Initialize counts
    }, [cards]);

    const statusCardsButtons = [
        { title: 'Вивчаю', status: 'To Learn', amount: cardCounts.toLearn, color: '#32C74D' },
        { title: 'Вивченні', status: 'Learned', amount: cardCounts.learned, color: '#62CBE9' },
        { title: 'Знаю', status: 'Know', amount: cardCounts.know, color: '#a8a800' },
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
                onPress={() => dispatch(getAllStatusCards({ groupId, status }))}
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