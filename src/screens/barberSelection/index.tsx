import {FlatList, Heading, VStack} from '@gluestack-ui/themed';
import React from 'react';
import {ListRenderItemInfo, } from 'react-native';
import {Box} from '@gluestack-ui/themed';
import SelectBarberCard from '../../components/selectBarberCard';

import {useGetBarbersQuery} from '../../api/barbersApi';
import Loader from '../../components/shared/loader';
import {Center} from '@gluestack-ui/themed';

export default function BarberSelection() {
  const {data: barbersData, isLoading, isError} = useGetBarbersQuery();
  return isLoading ? (
    <Loader />
  ) : (
    barbersData && (
      <>
        <Box bg="$primary100" flex={1}>
          <Box style={{marginTop: 38}}>
            <Heading textAlign="center" color="$textDark500">
              Selección de barbero
            </Heading>
            <FlatList
              contentContainerStyle={{paddingBottom: 50}}
              p="$4"
              data={barbersData.barbers}
              renderItem={(props: ListRenderItemInfo<any>) => {
                const {item} = props;
                return (
                  <Center>
                    <SelectBarberCard data={item} />
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
      </>
    )
  );
}
