import React, {useEffect, useRef, useState} from 'react';
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Icon,
  CloseIcon,
  Box,
  Pressable,
  VStack,
  HStack,
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
import {hideInfoModal, showInfoModal} from '../../store/features/layoutSlice';
import {
  useAddServiceMutation,
  useEditServicesMutation,
} from '../../api/servicesApi';
import {Dimensions, Platform} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import CustomText from '../shared/text';
import CustomHeading from '../shared/heading';
import {X} from 'lucide-react-native';

const {width} = Dimensions.get('window');

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
  const ref = useRef();
  const dispatch = useAppDispatch();
  const {serviceForEdition} = useAppSelector(
    (state: RootState) => state.services,
  );
  const [EditServiceRequest, {isLoading: isLoadingEditService}] =
    useEditServicesMutation();
  const [addServiceRequest, {isLoading: isLoadingAddService}] =
    useAddServiceMutation();
  const {
    formState: {errors},
    handleSubmit,
    control,
    reset,
    watch,
  } = useForm<Form>();
  const [images, setImages] = useState<
    {uri: string | undefined; publicId: string | undefined}[] | null
  >(null);
  const [imagesForDelete, setImagesForDelete] = useState<{publicId: string}[]>(
    [],
  );
  const [imagesBlob, setImagesBlob] = useState<Asset[] | null>(null);
  const [imageAlert, setImageAlert] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState<number>(0);

  const submit = async (values: Form) => {
    const form = new FormData();
    form.append('name', values.name);
    form.append('price', values.price);
    form.append('description', values.description);
    form.append('duration', values.duration);

    setImageAlert(null);
    if (!imagesBlob && !serviceForEdition) {
      setImageAlert('La imagen del servicio es requerida');
      return;
    }

    if (serviceForEdition) {
      try {
        form.append('id', serviceForEdition._id);
        if (imagesForDelete.length > 0) {
          imagesForDelete.forEach(e => {
            form.append('imageForDelete', e.publicId);
          });
        }
        imagesBlob?.forEach((e: Asset) => {
          form.append('image', {
            uri: Platform.select({
              ios: e?.uri?.replace('file://', ''),
              android: e?.uri,
            }),
            type: e?.type,
            name: e?.fileName,
          });
        });

        const response = await EditServiceRequest(form).unwrap();
        console.log('response', response);
        dispatch(
          editService({
            ...values,
            images: response.targetService.images,
            _id: serviceForEdition._id,
          }),
        );
        dispatch(
          showInfoModal({
            title: '¡Servicio guardado!',
            type: 'success',
            hasCancel: false,
            cancelCb: null,
            hasSubmit: false,
            submitCb: null,
            hideOnAnimationEnd: true,
          }),
        );
        dispatch(setServiceForEdition(null));
        reset({
          name: '',
          price: '',
          duration: '',
          description: '',
        });
        setImages(null);
        onClose();
      } catch (error) {
        console.log('error al editar el servicio', error);
      }
    } else {
      imagesBlob?.forEach((e: Asset) => {
        form.append('image', {
          uri: Platform.select({
            ios: e?.uri?.replace('file://', ''),
            android: e?.uri,
          }),
          type: e?.type,
          name: e?.fileName,
        });
      });
      try {
        const response = await addServiceRequest(form).unwrap();
        console.log('response', response);
        dispatch(addService({...response.service}));
        dispatch(
          showInfoModal({
            title: '¡Servicio guardado!',
            type: 'success',
            hasCancel: false,
            cancelCb: null,
            hasSubmit: false,
            submitCb: null,
            hideOnAnimationEnd: true,
          }),
        );
        dispatch(setServiceForEdition(null));
        reset({
          name: '',
          price: '',
          duration: '',
          description: '',
        });
        setImages(null);
        onClose();
      } catch (error) {
        console.log('error al crear el servicio', error);
      }
    }
  };
  const handleGallery = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
    });
    console.log('result', result);
    if (result.assets) {
      console.log('result.assets[0].uri', result.assets[0].uri);
      const imagesList = images ? images : [];
      const blobsList = imagesBlob ? imagesBlob : [];
      setImages([...imagesList, {uri: result.assets[0].uri}]);
      setImagesBlob([...blobsList, result.assets[0]]);
    }
  };

  const handleDelete = (publicId: string | undefined, index: number) => {
    const newImagesList = images ? [...images] : [];
    const newBlobsList = imagesBlob ? [...imagesBlob] : [];
    const filteredImages = newImagesList.filter((_, i) => i !== index);
    const filteredBlobs = newBlobsList.filter((_, i) => i !== index);
    console.log('filteredImages', filteredImages);
    console.log('filteredBlobs ', filteredBlobs);
    setImages(filteredImages.length > 0 ? filteredImages : null);
    setImagesBlob(filteredBlobs.length > 0 ? filteredBlobs : null);
    if (publicId) {
      setImagesForDelete([...imagesForDelete, {publicId}]);
    }
  };
  console.log('images ', images);
  useEffect(() => {
    setImagesForDelete([]);
    if (serviceForEdition) {
      reset({
        name: serviceForEdition.name,
        price: serviceForEdition.price.toString(),
        duration: serviceForEdition.duration.toString(),
        description: serviceForEdition.description,
      });
      console.log('images', serviceForEdition.images);
      setImages(
        serviceForEdition.images.map(e => ({uri: e.url, publicId: e.publicId})),
      );
    } else {
      reset({
        name: '',
        price: '',
        duration: '',
        description: '',
      });
      setImages(null);
    }
  }, [serviceForEdition]);

  return (
    <Modal
      isOpen={show}
      onClose={() => {
        console.log('close');
        onClose();
        dispatch(setServiceForEdition(null));
      }}
      finalFocusRef={ref}>
      <ModalBackdrop />
      <ModalContent bg="$white" maxHeight={'$3/4'}>
        <ModalHeader>
          <CustomHeading>Crear servicio</CustomHeading>
          <ModalCloseButton>
            <Icon color="$textDark500" as={CloseIcon} />
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
          <CustomText mt="$2">
            Selecciona las imágenes de tu servicio
          </CustomText>
          {images && images.length > 0 ? (
            <VStack mt={'$2'} justifyContent="center">
              <Carousel
                data={images}
                layout={'default'}
                onSnapToItem={index => setActiveSlide(index)}
                renderItem={({item, index}) => {
                  console.log('index', index);
                  return (
                    <Box position="relative" style={{width: 200, height: 200}}>
                      <Box
                        bg="$red500"
                        w="auto"
                        top={5}
                        right={5}
                        zIndex={2}
                        position="absolute"
                        p="$2"
                        borderRadius={'$3xl'}>
                        <Pressable
                          onPress={() =>
                            handleDelete(item.publicId || null, index)
                          }>
                          <Icon
                            as={X}
                            size={20}
                            alt="Eliminar"
                            color="$white"
                          />
                        </Pressable>
                      </Box>
                      <Image
                        ref={imageRef}
                        borderRadius={8}
                        style={{width: 200, height: 200}}
                        resizeMode="cover"
                        source={{uri: item.uri}}
                        alt="imagen-de-servicio"
                      />
                    </Box>
                  );
                }}
                sliderWidth={width}
                itemWidth={width * 0.8}
              />
              <Pagination
                dotStyle={{
                  backgroundColor: '#367187',
                }}
                dotsLength={images.length}
                activeDotIndex={activeSlide}
              />
            </VStack>
          ) : (
            <Box mt={'$2'}>
              <VStack justifyContent="center" alignItems="center" mt={'$4'}>
                <Pressable onPress={handleGallery}>
                  <Image
                    ref={imageRef}
                    borderRadius={8}
                    style={{width: 200, height: 200}}
                    resizeMode="cover"
                    source={require('./../../assets/images/image-placeholder.png')}
                    alt="imagen-de-servicio"
                  />
                </Pressable>
              </VStack>
            </Box>
          )}
          {imageAlert && (
            <CustomText fontSize={14} color={'$red700'}>
              {imageAlert}
            </CustomText>
          )}
          {images?.length === 4 && (
            <CustomText fontSize={14}>
              Has alcanzado el limite de imagenes por servicio
            </CustomText>
          )}
          {(!images || (images && images?.length < 4)) && (
            <HStack mt={'$2'} width={'100%'} justifyContent="center">
              <LinkButton
                title={!images ? 'Seleccionar imagen' : 'Agregar otra imagen'}
                color="$primary500"
                onPress={handleGallery}
                isLoading={false}
                disabled={false}
                hasIcon={false}
              />
            </HStack>
          )}
        </ModalBody>
        <ModalFooter>
          <HStack width={'100%'} justifyContent="center">
            <BaseButton
              title={serviceForEdition ? 'Guardar' : 'Crear servicio'}
              background={'$primary500'}
              color={'$white'}
              onPress={handleSubmit(submit)}
              isLoading={isLoadingEditService || isLoadingAddService}
              disabled={isLoadingEditService || isLoadingAddService}
              hasIcon={false}
            />
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
