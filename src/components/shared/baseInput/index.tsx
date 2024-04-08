import {
  Icon,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  VStack,
  Pressable,
} from '@gluestack-ui/themed';
import {Eye} from 'lucide-react-native';
import React, {useState} from 'react';
import {NativeSyntheticEvent, TextInputChangeEventData} from 'react-native';
import CustomText from '../text';
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
  multiline?: boolean;
  numberOfLines?: number;
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
  multiline = false,
  numberOfLines = 1,
}: Props) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  return (
    <VStack space="xs">
      <CustomText color="$textDark500">{label}</CustomText>
      <Input
        variant="outline"
        size="md"
        isDisabled={disabled}
        isInvalid={invalid}
        isReadOnly={readOnly}>
        <InputField
        fontSize={12}
          secureTextEntry={type === 'password' && !showPassword}
          keyboardType={keyboard}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          multiline={multiline}
          numberOfLines={numberOfLines}
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
        <CustomText fontSize={14} color={'$red700'}>
          {errorMessage}
        </CustomText>
      )}
    </VStack>
  );
}
