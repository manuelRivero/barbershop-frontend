import React, {useEffect, useRef, useState} from 'react';
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
import {RootState, useAppDispatch, useAppSelector} from '../../store';
import {
  addService,
  setServiceForEdition,
  editService,
} from '../../store/features/servicesSlice';
import { hideInfoModal, showInfoModal } from '../../store/features/layoutSlice';

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
  const imageRef = useRef(null);
  const dispatch = useAppDispatch();
  const {serviceForEdition} = useAppSelector(
    (state: RootState) => state.services,
  );
  console.log('serviceForEdition', serviceForEdition);
  const ref = useRef();
  const {
    formState: {errors},
    handleSubmit,
    control,
    reset,
    watch,
  } = useForm<Form>();
  const [image, setImage] = useState<null | {uri: string | undefined}>(null);
  const [imageAlert, setImageAlert] = useState<string | null>(null);
  const submit = (values: Form) => {
    console.log('image on submit', image);
    setImageAlert(null);
    if (!image) {
      setImageAlert('La imagen del servicio es requerida');
      return;
    }
    if (serviceForEdition) {
      dispatch(editService({...values, image: image.uri, _id:serviceForEdition._id}));
     
    } else {
      dispatch(addService({...values, image: image.uri}));
    }
    dispatch(showInfoModal({
      title:"¡Servicio guardado!",
      type: "success",
      hasCancel: false,
      cancelCb:null,
      hasSubmit:false,
      submitCb:null,
      hideOnAnimationEnd: true
    }))
    dispatch(setServiceForEdition(null));
    reset({
      name: '',
      price: '',
      duration: '',
      description: '',
    });
    setImage(null);
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
  console.log('values', watch());
  useEffect(() => {
    if (serviceForEdition) {
      reset({
        name: serviceForEdition.name,
        price: serviceForEdition.price.toString(),
        duration: serviceForEdition.duration.toString(),
        description: serviceForEdition.description,
      });
      setImage({uri: serviceForEdition.image});
    } else {
      reset({
        name: '',
        price: '',
        duration: '',
        description: '',
      });
      setImage(null);
    }
  }, [serviceForEdition]);
  console.log('image', image);
  return (
    <Modal
      isOpen={show}
      onClose={() => {
        onClose();
        reset({
          name: '',
          price: '',
          duration: '',
          description: '',
        });
      }}
      finalFocusRef={ref}
      bg="$primary100">
      <ModalBackdrop />
      <ModalContent bg="$white">
        <ModalHeader>
          <Heading size="lg" color="$textDark900">
            Crear servicio
          </Heading>
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
              ref={imageRef}
              borderRadius={8}
              style={{width: 200, height: 200}}
              resizeMode="cover"
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
              title={serviceForEdition ? 'Guardar' : 'Crear servicio'}
              background={'$primary500'}
              color={'$white'}
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
