import {FlatList, Heading, ScrollView, VStack} from '@gluestack-ui/themed';
import React from 'react';
import {ListRenderItemInfo, Pressable} from 'react-native';
import ServiceCard from '../../components/shared/serviceCard';
import {Box} from '@gluestack-ui/themed';
import {User} from '../../types/user';
import SelectBarberCard from '../../components/selectBarberCard';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {useGetBarbersQuery} from '../../api/barbersApi';
import Loader from '../../components/shared/loader';

export default function BarberSelection() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const {data: barbersData, isLoading, isError} = useGetBarbersQuery();
console.log("barbersData", barbersData)
  return isLoading ? (
    <Box flex={1}>
      <VStack justifyContent="center" alignItems="center">
        <Loader />
      </VStack>
    </Box>
  ) : (
    barbersData &&
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
                <Pressable
                  onPress={() =>
                    navigation.navigate('UserServiceSelection', {
                      id: item._id,
                    })
                  }>
                  <SelectBarberCard data={item} />
                </Pressable>
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
  );
}
