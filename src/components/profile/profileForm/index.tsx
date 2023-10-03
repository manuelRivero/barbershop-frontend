import React, {useState, useEffect} from 'react';
import {
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
  Box,
  HStack,
  Image,
  Pressable,
} from '@gluestack-ui/themed';
import {useForm, Controller} from 'react-hook-form';
import {Asset, launchImageLibrary} from 'react-native-image-picker';

import LinkButton from '../../shared/linkButton';
import BaseButton from '../../shared/baseButton';
import BaseInput from '../../shared/baseInput';
import {useAppDispatch, useAppSelector} from '../../../store';
import {Edit} from 'lucide-react-native';
import {setUser} from '../../../store/features/authSlice';
interface Props {
  show: boolean;
  onClose: () => void;
}
interface Form {
  name: string;
  lastname: string;
}
export default function ProfileForm({show, onClose}: Props) {
  const dispatch = useAppDispatch();
  const {user} = useAppSelector((state: RootState) => state.auth);
  const {
    formState: {errors},
    handleSubmit,
    control,
    watch,
    reset,
  } = useForm<Form>({
    defaultValues: {
      name: user?.name,
      lastname: user.lastname,
    },
  });
  const [image, setImage] = useState<null | {uri: string | undefined}>(null);
  const [imageAlert, setImageAlert] = useState<string | null>(null);

  const submit = (values: Form): void => {
    console.log('submit');
    dispatch(
      setUser({
        ...values,
        image: image.uri,
      }),
    );
    handleClose()
  };

  const handleClose = (): void => {
    onClose();
  };
  const handleGallery = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
    });
    console.log('result', result);
    if (result.assets) {
      console.log('result.assets[0].uri', result.assets[0].uri);
      setImage({uri: result.assets[0].uri});
    }
  };
  useEffect(() => {
    setImage({uri: user?.image});
  }, [user]);
  return (
    <Modal isOpen={show} onClose={handleClose} bg="$primary100">
      <ModalBackdrop />
      <ModalContent bg="$white" p="$4">
        <ModalHeader>
          <Heading size="lg" color="$textDark900">
            Edición de perfil
          </Heading>
          <ModalCloseButton>
            <Icon as={CloseIcon} />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <HStack mt={'$2'} justifyContent="center">
            <Box position="relative">
              <Image
                borderRadius={9999}
                style={{width: 200, height: 200}}
                resizeMode="cover"
                source={
                  image
                    ? image
                    : require('../../../assets/images/image-placeholder.png')
                }
                alt="imagen-de-servicio"
              />
              <Pressable onPress={handleGallery}>
                <Box
                  borderRadius={9999}
                  p={'$4'}
                  bg="$primary500"
                  position="absolute"
                  bottom={10}
                  right={10}>
                  <Icon
                    as={Edit}
                    color="$white"
                    alt="editar-imagen-de-perfil"
                  />
                </Box>
              </Pressable>
            </Box>
          </HStack>
          {imageAlert && (
            <Text fontSize={14} textAlign="center" color={'$red700'}>
              {imageAlert}
            </Text>
          )}
          <Box mb="$4">
            <Controller
              name="name"
              control={control}
              render={({field, fieldState}) => {
                return (
                  <BaseInput
                    keyboard="default"
                    label="Nombre"
                    value={field.value}
                    onChange={e => field.onChange(e.nativeEvent.text)}
                    invalid={fieldState.error ? true : false}
                    errorMessage={
                      fieldState.error ? fieldState.error.message : undefined
                    }
                    placeholder="Ingresa tu nombre"
                  />
                );
              }}
              rules={{
                required: 'Campo requerido',
              }}
            />
          </Box>
          <Box mb="$4">
            <Controller
              name="lastname"
              control={control}
              render={({field, fieldState}) => {
                return (
                  <BaseInput
                    keyboard="default"
                    label="Apellido"
                    value={field.value}
                    onChange={e => field.onChange(e.nativeEvent.text)}
                    invalid={fieldState.error ? true : false}
                    errorMessage={
                      fieldState.error ? fieldState.error.message : undefined
                    }
                    placeholder="Ingresa tu apellido"
                  />
                );
              }}
              rules={{
                required: 'Campo requerido',
              }}
            />
          </Box>
        </ModalBody>
        <ModalFooter mt="$4">
          <HStack
            space="2xl"
            position="absolute"
            bottom={10}
            width={'100%'}
            justifyContent="center">
            <LinkButton
              color="$primary500"
              title="Cancelar"
              onPress={() => {}}
              isLoading={false}
              disabled={false}
            />
            <BaseButton
              title="Guadar"
              background={'$primary500'}
              color={'$white'}
              onPress={handleSubmit(submit)}
              isLoading={false}
              disabled={false}
            />
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
