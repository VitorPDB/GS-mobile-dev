import React, { ComponentProps } from 'react';
import { View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { theme } from './theme';
export type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];
export function Icon({name,size=24,color=theme.ink}:{name:IconName;size?:number;color?:string}) {
  return <View aria-hidden={true} accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants"><MaterialCommunityIcons name={name} size={size} color={color} accessible={false}
    accessibilityElementsHidden importantForAccessibility="no-hide-descendants"/></View>;
}
