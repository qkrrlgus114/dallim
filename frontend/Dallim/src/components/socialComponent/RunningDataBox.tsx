import * as S from './RunningDataBox.styles';
import PlaceIcon from '@/assets/icons/PlaceIcon.png';
import DateIcon from '@/assets/icons/DateIcon.png';
import DistIcon from '@/assets/icons/DistIcon.png';
import TimeIcon from '@/assets/icons/TimeIcon.png';
import SpeedIcon from '@/assets/icons/SpeedIcon.png';
import { postRecordSave } from '@/apis/SocialApi';
import CheckModal from './socialModal/CheckModal';
import { useState } from 'react';

interface RunningDataBoxProps {
  id: string;
  location: string;
  createdAt: string;
  totalDistance: number;
  totalTime: number;
  averageSpeed: number;
  registration: boolean;
  onUpdateRegistration: (id: string) => void;
}

function RunningDataBox({
  id,
  location,
  createdAt,
  totalDistance,
  totalTime,
  averageSpeed,
  registration,
  onUpdateRegistration
}: RunningDataBoxProps) {

  // 날짜 형식 변환 함수, 예: "2023-10-25T21:00:00" -> "2023년 10월 25일"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const handleModalRecordSave = async () => {
    console.log("모달에서 기록 저장 버튼 클릭 확인, id:", id);
    try {
      await postRecordSave(id); // 서버 전송
      onUpdateRegistration(id); // 상태 업데이트
    } catch (error) {
      console.error("런닝메이트 등록 오류", error);
    }
  };

  const [checkModalVisible, setCheckModalVisible] = useState(false); // 행성 선택 확인 모달

  function toggleCheckModal() {
    setCheckModalVisible(!checkModalVisible);
  }

  return (
    <S.Container>
      <S.Box>
        <S.Top>
          <S.TopLeft>
            <S.Icon>
              <S.IconImage source={PlaceIcon} />
            </S.Icon>
            <S.Text>
              {location}
            </S.Text>
          </S.TopLeft>
          <S.TopRight>
            <S.Icon>
              <S.IconImage source={DateIcon} />
            </S.Icon>
            <S.Text>
              {formatDate(createdAt)}
            </S.Text>
          </S.TopRight>
        </S.Top>
        <S.Middle>
          <S.MiddleLeft>
            <S.Icon>
              <S.IconImage source={DistIcon} />
            </S.Icon>
            <S.Text>
              {totalDistance.toFixed(2)} 키로미터
            </S.Text>
          </S.MiddleLeft>
          <S.MiddleRight>
            <S.Icon>
              <S.IconImage source={TimeIcon} />
            </S.Icon>
            <S.Text>
              {totalTime}분
            </S.Text>
          </S.MiddleRight>
        </S.Middle>
        <S.Bottom>
          <S.BottomLeft>
            <S.Icon>
              <S.IconImage source={SpeedIcon} />
            </S.Icon>
            <S.Text>
              {averageSpeed.toFixed(2)} Km/h
            </S.Text>
          </S.BottomLeft>
          <S.BottomRight>

            <S.AddBox>
              {!registration ? (
                // <S.AddButton onPress={handleRecordSave}>
                <S.AddButton onPress={toggleCheckModal}>
                  <S.AddText>등록하기</S.AddText>
                </S.AddButton>
              ) : (
                <S.AddButton_two disabled>
                  <S.AddText_two>등록됨</S.AddText_two>
                </S.AddButton_two>
              )}
            </S.AddBox>

          </S.BottomRight>
        </S.Bottom>
      </S.Box>

      <CheckModal
        checkModalVisible={checkModalVisible}
        handleModalRecordSave={handleModalRecordSave}
        toggleCheckModal={toggleCheckModal}
      />

    </S.Container>
  );
};

export default RunningDataBox;
