import React, {useEffect} from 'react';
import {View, Text } from 'react-native'
import styles from './SharedGroupDetailsScreen.styles'
import {useDispatch, useSelector} from "react-redux";
import {getSharedGroup} from "../../redux/sharedGroup";

const SharedGroupDetailsScreen = ({ route }) => {
    const { sharedGroupId } = route.params;
    const { sharedGroup } = useSelector(state => state.sharedGroups);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSharedGroup(sharedGroupId));
    }, []);


    return (
        <View>
            {sharedGroup.length && (
                <View>
                    <View>
                        <Text style={{ color: colors.primary }}>{sharedGroup.title}</Text>
                    </View>
                </View>
            )}
        </View>
    );
};

export default SharedGroupDetailsScreen;
