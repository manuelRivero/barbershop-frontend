import {
  Text,
  Box,
  Image,
  VStack,
  Pressable,
  Icon,
  HStack,
} from '@gluestack-ui/themed';
import React, { useState } from 'react';
import { User } from '../../../types/user';
import { Settings } from 'lucide-react-native';
import SettingsModal from '../settingsModal';

interface Props {
  data: User | null;
}

export default function ProfileCard({ data }: Props) {
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  if (!data) return null;
  return (
    <>
      <Box p="$4" hardShadow="1" borderRadius={10} bg="$white">
        <VStack space="md" alignItems="center">
          <HStack justifyContent='flex-end' flexGrow={1} w="$full">
          </HStack>
          <Box
            hardShadow="1"
            bg="$white"
            borderRadius={9999}
            style={{ width: 100, height: 100 }}>

            <Image
              borderRadius={9999}
              style={{ width: 100, height: 100 }}
              source={{ uri: data.image }}
            />
          </Box>
          <Box>
            <Text
              color="$textDark500"
              textAlign="center">{`${data.name} ${data.lastname}`}</Text>
            <Text color="$textDark500" textAlign="center">{`${data.email}`}</Text>
          </Box>
        </VStack>
      </Box>
      <SettingsModal show={showSettingsModal} onClose={() => setShowSettingsModal(false)} />

    </>
  );
}
