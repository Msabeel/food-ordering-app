import React, { useEffect, useState, useCallback } from 'react';
import {
    SafeAreaView, View, Text, TouchableOpacity, Button, Modal
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { COLORS } from '../helpers/constants';


const Calender = ({ toggleCalender, setToggleHandler, availability, actualDate, onConfirmDate }) => {
    console.log('avaiablitycalender', availability)
    // console.log('actualData', actualDate.getMonth() + 1)

    const [activeDate, setActiveDate] = useState(new Date());
    const [updateDate, setUpdateDate] = useState(new Date().getDate());
    const [changedDate, setChangedDate] = useState(new Date());
    const [currentMonthDate, setCurrentMonthDate] = useState(new Date())
    const [addColumnIndex, setAddColumnIndex] = useState([]);

    let findSatursday = actualDate.getDay() === 6 ? true : false;

    console.log('actualData', actualDate.getDay(), findSatursday, '===changeMonth', changedDate.getMonth())

    let checkRowIndex;
    let actualMonth = actualDate.getMonth() + 1;

    var year = changedDate.getFullYear();
    var month = changedDate.getMonth();
    var firstDay = new Date(year, month, 1).getDay();

    let months = ["January", "February", "March", "April",
        "May", "June", "July", "August", "September", "October",
        "November", "December"];

    let weekDays = [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
    ];

    let nDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    var maxDays = nDays[month];
    if (month == 1) { // February
        if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
            maxDays += 1;
        }
    }

    useEffect(() => {
        getCheck();
    }, [availability]);

    const getCheck = () => {

        availability.map((item) => {
            if (item.day === 'SUN' && item.status === 1) {
                addColumnIndex.push(0);


            } else if (item.day === 'MON' && item.status === 1) {
                addColumnIndex.push(1);


            } else if (item.day === 'TUE' && item.status === 1) {
                addColumnIndex.push(2)

            } else if (item.day === 'WED' && item.status === 1) {
                addColumnIndex.push(3)

            } else if (item.day === 'THR' && item.status === 1) {
                addColumnIndex.push(4)

            } else if (item.day === 'FRI' && item.status === 1) {
                addColumnIndex.push(5)

            } else if (item.day === 'SAT' && item.status === 1) {
                addColumnIndex.push(6)

            }
        })
    };

    function generateMatrix() {
        var matrix = [];
        // Create header
        matrix[0] = weekDays;

        // More code here
        var counter = 1;
        for (var row = 1; row < 7; row++) {
            matrix[row] = [];
            for (var col = 0; col < 7; col++) {
                matrix[row][col] = -1;
                if (row == 1 && col >= firstDay) {
                    // Fill in rows only after the first day of the month                    
                    matrix[row][col] = counter++;
                } else if (row > 1 && counter <= maxDays) {
                    // Fill in rows only if the counter's not greater than
                    // the number of days in the month
                    matrix[row][col] = counter++;
                }
            }
        }

        return matrix;
    }

    var matrix = generateMatrix();

    const renderHeader = useCallback(() => {
        let day = weekDays[changedDate.getDay()];
        let month = months[changedDate.getMonth()];
        let date = changedDate.getDate();
        let formate = `${day}, ${month.substring(0, 3)} ${date}`;
        return (
            <View style={{
                width: '100%', paddingVertical: 20, paddingHorizontal: 20, backgroundColor: COLORS.primary,
                borderTopRightRadius: 20, borderTopLeftRadius: 20
            }}>
                <Text style={{ fontWeight: '500', color: '#ffffff', fontSize: 18 }}>{year}</Text>
                <Text style={{ fontWeight: '500', color: '#ffffff', fontSize: 24 }}>{formate}</Text>
            </View>
        );
    }, [])



    const renderCells = () => {
        let month = months[changedDate.getMonth()];

        return (
            matrix.map((row, rowIndex) => {

                if (rowIndex == 0) {
                    return <>
                        <View style={{
                            width: '100%', flexDirection: 'row',
                            justifyContent: 'space-around',
                            marginTop: 20, marginBottom: 15
                        }}>
                            <TouchableOpacity onPress={prevMonth}>
                                <AntDesign name="left" size={20} color="black" />
                            </TouchableOpacity>

                            <Text style={{ fontWeight: 'bold', fontSize: 16, textTransform: 'uppercase', color: '#748a9d' }}>{month}</Text>
                            <TouchableOpacity style={{}} onPress={nextMonth}>
                                <AntDesign name="right" size={20} color="black" />
                            </TouchableOpacity>

                        </View>
                        <View style={{
                            width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
                            paddingHorizontal: 30, paddingVertical: 10,
                        }}>
                            {matrix.map((row, rowIndex) => {
                                if (rowIndex == 0) {
                                    return row.map((col, colIndex) => {
                                        return (
                                            <View>
                                                <Text style={{ color: '#748a9d', fontWeight: 'bold', fontSize: 16 }}>{col.substring(0, 1)}</Text>
                                            </View>
                                        );
                                    })
                                }
                            })}
                        </View>
                    </>
                }

                return <View
                    style={{
                        width: '100%',
                        flexDirection: 'row',
                        justifyContent: 'center',
                    }}>
                    {

                        row.map((col, colIndex) => {
                            let check = actualDate.getMonth() === changedDate.getMonth() ? currentMonthDate.getDate() : changedDate.getDate();
                            let indexResult = addColumnIndex.find((x) => x === colIndex);
                            let checkMonth = actualDate.getMonth() === changedDate.getMonth() ? true : false;
                            let checkColIndex = colIndex === parseInt(indexResult) ? true : false;
                            let checkDate = col >= actualDate.getDate() ? true : false;
                            let checkNextRowIndex = rowIndex == checkRowIndex + 1 ? true : false;
                            let checkCurrentRowIndex = rowIndex == checkRowIndex ? true : false;
                            let onNextWeek = (checkNextRowIndex && checkColIndex && checkMonth && checkDate) ? true : false;
                            let onCurrentWeek = (checkCurrentRowIndex && checkColIndex && checkMonth && checkDate) ? true : false;
                            row.find((r) => {
                                if (r === activeDate.getDate()) {
                                    checkRowIndex = rowIndex;
                                }
                            });
                            {/* console.log('rowFound', checkRowIndex); */ }

                            return (
                                <TouchableOpacity activeOpacity={col != -1 ? 0.68 : 0} onPress={() => {
                                    if (col != -1 && col >= actualDate.getDate()) {
                                        if (colIndex === parseInt(indexResult)) {

                                            if (checkMonth && rowIndex == (findSatursday ? checkRowIndex + 1 : checkRowIndex) && colIndex === parseInt(indexResult)) {
                                                // alert('helo>>')
                                                _onPress(col);
                                            }
                                            // alert('helo')
                                            // if (actualDate.getMonth() === changedDate.getMonth() && rowIndex == (findSatursday ? checkRowIndex + 1 : checkRowIndex) && colIndex === parseInt(indexResult)) {
                                            //     alert('helo>>')
                                            //     _onPress(col);
                                            // }

                                        }


                                    }
                                }}
                                    style={{
                                        borderRadius: col != -1 ? col == check && (actualDate.getMonth() === changedDate.getMonth()) && (col >= actualDate.getDate()) ? 30 : null : null,
                                        borderWidth: col != -1 ? col == check && (actualDate.getMonth() === changedDate.getMonth()) && (col >= actualDate.getDate()) ? 1 : null : null,
                                        borderColor: col != -1 ? col == check && (actualDate.getMonth() === changedDate.getMonth()) && (col >= actualDate.getDate()) ? 'red' : null : null,
                                        marginVertical: 7, marginHorizontal: 5,
                                        height: 32, width: 32,
                                        justifyContent: 'center', alignItems: 'center'
                                    }}>
                                    <Text style={{
                                        color: findSatursday ? (onNextWeek ? 'red' : '#ccc') : (onCurrentWeek ? 'red' : '#ccc'),
                                        fontWeight: findSatursday ? (onNextWeek ? 'bold' : null) : (onCurrentWeek ? 'bold' : null),

                                        // color: (rowIndex == checkRowIndex) && (colIndex === parseInt(indexResult)) && (actualDate.getMonth() === changedDate.getMonth()) && (col >= actualDate.getDate()) ? 'red' : '#ccc',
                                        // fontWeight: (rowIndex == checkRowIndex) && (colIndex === parseInt(indexResult)) && (actualDate.getMonth() === changedDate.getMonth()) && (col >= actualDate.getDate()) ? 'bold' : null
                                    }}
                                    >{col != -1 ? col : ''}</Text>

                                </TouchableOpacity>
                            );
                        })
                    }
                </View >

            })
        );

    };




    const renderController = () => {
        return (
            <View style={{
                flexDirection: 'row', justifyContent: 'flex-end',
                marginRight: 30, alignItems: 'center'
            }}>
                <TouchableOpacity onPress={onCancelHandler}
                    style={{ paddingRight: 20 }}>
                    <Text style={{ color: '#748a9d', fontWeight: 'bold', fontSize: 18 }}>CANCEL</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onConfirmHandler}
                    style={{ paddingRight: 20 }}>
                    <Text style={{ color: '#748a9d', fontWeight: 'bold', fontSize: 18 }}>OK</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const _onPress = (col) => {
        // alert('helo')
        if (!col.match && col != -1) {
            setChangedDate((prevState) => {
                prevState.setDate(col);
                return prevState;
            });
            setCurrentMonthDate((prevState) => {
                prevState.setDate(col);
                return prevState;
            });
            setUpdateDate(col)
        }
    };


    const onConfirmHandler = () => {
        console.log('onconfirmDate>>>>', changedDate.getDate(), ' ', currentMonthDate.getDate());
        setToggleHandler();
        if (activeDate.getMonth() !== changedDate.getMonth()) {
            // alert('not change')
            onConfirmDate(activeDate);
        } else {
            console.log('changes?????', changedDate)
            onConfirmDate(changedDate);
        }


    }

    const onCancelHandler = () => {
        setChangedDate(new Date());
        setCurrentMonthDate(new Date());
        setToggleHandler();
    }

    const prevMonth = () => {
        let prev = changedDate.getMonth() - 1;
        setChangedDate((prevState) => {
            prevState.setMonth(prev);
            return prevState;
        });
        setUpdateDate(prev);
    };

    const nextMonth = () => {
        let next = changedDate.getMonth() + 1;

        setChangedDate((prevState) => {
            prevState.setMonth(next);
            return prevState;
        });
        setChangedDate((prevState) => {
            prevState.setDate(1);
            return prevState;
        });
        setUpdateDate(next);
    }





    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Modal animationType="fade"
                transparent={true}
                visible={toggleCalender}>
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(52, 52, 52, 0.8)'
                }}>
                    <View style={{ height: '73%', width: '90%', backgroundColor: '#fff', borderRadius: 20 }}>
                        {renderHeader()}
                        {renderCells()}
                        {renderController()}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
};

export default Calender;