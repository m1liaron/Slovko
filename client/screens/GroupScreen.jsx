import CardList from "../components/Card/CardList";

const GroupScreen = ({route}) => {
    const {groupId} = route.params

    return (
        <CardList groupId={groupId} />
    )
}

export default GroupScreen;