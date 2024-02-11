import {
    Box,
    FlatList,
    HStack,
    Heading,
    Icon,
    Input,
    InputField,
    ScrollView,
    Text,
    VStack,
} from '@gluestack-ui/themed';
import React, { useEffect, useMemo, useState } from 'react';
import { BarChart } from 'react-native-chart-kit';
import { useGetAllStatsFromDatesQuery } from '../../api/statsApi';
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
const { width } = Dimensions.get('window');

export default function AllStatsFromDates({ route }: any) {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();

    const [mappedData, setMappedData] = useState<any>();
    const [selected, setSelected] = useState<string>('');
    const [startDate, setStartDate] = useState<moment.Moment>(moment().startOf('month').set("hour", 0).set("minutes", 0).utc().utcOffset(3, true))
    const [endDate, setEndDate] = useState<moment.Moment>(moment().endOf('month').set("hour", 23).set("minutes", 59).utc().utcOffset(3, true))
    const { data: statsData, isLoading, refetch } = useGetAllStatsFromDatesQuery({
        from: startDate.toDate(),
        to: endDate.toDate()
    });
    const totalStats = useMemo(() => {
        return statsData && statsData.data.reduce((a: any, b: any) => {
            return {
                completeTurns: a.completeTurns + b.completeTurns,
                canceledTurns: a.canceledTurns + b.canceledTurns,
                totalForBarber: a.totalForBarber + b.totalForBarber,
                total: a.total + b.total
            }
        }, {
            canceledTurns: 0,
            completeTurns: 0,
            totalForBarber: 0,
            total: 0
        })
    }, [statsData])

    console.log("statsData", statsData)


    const handleStartDate = () => {

        setStartDate(startDate.clone().subtract(1, "month").startOf("month"))
        setEndDate(endDate.clone().subtract(1, "month").endOf("month"))
    }
    const handleEndDate = () => {
        setStartDate(startDate.clone().add(1, "month").startOf("month"))
        setEndDate(endDate.clone().add(1, "month").endOf("month"))
    }



    useEffect(() => {
        if (statsData) {
            const data = {
                labels: statsData.data.map((item: any) => (item.name + " " + item.lastName)),
                datasets: [
                    {
                        data: statsData.data.map((item: any) => item.total),
                    },
                ],
            };
            setMappedData(data);
            console.log("dateset", data.datasets[0].data)
        }
    }, [statsData]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async () => {
            refetch();
        });

        return unsubscribe;
    }, [navigation]);
    if (isLoading) {
        return <Loader />;
    }


    console.log("totalStats", totalStats)

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
                    px={5}
                />
                <HStack justifyContent="space-between" alignItems="center" mt="$6">

                    <Pressable onPress={() => navigation.goBack()} p={'$4'}>
                        <Icon as={ChevronLeftIcon} size={24} color="$textDark500" />
                    </Pressable>
                    <Heading textAlign="center" color="$textDark500">
                        Resumen mensual general
                    </Heading>
                    <Box p="$6">

                    </Box>
                </HStack>
                <Box flex={1}>

                    <ScrollView flex={1} mt="$12">


                        {mappedData && (
                            <Box p="$4">
                                <Box mb="$4">
                                    <WeekPicker handlePrevWeek={handleStartDate} handleNextWeek={handleEndDate} endOfWeek={endDate.clone()} startOfWeek={startDate.clone()} />
                                </Box>

                                <Box
                                    hardShadow={'1'}
                                    p="$4"
                                    mb="$6"
                                    borderRadius="$lg"
                                    bg="$white">
                                    <Heading color='$textDark500' textTransform='capitalize'>Resumen - {moment(startDate).format("MMMM/yyyy")}</Heading>
                                    <Text color="$textDark500">
                                        Cortes realizados:{' '}
                                        <Text color="$textDark500" fontWeight="bold">
                                            {totalStats.completeTurns}
                                        </Text>
                                    </Text>
                                    <Text color="$textDark500">
                                        Cortes cancelados:{' '}
                                        <Text color="$textDark500" fontWeight="bold">
                                            {totalStats.canceledTurns}
                                        </Text>
                                    </Text>
                                    <Text color="$textDark500">
                                        Total:{' '}
                                        <Text color="$textDark500" fontWeight="bold">
                                            {totalStats.total}
                                        </Text>
                                    </Text>
                                    <Text color="$textDark500">
                                        Total en comisiones:{' '}
                                        <Text color="$textDark500" fontWeight="bold">
                                            {totalStats.totalForBarber}
                                        </Text>
                                    </Text>
                                    <Text color="$textDark500">
                                        Total en ganancias:{' '}
                                        <Text color="$textDark500" fontWeight="bold">
                                            {totalStats.total - totalStats.totalForBarber}
                                        </Text>
                                    </Text>

                                </Box>
                                <Box
                                    mt={'$4'}
                                    position="relative"
                                    hardShadow="1"
                                    bg="$white"
                                    borderRadius="$lg"
                                    overflow="hidden">
                                    <BarChart
                                        data={mappedData}
                                        width={350}
                                        height={350}
                                        chartConfig={chartConfig}
                                        verticalLabelRotation={30}
                                        fromZero
                                        yAxisLabel=''
                                        yAxisSuffix=''
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
