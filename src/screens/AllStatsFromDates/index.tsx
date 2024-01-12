import {
    Box,
    FlatList,
    HStack,
    Heading,
    Icon,
    ScrollView,
    Text,
    VStack,
} from '@gluestack-ui/themed';
import React, { useEffect, useState } from 'react';
import { RootState, useAppSelector } from '../../store';
import { Event } from '../../types/turns';
import Clock from 'react-live-clock';
import { LineChart } from 'react-native-chart-kit';
import { useGetAllStatsFromDatesQuery, useGetWeekStatsQuery } from '../../api/statsApi';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import Loader from '../../components/shared/loader';
import { Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ChevronLeftIcon } from 'lucide-react-native';
import { Pressable } from '@gluestack-ui/themed';
import "moment/locale/es"
import WeekPicker from '../../components/shared/weekPicker';
import { useGetBarberDetailQuery } from '../../api/barbersApi';
moment.locale("es")

const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: '#fff',
    backgroundGradientToOpacity: 1,
    borderColor: 'rgba(152,222,217,0.2)',
    color: () => '#367187',
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
};
const daysOfWeek = [
    'lunes',
    'martes',
    'miércoles',
    'jueves',
    'viernes',
    'sábado',
];
const { width } = Dimensions.get('window');

export default function AllStatsFromDates({ route }: any) {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const [mappedData, setMappedData] = useState<any>();
    const [startOfWeek, setStartOfWeek] = useState<moment.Moment>(moment().startOf('isoWeek'))
    const [endOfWeek, setEndOfWeek] = useState<moment.Moment>(moment().startOf('isoWeek').add(5, "days"))
    const { data: statsData, isLoading, refetch } = useGetAllStatsFromDatesQuery({
        from: startOfWeek.toDate(),
        to: endOfWeek.toDate()
    });

    console.log("statsData", statsData)


    const handlePrevWeek = () => {

        setStartOfWeek(startOfWeek.clone().subtract(7, "days"))
        setEndOfWeek(endOfWeek.clone().subtract(7, "days"))
    }
    const handleNextWeek = () => {

        setStartOfWeek(startOfWeek.clone().add(7, "days"))
        setEndOfWeek(endOfWeek.clone().add(7, "days"))
    }

    // useEffect(() => {
    //     if (statsData) {
    //         const dataWithDates = [...statsData.data].map(e => ({
    //             ...e,
    //             date: moment(e.date).utc().utcOffset(3, true)
    //                 .format('dddd')
    //         }));
    //         console.log("dataWithDates", dataWithDates)
    //         const data = {
    //             labels: daysOfWeek,
    //             datasets: [
    //                 {
    //                     data: daysOfWeek.map((dayOfWeek: string) => {
    //                         const target = dataWithDates.find(e => e.date === dayOfWeek);
    //                         if (target) {
    //                             return target.dayTotalAmount;
    //                         } else {
    //                             return 0;
    //                         }
    //                     }),
    //                     color: (opacity = 1) => `#367187`, // optional
    //                     strokeWidth: 2, // optional
    //                 },
    //             ],
    //         };
    //         setMappedData(data);
    //         console.log("dateset", data.datasets)
    //     }
    // }, [statsData]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            refetch();
        });

        return unsubscribe;
    }, [navigation]);
    if (isLoading) {
        return <Loader />;
    }


    return (
        <LinearGradient
            style={{ flex: 1 }}
            colors={['#fff', '#f1e2ca']}
            start={{ x: 0, y: 0.6 }}
            end={{ x: 0, y: 1 }}>
            <Box position="relative" flex={1}>
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

                <HStack justifyContent="space-between" alignItems="center" mt="$6">
                    <Pressable onPress={() => navigation.goBack()} p={'$4'}>
                        <Icon as={ChevronLeftIcon} size={24} color="$textDark500" />
                    </Pressable>
                    <Heading textAlign="center" color="$textDark500">
                        Estadisticas
                    </Heading>
                    <Box p="$6"></Box>
                </HStack>
                <Box flex={1}>
                    <ScrollView flex={1} mt="$10">
                        {mappedData && (
                            <Box p="$4">
                                <Box mb="$4" mt="$4">
                                    <WeekPicker handlePrevWeek={handlePrevWeek} handleNextWeek={handleNextWeek} endOfWeek={endOfWeek.clone()} startOfWeek={startOfWeek.clone()} />
                                </Box>



                                <Box
                                    mt={'$4'}
                                    position="relative"
                                    hardShadow="1"
                                    bg="$white"
                                    borderRadius="$lg"
                                    overflow="hidden">
                                    <LineChart
                                        data={mappedData}
                                        width={350}
                                        height={350}
                                        chartConfig={chartConfig}
                                        verticalLabelRotation={30}
                                        bezier
                                        renderDotContent={({ x, y, index, indexData }) => {
                                            return (
                                                <Text
                                                    position="absolute"
                                                    color="$textDark500"
                                                    top={y}
                                                    left={x}>
                                                    {indexData}
                                                </Text>
                                            );
                                        }}
                                        fromZero
                                    />
                                </Box>
                            </Box>
                        )}
                    </ScrollView>
                </Box>
            </Box>
        </LinearGradient>
    );
}
