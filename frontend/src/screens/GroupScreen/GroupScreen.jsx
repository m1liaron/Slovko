import CardList from "../../components/Card/CardList";
    import {SafeAreaView} from "react-native-safe-area-context";
import BackButton from "../../components/BackButton/BackButton";
import { Pressable, Text, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {getAllStatusCards} from "../../redux/cardSlice";
import {useAppTheme} from "../../contexts/ThemeProvider";
import {useEffect} from "react";
import {getGroup} from "../../redux/groupReducer/groupSlice";

const GroupScreen = ({route}) => {
    const { theme: { colors } } = useAppTheme();
    const { groupId } = route.params
    const dispatch = useDispatch();
    const { group } = useSelector(state => state.groups);

    useEffect(() => {
        dispatch(getGroup(groupId));
    }, []);

    const statusCardsButtons = [
        { title: 'To Learn', status: 'To Learn' },
        { title: 'Learned', status: 'Learned' }
    ]


    const isStatusButton = (status) => status === 'To Learn' ? 'green' : '#a8a800'

    const renderStatusButtons = () => {
        return statusCardsButtons.map(({status, title}, id) => (
                <Pressable key={id} style={{
                    padding: 20,
                    fontSize: 28,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: isStatusButton(status),
                    marginHorizontal: 10,
                }}
                onPress={() => dispatch(getAllStatusCards({
                    groupId,
                    status
                }))}
                >
                    <Text style={{
                        color: isStatusButton(status),
                        fontWeight: 'bold'
                    }}>{title}</Text>
                </Pressable>
        ))
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