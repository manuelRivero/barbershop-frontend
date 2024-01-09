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
  onSelect: (e: TurnSelectItem) => Promise<any>;
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
    onSelect(item)
  
  };
  return (
    <Modal isOpen={show} onClose={onClose} finalFocusRef={ref}>
      <ModalBackdrop />
      <ModalContent maxHeight={'$3/5'}>
        <ModalHeader>
          <Heading size="lg" color="$textDark500">Turnos disponibles</Heading>
          <ModalCloseButton>
            <Icon as={CloseIcon} />
          </ModalCloseButton>
        </ModalHeader>
        <Box p="$4">
          <Text textAlign="center" mb="$4" fontSize="$xl" color="$textDark500">{moment().utc().utcOffset(3, true).format("DD-MM-yyyy")}</Text>
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
                    
                    <Text color="$textDark500">{moment.utc(item.startDate).format('hh:mm A')} - {moment.utc(item.endDate).format('hh:mm A')}</Text>
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
