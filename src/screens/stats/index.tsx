import {
  Box,
  FlatList,
  HStack,
  Heading,
  Icon,
  ScrollView,
  Text,
} from '@gluestack-ui/themed';
import React from 'react';
import {RootState, useAppSelector} from '../../store';
import {Event} from '../../types/turns';
import Clock from 'react-live-clock';
import {Dimensions, ListRenderItemInfo} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {CircleDollarSign} from 'lucide-react-native';

const total = [
  {
    day: 'lunes',
    turns: 4,
    total: 12000,
  },
  {
    day: 'martes',
    turns: 8,
    total: 24000,
  },
  {
    day: 'miercoles',
    turns: 2,
    total: 6000,
  },

  {day: 'jueves', turns: 8, total: 24000},
  {
    day: 'viernes',
    turns: 8,
    total: 18000,
  },
  {
    day: 'sabado',
    turns: 10,
    total: 30000,
  },
];
const data = {
  turns: [4, 8, 2, 8, 6, 10],
  labels: ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'],
  datasets: [
    {
      data: [12000, 24000, 6000, 25000, 18000, 30000],
      color: (opacity = 1) => `#367187`, // optional
      strokeWidth: 2, // optional
    },
  ],
};

const chartConfig = {
  backgroundGradientFrom: '#f9f3ea',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#b37025',
  backgroundGradientToOpacity: 0.5,
  color: () => '#367187',
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  useShadowColorFromDataset: false, // optional
};

export default function Stats() {
  const {turns} = useAppSelector((state: RootState) => state.turns);
  return (
    <Box flex={1} bg="$primary100">
      <ScrollView flex={1}>
        <HStack mt={'$4'} width={'100%'} justifyContent="center">
          <Clock
            format={'hh:mm:ss'}
            ticking={true}
            element={Text}
            style={{fontSize: 22, color: '#1f3d56'}}
          />
        </HStack>
        <Heading textAlign="center" color="$textDark500">
          Estadisticas
        </Heading>

        <Box p="$4">
          <Box softShadow={'1'} p="$4" mb="$4" borderRadius="$lg" bg="$white">
            <Text color="$textDark500">
              Cortes realizados el día de hoy:{' '}
              <Text color="$textDark500" fontWeight="bold">
                {
                  turns.filter((turn: Event) => turn.status === 'COMPLETE')
                    .length
                }
              </Text>
            </Text>
            <HStack alignItems="center">
              <Text color="$textDark500">Total el día de hoy: </Text>
              <Text color="$textDark500" fontWeight="bold">
                {turns.reduce((accumulator, object) => {
                  return object.status === 'COMPLETE'
                    ? accumulator + object.price
                    : accumulator;
                }, 0)}{' '}
                Pesos
              </Text>
            </HStack>
            <Text color="$textDark500">
              Cortes pendientes el día de hoy:{' '}
              <Text color="$textDark500" fontWeight="bold">
                {
                  turns.filter((turn: Event) => turn.status !== 'COMPLETE')
                    .length
                }
              </Text>
            </Text>
          </Box>

          <Box mt={'$4'} position='relative'>
            <LineChart
              data={data}
              width={350}
              height={350}
              chartConfig={chartConfig}
              verticalLabelRotation={30}
              bezier
              renderDotContent = {({x, y, index, indexData})=>{
                console.log("Index data", indexData)
                return(<Text position='absolute' color="$textDark500" top={y} left={x}>{indexData}</Text>)
              }}
              fromZero
            />
          </Box>
          <Box mt="$4">
            {total.map(item => {
              return (
                <Box
                  key={item.day}
                  softShadow={'1'}
                  p="$4"
                  mb="$4"
                  borderRadius="$lg"
                  bg="$white">
                  <Text color="$textDark500">
                    {`Total para el día ${item.day}: `}
                    <Text color="$textDark500" fontWeight="bold">
                      {item.total}
                    </Text>
                  </Text>
                  <Text color="$textDark500">
                    cortes realizados:{' '}
                    <Text color="$textDark500" fontWeight="bold">
                      {item.turns}
                    </Text>
                  </Text>
                </Box>
              );
            })}
          </Box>
        </Box>
      </ScrollView>
    </Box>
  );
}
