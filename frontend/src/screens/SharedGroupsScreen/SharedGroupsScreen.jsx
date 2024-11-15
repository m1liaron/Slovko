import React, {useEffect, useState} from 'react';
import {FlatList, Pressable, Text, View} from 'react-native'
import {SafeAreaView} from "react-native-safe-area-context";
import {useAppTheme} from "../../contexts/ThemeProvider";
import {useDispatch, useSelector} from "react-redux";
import {getAllSharedGroups, saveSharedGroup} from "../../redux/sharedGroup";
import styles from './SharedGroupsScreen.styles';
import {Link, useNavigation} from "@react-navigation/native";
import {AppPath} from "../../common/app/app";
import AddButton from "../../common/components/AddButton/AddButton";
import DefaultModal from "../../components/DefaultModal/DefaultModal";
import PressableButton from "../../common/components/PressableButton/PressableButton";
import {selectGroup} from "../../redux/groupSlice";
import { selectSharedGroup } from '../../redux/sharedGroup'

const SharedGroupsScreen = () => {
    const { theme: { colors } } = useAppTheme();
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const sharedGroups = useSelector(selectSharedGroup);
    const groups = useSelector(selectGroup);
    const [showAddModal, setShowModal] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);


    useEffect(() => {
        dispatch(getAllSharedGroups());
    }, []);

    const addRemoveSelectedGroup = (newGroup) => setSelectedGroup(!selectedGroup ? newGroup : null);

    const shareGroup = () => {
        if(!selectedGroup) {
            alert("Please select a shared group");
        }

        dispatch(saveSharedGroup(selectedGroup.id));
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <FlatList
                data={sharedGroups}
                contentContainerStyle={{
                    flexDirection: 'column',
                    gap: 20,
                    padding: 10
                }}
                renderItem={({ item }) => (
                    <Link style={styles.container} to={{ screen: AppPath.SharedGroupDetails, params: { sharedGroupId: item.id}}}>
                        <Text style={{ color: colors.primary }}>{item.title}</Text>
                    </Link>
                )}
            />
            <AddButton onPress={() => setShowModal(true)}/>
            <DefaultModal
                isVisible={showAddModal}
                handleClose={() => setShowModal(false)}
            >
                {groups.length ?
                    (
                        <FlatList
                            data={groups}
                            renderItem={({ item }) => (
                                <Pressable onPress={() => addRemoveSelectedGroup(item)}>
                                    <Text style={{
                                        color: colors.primary,
                                        borderColor: selectedGroup?.title === item.title ? "#007AFF" : colors.primary,
                                        borderWidth: 2,
                                        borderRadius: 10,
                                        fontSize: 30,
                                        padding: 20
                                    }}
                                    >{item.title}</Text>
                                </Pressable>
                            )}
                        />
                    )
                        :
                    (
                        <View>
                            <Text style={{
                                color: colors.primary,
                                fontSize: 30
                            }}>Немає груп</Text>
                            <PressableButton text="Створити групу" onPress={() => navigation.navigate(AppPath.Home)} buttonStyle={{ padding: 20 }}/>
                        </View>
                    )
                }
                <PressableButton text="Поширити" onPress={shareGroup}/>
            </DefaultModal>
        </SafeAreaView>
    );
};

export default SharedGroupsScreen;
