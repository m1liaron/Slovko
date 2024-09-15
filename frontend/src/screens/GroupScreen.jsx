import CardList from "../components/Card/CardList";
import {SafeAreaView} from "react-native-safe-area-context";
import BackButton from "../components/BackButton/BackButton";

const GroupScreen = ({route}) => {
    const { groupId } = route.params

    return (
        <SafeAreaView style={{flex: 1}}>
            <BackButton />
            <CardList groupId={groupId} />
        </SafeAreaView>
    )
}

export default GroupScreen;