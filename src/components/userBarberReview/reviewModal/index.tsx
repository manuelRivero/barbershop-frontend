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

interface Props {
  onClose: () => void;
  show: boolean;
  barberId: number;
}
interface Form {
  comment: string;
  rating: string;
}
export default function ReviewModal({onClose, show, barberId}: Props) {
  const ref = useRef();
  const {
    formState: {errors},
    handleSubmit,
    control,
    watch,
  } = useForm<Form>();

  return (
    <Modal
      isOpen={show && Boolean(barberId)}
      onClose={onClose}
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
              <AirbnbRating
                count={5}
                showRating={false}
                defaultRating={4}
                size={24}
              />
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
              isLoading={false}
              disabled={false}
              color="$white"
              title="Enviar calificaciòn"
              hasIcon={false}
              onPress={() => {}}
            />
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
