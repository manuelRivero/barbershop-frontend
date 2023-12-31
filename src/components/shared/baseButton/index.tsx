import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from '@gluestack-ui/themed';
import React from 'react';
interface Props {
  onPress: () => void;
  title: string;
  isLoading?: boolean;
  disabled?: boolean;
  hasIcon?: boolean;
  icon?: JSX.Element;
  background: string;
  color: string;
}
export default function BaseButton({
  title,
  onPress,
  isLoading,
  disabled,
  hasIcon,
  icon,
  background,
  color,
}: Props) {
  return (
    <Button
      variant={'solid'}
      bg={background}
      onPress={onPress}
      disabled={disabled}>
      {isLoading && <ButtonSpinner mr="$1" />}
      {!isLoading && (
        <ButtonText color={color} fontWeight="$medium" fontSize="$sm">
          {title}
        </ButtonText>
      )}
      {hasIcon && (
        <ButtonIcon
          as={icon ? icon : null}
          h="$3"
          w="$3"
          ml="$1"
          color={color}
        />
      )}
    </Button>
  );
}
