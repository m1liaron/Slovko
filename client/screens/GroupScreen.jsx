import {useSelector} from "react-redux";
import {selectCard} from "../redux/cardSlice";
import CardList from "../components/Card/CardList";

const GroupScreen = ({route}) => {
    const {groupId} = route.params
    const cards = useSelector(selectCard);
    const currentCards = cards.filter(card => card.groupId === groupId);

    return (
        <CardList groupId={groupId} />
    )
}

export default GroupScreen;