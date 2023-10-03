import React, {useRef} from 'react';
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
  Box,
  HStack,
} from '@gluestack-ui/themed';
import {RootState, useAppDispatch, useAppSelector} from '../../../store';
import {hideInfoModal} from '../../../store/features/layoutSlice';
import LottieView from 'lottie-react-native';

const animations = {
  success: require('../../../assets/lottie/success.json'),
  info: require('../../../assets/lottie/info.json'),
};

export default function InfoModal() {
  const dispatch = useAppDispatch();
  const {infoModal} = useAppSelector((state: RootState) => state.layout);

  const handleClose = () => {
    dispatch(hideInfoModal());
  };

  const handleCancel = () => {
    if (infoModal?.cancelCb) {
      infoModal.cancelCb();
    }
  };
  const handleSubmit = () => {
    if (infoModal?.submitCb) {
      infoModal.submitCb();
    }
  };
  const handleAnimationEnd = () => {
    console.log('on animation end');
    if (infoModal?.hideOnAnimationEnd) {
      dispatch(hideInfoModal());
    }
  };
  return (
    <Modal isOpen={Boolean(infoModal)} onClose={handleClose} bg="$primary100">
      <ModalBackdrop />
      <ModalContent bg="$white" p="$4">
        <ModalBody>
          <HStack justifyContent="center">
            <LottieView
              style={{width: 150, height: 150}}
              source={animations[infoModal?.type as keyof typeof animations]}
              onAnimationFinish={() => handleAnimationEnd()}
              autoPlay
              loop={false}
            />
          </HStack>
          <Text textAlign="center" color={'$textDark500'}>
            {infoModal?.title}
          </Text>
        </ModalBody>
        <ModalFooter>
          <HStack justifyContent="center" space="2xl" w="$full">
            {infoModal?.hasCancel && infoModal?.cancelData && (
              <Button
                variant="solid"
                size="sm"
                bg={infoModal?.cancelData?.background}
                onPress={handleSubmit}>
                <ButtonText color={'$blueGray500'}>
                  {infoModal?.cancelData?.text}
                </ButtonText>
              </Button>
            )}
            {infoModal?.hasSubmit && infoModal?.submitData && (
              <Button
                variant="solid"
                size="sm"
                bg={infoModal?.submitData?.background}
                borderColor={'$blueGray500'}
                onPress={handleSubmit}>
                <ButtonText color={'$white'}>
                  {infoModal?.submitData?.text}
                </ButtonText>
              </Button>
            )}
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
