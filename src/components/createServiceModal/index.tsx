import React, {useRef, useState} from 'react';
import {
  Button,
  Heading,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Icon,
  Text,
  CloseIcon,
  ButtonText,
  FlatList,
  Box,
  Pressable,
  Input,
  InputField,
  VStack,
  HStack,
  AddIcon,
  Image,
} from '@gluestack-ui/themed';
import BaseInput from '../shared/baseInput';
import BaseTextArea from '../shared/baseTextArea';
import BaseButton from '../shared/baseButton';
import LinkButton from '../shared/linkButton';
import {useForm, Controller} from 'react-hook-form';
import {Asset, launchImageLibrary} from 'react-native-image-picker';

interface Props {
  show: boolean;
  onClose: () => void;
}

interface Form {
  name: string;
  price: string;
  duration: string;
  description: string;
}

export default function CreateServiceModal({show, onClose}: Props) {
  const ref = useRef();
  const {
    formState: {errors},
    handleSubmit,
    control,
  } = useForm<Form>();
  const [image, setImage] = useState<Asset | null>(null);
  const [imageAlert, setImageAlert] = useState<string | null>(null);
  const submit = (values: Form) => {
    setImageAlert(null);
    if (image) {
      setImageAlert('La imagen del servicio es requerida');
      return;
    }
    console.log('values', values);
  };
  const handleGallery = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
    });
    console.log('result', result);
    if (result.assets) {
      console.log('result.assets[0].uri', result.assets[0].uri);
      setImage(result.assets[0]);
    }
  };
  console.log('image', image);
  return (
    <Modal isOpen={show} onClose={onClose} finalFocusRef={ref}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading size="lg" color="$textDark900">Crear servicio</Heading>
          <ModalCloseButton>
            <Icon as={CloseIcon} />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <Box mb={'$2'}>
            <Controller
              name="name"
              control={control}
              render={({field, fieldState}) => {
                return (
                  <BaseInput
                    errorMessage={
                      fieldState.error ? fieldState.error.message : undefined
                    }
                    value={field.value}
                    onChange={e => field.onChange(e.nativeEvent.text)}
                    keyboard={'default'}
                    label="Nombre del servicio"
                    disabled={false}
                    invalid={fieldState.error ? true : false}
                    readOnly={false}
                    placeholder="Ingresa el nombre del servicio"
                  />
                );
              }}
              rules={{
                required: 'Campo requerido',
                maxLength: {value: 80, message: 'Máximo 80 caracteres'},
              }}
            />
          </Box>
          <Box mb={'$2'}>
            <Controller
              name="price"
              control={control}
              render={({field, fieldState}) => {
                console.log('field state', fieldState);
                console.log('value', field.value);
                return (
                  <BaseInput
                    errorMessage={
                      fieldState.error ? fieldState.error.message : undefined
                    }
                    value={field.value}
                    onChange={e => field.onChange(e.nativeEvent.text)}
                    keyboard={'number-pad'}
                    label="Precio del servicio"
                    disabled={false}
                    invalid={fieldState.error ? true : false}
                    readOnly={false}
                    placeholder="Ingresa el precio del servicio"
                  />
                );
              }}
              rules={{
                required: 'Campo requerido',
                maxLength: {value: 10, message: 'Máximo 10 caracteres'},
                pattern: {
                  value: /^(0|[1-9]\d*)(\.\d+)?$/,
                  message: 'Solo se permiten numeros',
                },
              }}
            />
          </Box>
          <Box mb={'$2'}>
            <Controller
              name="duration"
              control={control}
              render={({field, fieldState}) => (
                <BaseInput
                  errorMessage={
                    fieldState.error ? fieldState.error.message : undefined
                  }
                  value={field.value}
                  onChange={e => field.onChange(e.nativeEvent.text)}
                  keyboard={'number-pad'}
                  label="Duración del servicio en minutos"
                  disabled={false}
                  invalid={fieldState.error ? true : false}
                  readOnly={false}
                  placeholder="Ingresa la duración del servicio"
                />
              )}
              rules={{
                required: 'Campo requerido',
                maxLength: {value: 10, message: 'Máximo 10 caracteres'},
                pattern: {
                  value: /^(0|[1-9]\d*)(\.\d+)?$/,
                  message: 'Solo se permiten numeros',
                },
              }}
            />
          </Box>
          <Box mb={'$2'}>
            <Controller
              name="description"
              control={control}
              render={({field, fieldState}) => (
                <BaseTextArea
                  errorMessage={
                    fieldState.error ? fieldState.error.message : undefined
                  }
                  value={field.value}
                  onChange={e => field.onChange(e.nativeEvent.text)}
                  label="Descripción del servicio"
                  disabled={false}
                  invalid={fieldState.error ? true : false}
                  readOnly={false}
                  placeholder="Ingresa la descripción del servicio"
                />
              )}
              rules={{
                required: 'Campo requerido',
                maxLength: {value: 160, message: 'Máximo 160 caracteres'},
              }}
            />
          </Box>
          <HStack mt={'$2'} justifyContent="center">
            <Image
              borderRadius={8}
              maxWidth={'$32'}
              maxHeight={'$32'}
              resizeMode="contain"
              source={
                image
                  ? image
                  : require('../../assets/images/image-placeholder.png')
              }
              alt="imagen-de-servicio"
            />
          </HStack>
          {imageAlert && (
            <Text fontSize={14} color={'$red700'}>
              {imageAlert}
            </Text>
          )}
          <HStack mt={'$2'} width={'100%'} justifyContent="center">
            <LinkButton
              title="Seleccionar imagen"
              color="$primary500"
              onPress={handleGallery}
              isLoading={false}
              disabled={false}
              hasIcon={false}
            />
          </HStack>
        </ModalBody>
        <ModalFooter>
          <HStack mt={'$2'} width={'100%'} justifyContent="center">
            <BaseButton
              title="Crear servicio"
              background={"$primary500"}
              color={"$white"}
              onPress={handleSubmit(submit)}
              isLoading={false}
              disabled={false}
              hasIcon={false}
            />
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
