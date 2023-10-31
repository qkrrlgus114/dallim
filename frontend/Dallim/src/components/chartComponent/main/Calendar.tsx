import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import * as S from './Calendar.styles';
import {getCurrentDate, CalendarType} from '@/components/common/CalendarData';

interface Props {
  isClicked?: boolean;
  selectedDate?: CalendarType;
  setIsClicked: any;
  setSelectedDate: any;
}

function ChartCalendar({
  isClicked,
  selectedDate,
  setIsClicked,
  setSelectedDate,
}: Props) {
  // 특정 날짜 선택시
  const handleClickedSelectedDate = (day: CalendarType) => {
    if (
      isClicked &&
      selectedDate &&
      selectedDate.dateString === day.dateString
    ) {
      setSelectedDate(null);
      setIsClicked(false);
    } else {
      setSelectedDate(day);
      setIsClicked(true);
    }
  };

  return (
    <S.Container>
      <S.Calendar
        // 현재 날짜
        current={getCurrentDate()}
        // 날짜 선택 시 실행
        onDayPress={day => {
          handleClickedSelectedDate(day);
        }}
        // 체크되어야 하는 날짜 지정
        markedDates={
          {
            // '2023-10-01': {selected: true, marked: true, selectedColor: 'blue'},
            // '2023-10-02': {marked: true},
            // '2023-10-03': {selected: true, marked: true, selectedColor: 'blue'},
          }
        }
      />
    </S.Container>
  );
}

export default ChartCalendar;