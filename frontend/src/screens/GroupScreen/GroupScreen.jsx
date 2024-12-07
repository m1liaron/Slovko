import CardList from "../../components/Card/CardList";
import {SafeAreaView} from "react-native-safe-area-context";
import BackButton from "../../components/BackButton/BackButton";
import { Pressable, Text, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {filterCardsByStatus, resetFilter} from "../../redux/cardReducer/cardSlice";
import { useAppTheme } from "../../contexts/ThemeProvider";
import {useEffect, useMemo} from "react";
import {getGroup} from "../../redux/groupReducer/groupSlice";
import {DataStatus} from "../../common/enums/app/app";
import {useNavigation} from "@react-navigation/native";
import {Entypo} from "@expo/vector-icons";

const GroupScreen = ({route}) => {
    const { theme: { colors } } = useAppTheme();
    const { groupId } = route.params
    const { group } = useSelector(state => state.groups);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    if(!group && group.status === DataStatus.ERROR) {
        navigation.goBack();
    }

    useEffect(() => {
        if(!group || group.id !== groupId) {
            dispatch(getGroup(groupId));
        }
    }, [dispatch, group, groupId]);

    const statusCardsButtons = useMemo(() => {
        if(!group) return [];
        return [
            { title: 'Вивчаю', status: 'To Learn', amount: group.learnToCardsAmount || 0, color: '#32C74D' },
            { title: 'Вивченні', status: 'Learned', amount: group.learnedCardsAmount || 0, color: '#62CBE9' },
            { title: 'Знаю', status: 'Know', amount: group.knowCardsAmount || 0, color: '#a8a800' },
        ]
    }, [group])

    const renderStatusButtons = () => {
        return statusCardsButtons.map(({ status, title, amount, color }, id) => (
            <Pressable
                key={id}
                style={{
                    padding: 10,
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
                <Pressable
                    style={{
                        padding: 5,
                        borderRadius: 10,
                        borderWidth: 2,
                        borderColor: '#bcbcbc',
                        marginHorizontal: 10,
                    }}
                    onPress={() => dispatch(resetFilter())}
                >
                    <Entypo name="back-in-time" size={30} color="#bcbcbc" />
                </Pressable>
            </View>
            <CardList groupId={groupId} />
        </SafeAreaView>
    )
}

export default GroupScreen;