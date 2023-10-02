import {Input, InputField, Text, VStack} from '@gluestack-ui/themed';
import React from 'react';
import {NativeSyntheticEvent, TextInputChangeEventData} from 'react-native';
interface Props {
  label: string;
  invalid: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder: string;
  value: string;
  onChange: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void;
  keyboard: 'default' | 'number-pad';
  errorMessage: string | undefined
}
export default function BaseInput({
  label,
  invalid,
  disabled,
  readOnly,
  placeholder,
  value,
  onChange,
  keyboard,
  errorMessage
}: Props) {
  return (
    <VStack space="xs">
      <Text color="$textDark900">{label}</Text>
      <Input
        variant="outline"
        size="md"
        isDisabled={disabled}
        isInvalid={invalid}
        isReadOnly={readOnly}>
        <InputField
          keyboardType={keyboard}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </Input>
      {invalid && <Text fontSize={14} color={"$red700"}>{errorMessage}</Text>}
    </VStack>
  );
}
