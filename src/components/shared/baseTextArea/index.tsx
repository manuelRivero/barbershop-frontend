import {Text, Textarea, TextareaInput, VStack} from '@gluestack-ui/themed';
import React from 'react';
import { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';
interface Props {
  label: string;
  invalid: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder: string;
  value: string;
  onChange: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void;
  errorMessage: string | undefined
}
export default function BaseTextArea({
  label,
  invalid,
  disabled,
  readOnly,
  placeholder,
  value,
  onChange,
  errorMessage
}: Props) {
  return (
    <VStack space="xs">
      <Text color="$textDark500">{label}</Text>
      <Textarea
        size="md"
        isDisabled={disabled}
        isInvalid={invalid}
        isReadOnly={readOnly}>
        <TextareaInput value={value} onChange={onChange} placeholder={placeholder} />
      </Textarea>
      {invalid && <Text fontSize={14} color={"$red700"}>{errorMessage}</Text>}

    </VStack>
  );
}
