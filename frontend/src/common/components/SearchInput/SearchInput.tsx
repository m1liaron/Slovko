import { useAppTheme } from '@/contexts/ThemeProvider';
import { i18n } from '@/localization/i18n';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'moti';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import styles from './SearchInput.styles';
import { ViewStyle } from 'react-native';

interface SearchInputProps {
  children?: React.ReactNode;
  value: string;
  onChange: Dispatch<SetStateAction<string>>;
  customStyles?: ViewStyle;
}

const SearchInput: React.FC<SearchInputProps> = ({
  children,
  customStyles,
  value,
  onChange,
}) => {
  const {
    theme: { colors },
  } = useAppTheme();

  return (
    <View
      style={[
        styles.searchContainer,
        {
          ...customStyles,
          backgroundColor: colors.lightBackground,
        },
      ]}
    >
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Ionicons name="search" size={20} color={colors.lightText} />
        <TextInput
          style={[styles.searchInput, { color: colors.primary }]}
          placeholder={i18n.t('sharedGroupsScreen.searchPlaceholder')}
          placeholderTextColor={colors.lightText}
          value={value}
          onChangeText={onChange}
        />
      </View>

      {children}
    </View>
  );
};

export { SearchInput };
