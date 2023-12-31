import {
  CloseIcon,
  Heading,
  Icon,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Text,
  Modal,
  ModalBackdrop,
} from '@gluestack-ui/themed';
import {useRef} from 'react';
import BaseInput from '../../shared/baseInput';
import {useForm, Controller} from 'react-hook-form';
import {Box} from '@gluestack-ui/themed';
import BaseButton from '../../shared/baseButton';
import {HStack} from '@gluestack-ui/themed';
import {AirbnbRating} from 'react-native-ratings';
import {VStack} from '@gluestack-ui/themed';
import BaseTextArea from '../../shared/baseTextArea';
import { useCreateReviewMutation } from '../../../api/reviewsApi';
import { useAppDispatch } from '../../../store';
import { hideInfoModal, showInfoModal } from '../../../store/features/layoutSlice';


interface Props {
  onClose: () => void;
  show: boolean;
  barberId: number;
}
interface Form {
  comment: string;
  score: string;
}
export default function ReviewModal({onClose, show, barberId}: Props) {
  const dispatch = useAppDispatch()
  const [createReview, {isLoading}] = useCreateReviewMutation()
  const ref = useRef();
  const {
    formState: {errors},
    handleSubmit,
    control,
    watch,
    reset
  } = useForm<Form>();

  const submit = async (values:Form)=>{
    console.log("values", values)
    try {
      await createReview({
        barber:barberId,
        comment: values.comment,
        score: parseFloat(values.score)
      }).unwrap()
      onClose()
      reset()
      dispatch(
        showInfoModal({
          title: '¡Calificación enviada!',
          type: 'success',
          hasCancel: false,
          cancelCb: null,
          hasSubmit: false,
          submitCb: null,
          hideOnAnimationEnd: true,
        }),
      );
    } catch (error) {
      showInfoModal({
        title: '¡No se pudo guardar tu calificación!',
        type: 'error',
        hasCancel: false,
        cancelCb: null,
        hasSubmit: true,
        submitCb: ()=> dispatch(hideInfoModal()),
        submitData: {
          text: 'Intentar nuevamente',
          background: '$primary500',
        },
        hideOnAnimationEnd: false,
      })
    }
  }

  return (
    <Modal
      isOpen={show && Boolean(barberId)}
      onClose={()=> {onClose(); reset()}}
      finalFocusRef={ref}>
      <ModalBackdrop />
      <ModalContent bg={'$white'}>
        <ModalHeader>
          <Heading size="lg"></Heading>
          <ModalCloseButton>
            <Icon as={CloseIcon} />
          </ModalCloseButton>
        </ModalHeader>
        <ModalBody>
          <VStack mb="$4" justifyContent='flex-start'>
            <Text color="$textDark500">Calificación</Text>
            <HStack>
            <Controller
              name="score"
              control={control}
              render={({field, fieldState}) => {
                return (<AirbnbRating
                  count={5}
                  showRating={false}
                  defaultRating={0}
                  size={24}
                  onFinishRating={(rating:number) => field.onChange(rating)}
                />)
              }} />
              
            </HStack>
          </VStack>
          <Box mb="$4">
            <Controller
              name="comment"
              control={control}
              render={({field, fieldState}) => {
                return (
                  <BaseTextArea
                    label="Comentario"
                    value={field.value}
                    onChange={e => field.onChange(e.nativeEvent.text)}
                    invalid={fieldState.error ? true : false}
                    errorMessage={
                      fieldState.error ? fieldState.error.message : undefined
                    }
                    placeholder="Agrega un comentario a tu calificación"
                  />
                );
              }}
              rules={{
                required: 'Campo requerido',
              }}
            />
          </Box>
          <HStack justifyContent="center">
            <BaseButton
              background="$primary500"
              isLoading={isLoading}
              disabled={isLoading}
              color="$white"
              title="Enviar calificaciòn"
              hasIcon={false}
              onPress={handleSubmit(submit)}
            />
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
