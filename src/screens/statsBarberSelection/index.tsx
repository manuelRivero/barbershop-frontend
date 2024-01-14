import { Center, FlatList, Heading, ScrollView, VStack } from '@gluestack-ui/themed';
import React, { useEffect, useState } from 'react';
import { Dimensions, ListRenderItemInfo, Pressable } from 'react-native';
import ServiceCard from '../../components/shared/serviceCard';
import { Box } from '@gluestack-ui/themed';
import SelectBarberCard from '../../components/selectBarberCard';

import { useGetBarberDetailQuery, useGetBarbersQuery } from '../../api/barbersApi';
import Loader from '../../components/shared/loader';
import SelectBarberOptionsModal from '../../components/selectedBarberOptionsModal';
import BarberstatsCard from '../../components/barbersStats/barberStatsCard';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');


export default function StatsBarberSelection() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const { data: barbersData, isLoading, isError, refetch } = useGetBarbersQuery();

  React.useEffect(() => {
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
          <Box mt="$8">
            <Heading textAlign="center" color="$textDark500">
              Resumen de barberos
            </Heading>
            <FlatList
              mt="$10"
              contentContainerStyle={{ paddingBottom: 50 }}
              p="$4"
              data={barbersData.barbers}
              renderItem={(props: ListRenderItemInfo<any>) => {
                const { item } = props;
                return (
                  <Center p="$4">

                    <BarberstatsCard data={item} />
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
      </LinearGradient>
    )
  );
}
