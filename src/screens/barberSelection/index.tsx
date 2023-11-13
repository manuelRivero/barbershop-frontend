import {FlatList, Heading, ScrollView} from '@gluestack-ui/themed';
import React from 'react';
import {ListRenderItemInfo, Pressable} from 'react-native';
import ServiceCard from '../../components/shared/serviceCard';
import {Box} from '@gluestack-ui/themed';
import {User} from '../../types/user';
import SelectBarberCard from '../../components/selectBarberCard';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import userSchedule from '../userSchedule';

const barbers: User[] = [
  {
    name: 'Alejandro',
    lastname: 'Pina',
    image: 'https://cdn-icons-png.flaticon.com/512/666/666201.png',
    email: 'alejjose8@gmail.com',
    _id: '651f33c5ac77ef437b290141',
    role: 'barber',
  },
];

export default function BarberSelection() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <>
      <Box bg="$primary100" flex={1}>
        <Box style={{marginTop: 38}}>
          <Heading textAlign="center" color="$textDark500">
            Selección de barbero
          </Heading>
          <FlatList
            contentContainerStyle={{paddingBottom: 50}}
            p="$4"
            data={barbers}
            renderItem={(props: ListRenderItemInfo<any>) => {
              const {item} = props;
              return (
                <Pressable onPress={() => navigation.navigate("UserSchedule", {
                    id: item._id,
                  })}>
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
