import {
  Icon,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  Text,
  VStack,
  Pressable,
} from '@gluestack-ui/themed';
import {Eye} from 'lucide-react-native';
import React, {useState} from 'react';
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
  errorMessage: string | undefined;
  type?: 'text' | 'password';
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
  errorMessage,
  type = 'text',
}: Props) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  console.log('show password', showPassword);
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
          secureTextEntry={type === 'password' && !showPassword}
          keyboardType={keyboard}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
        {type === 'password' && (
          <InputSlot pr="$3">
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <InputIcon>
                <Icon as={Eye} />
              </InputIcon>
            </Pressable>
          </InputSlot>
        )}
      </Input>
      {invalid && (
        <Text fontSize={14} color={'$red700'}>
          {errorMessage}
        </Text>
      )}
    </VStack>
  );
}
