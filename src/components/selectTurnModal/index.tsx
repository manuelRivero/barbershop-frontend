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
  FlatList,
  Box,
  Pressable,
} from '@gluestack-ui/themed';
import {TurnSelectItem} from '../../types/turns';
import {ListRenderItemInfo} from 'react-native';
import moment from 'moment';
import {useAppDispatch} from '../../store';
import {showInfoModal} from '../../store/features/layoutSlice';

interface Props {
  show: boolean;
  onClose: () => void;
  turns: TurnSelectItem[];
  onSelect: (e: TurnSelectItem) => void;
}

export default function SelectTurnModal({
  show,
  onClose,
  turns,
  onSelect,
}: Props) {
  const dispatch = useAppDispatch();
  const ref = useRef();

  const handleSelect = (item: TurnSelectItem): void => {
    dispatch(
      showInfoModal({
        title: `¡Deseas agendar este turno ${moment(item.startDate).format(
          'hh:mm',
        )}?`,
        type: 'info',
        hasCancel: true,
        cancelCb: () => onClose(),
        hasSubmit: true,
        submitCb: () => {
          onSelect(item);
          dispatch(
            showInfoModal({
              title: '¡Turno agendado!',
              type: 'success',
              hasCancel: false,
              cancelCb: null,
              hasSubmit: false,
              submitCb: null,
              hideOnAnimationEnd: true,
              submitData: null,
              cancelData: null,
            }),
          );
        },
        hideOnAnimationEnd: false,
        submitData: {
          text: 'Agendar',
          background: '$green500',
        },
        cancelData: {
          text: 'Cancelar',
          background: '$blueGray200',
        },
      }),
    );
  };
  return (
    <Modal isOpen={show} onClose={onClose} finalFocusRef={ref}>
      <ModalBackdrop />
      <ModalContent maxHeight={'$3/5'}>
        <ModalHeader>
          <Heading size="lg">Turnos disponibles</Heading>
          <ModalCloseButton>
            <Icon as={CloseIcon} />
          </ModalCloseButton>
        </ModalHeader>
        <Box p="$4">
          <FlatList
            data={turns}
            ItemSeparatorComponent={() => {
              return (
                <Box
                  style={{
                    height: 15,
                    width: '100%',
                  }}
                />
              );
            }}
            renderItem={(props: ListRenderItemInfo<any>) => {
              const {item} = props;
              return (
                <Pressable onPress={() => handleSelect(item)}>
                  <Box softShadow={'1'} p="$4" borderRadius="$lg" bg="$white">
                    <Text>{moment(item.startDate).format('hh:mm')}</Text>
                  </Box>
                </Pressable>
              );
            }}
          />
        </Box>
      </ModalContent>
    </Modal>
  );
}
