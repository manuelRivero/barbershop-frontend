import { Center, FlatList, Heading, ScrollView, VStack } from '@gluestack-ui/themed';
import React, { useEffect, useState } from 'react';
import { Dimensions, ListRenderItemInfo, Pressable } from 'react-native';
import ServiceCard from '../../components/shared/serviceCard';
import { Box } from '@gluestack-ui/themed';
import SelectBarberCard from '../../components/selectBarberCard';

import { useGetBarbersQuery } from '../../api/barbersApi';
import Loader from '../../components/shared/loader';
import SelectBarberOptionsModal from '../../components/selectedBarberOptionsModal';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

export default function BarberSelection() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { data: barbersData, isLoading, isError, refetch } = useGetBarbersQuery();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedBarber, setSelectedBarber] = useState<number | null>(null);
  useEffect(() => {
    if (selectedBarber) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [selectedBarber]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      refetch();
    });

    return unsubscribe;
  }, [navigation]);
  return isLoading ? (
    <Loader />
  ) : (
    barbersData && (
      <LinearGradient
        style={{ flex: 1 }}
        colors={['#fff', '#f1e2ca']}
        start={{ x: 0, y: 0.6 }}
        end={{ x: 0, y: 1 }}>
        <Box flex={1} position='relative'>
          <Box
            borderRadius={9999}
            w={width * 3}
            h={width * 3}
            position="absolute"
            bg="#f1e2ca"
            overflow="hidden"
            top={-width * 2.75}
            left={-width}
            opacity={0.5}
          />
          <Box flex={1}>
            <Box style={{ marginTop: 38 }}>
              <Heading textAlign="center" color="$textDark500">
                Selección de barbero
              </Heading>
              <FlatList
                mt="$10"
                contentContainerStyle={{ paddingBottom: 50 }}
                p="$4"
                data={barbersData.barbers}
                renderItem={(props: ListRenderItemInfo<any>) => {
                  const { item } = props;
                  return (
                    <Center>

                      <SelectBarberCard data={item} selectBarber={() => setSelectedBarber(item._id)} />
                    </Center>
                  );
                }}
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
              />
            </Box>
          </Box>
          <SelectBarberOptionsModal
            show={isOpen}
            barberId={selectedBarber}
            onClose={() => {
              setSelectedBarber(null);
            }}
          />
        </Box>
      </LinearGradient>
    )
  );
}
