import { Ionicons } from '@expo/vector-icons';
import { View } from 'moti';
import type { Dispatch, SetStateAction} from 'react';
import React, { useState } from 'react';
import type { ViewStyle } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

import { useAppTheme } from '@/contexts/ThemeProvider';
import { i18n } from '@/localization/i18n';

import styles from './SearchInput.styles';

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
