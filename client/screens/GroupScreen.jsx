import CardList from "../components/Card/CardList";
import {useDispatch} from "react-redux";
import {SafeAreaView} from "react-native-safe-area-context";
import { Button } from "react-native";
import {updateCardsAfterLearn} from "../redux/cardSlice";

const GroupScreen = ({route}) => {
    const {groupId} = route.params
    const dispatch = useDispatch();

    return (
        <SafeAreaView style={{flex: 1}}>
            <CardList groupId={groupId} />
            <Button title="Save cards after review" onPress={() => dispatch(updateCardsAfterLearn({groupId}))}/>
        </SafeAreaView>
    )
}

export default GroupScreen;