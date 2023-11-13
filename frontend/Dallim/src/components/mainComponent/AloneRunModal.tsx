import * as S from './AloneRunModal.styles';
import { equippedCharacterIndexState, equippedEvolutionStageState, equippedPlanetIndexState, userIdState } from '@/recoil/UserRecoil';
import { PermissionsAndroid, Platform } from 'react-native';
import { characterData } from '@/recoil/CharacterData';
import React, { useEffect, useRef, useState } from 'react';
import { planetData } from '@/recoil/PlanetData';
import { Modal } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import CloseIcon from '@/assets/icons/DirectionLeft_2.png';
import SpinAnimation from '@/components/common/SpinAnimation';

import { runningSessionState, secondsElapsedState, isRunningState, totalDistanceState, displayDistanceState, lastPositionState } from '@/recoil/RunningRecoil';
import { useRecoilState, useRecoilValue } from 'recoil';
import RuningModal from './RuningModal';
import { postRunningData } from '@/apis/MainApi';

interface Props {
  isVisible: boolean;
  onClose: () => void;
}

interface Position {
  latitude: number;
  longitude: number;
}

interface LocationData {
  second: number; // 필요
  latitude: number;
  longitude: number;
  distance: number; // 필요
  speed: number; // 필요
  pace: number; // 필요
}

interface GpsData {
  second: number;
  latitude: number;
  longitude: number;
  distance: number;
  speed: number;
  pace: number;
}

const AloneRunModal: React.FC<Props> = ({ isVisible, onClose }) => {
  const timerIdRef = useRef<NodeJS.Timeout | null>(null);
  const trackIdRef = useRef<number | null>(null); // 위치 추적 ID 저장을 위한 참조 변수

  const userId = useRecoilValue(userIdState);
  const equippedCharacterIndex = useRecoilValue(equippedCharacterIndexState);
  const equippedEvolutionStage = useRecoilValue(equippedEvolutionStageState);
  const equippedPlanetIndex = useRecoilValue(equippedPlanetIndexState);

  const [runningSession, setRunningSession] = useRecoilState(runningSessionState);
  const [secondsElapsed, setSecondsElapsed] = useRecoilState(secondsElapsedState);
  const [isRunning, setIsRunning] = useRecoilState(isRunningState);
  const [totalDistance, setTotalDistance] = useRecoilState(totalDistanceState);
  const [displayDistance, setDisplayDistance] = useRecoilState(displayDistanceState);
  const [lastPosition, setLastPosition] = useRecoilState(lastPositionState);

  // 확인 모달
  const [showModal, setShowModal] = useState(false);

  // 페이스 상태
  const [pace, setPace] = useState('0:00'); // 화면에 표시할 페이스
  // const [paceStr, setPaceStr] = useState(0); // 서버로 보낼 페이스

  // 시작 및 종료 모달 구분을 위한 상태
  const [modalType, setModalType] = useState<'start' | 'stop' | null>(null);

  // 위치 권한 상태를 로컬 상태로 관리
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);

  // 데이터 잘 들어가는지 확인 용도
  useEffect(() => {
    console.log("업데이트된 runningRecordInfos 배열 크기: ", runningSession.runningRecordInfos.length);
    console.log("여기 왔나?? : ", JSON.stringify(runningSession, null, 2));

  }, [runningSession]);

  // 타이머와 위치 추적을 시작하는 함수
  const startRun = () => {
    startTracking();
    console.log("시작하나?!!!!!!")
    startTimer();
    setIsRunning(true);
  }

  const startTimer = () => {
    setSecondsElapsed(0); // 타이머 초기화
    timerIdRef.current = setInterval(() => {
      setSecondsElapsed(prevSeconds => prevSeconds + 1);
    }, 1000);
  };

  const stopRun = () => {
    setSecondsElapsed(0); // 타이머 초기화

    if (trackIdRef.current !== null) {
      Geolocation.clearWatch(trackIdRef.current);
      trackIdRef.current = null;
    }

    if (timerIdRef.current) clearInterval(timerIdRef.current);

    // 데이터 초기화 ( 추후에 )
    setIsRunning(false);
    // setRunningSession({
    //   ...runningSession,
    //   runningRecordInfos: [],
    // });
    // setSecondsElapsed(0);
    // setTotalDistance(0);
    // setDisplayDistance(0);
    // setLastPosition(null);
  };

  // 초를 시:분:초 형식으로 변환하는 함수
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
      .map(val => val < 10 ? `0${val}` : val)
      .join(':');
  };

  // m/s 페이스 변환 (초/km)
  function msToPace(speed: number) {
    if (speed === 0) return '0:00'; // 속도가 0일 경우

    const paceSeconds = 1000 / speed; // m/s를 초/km로 변환
    const minutes = Math.floor(paceSeconds / 60);
    const seconds = Math.round(paceSeconds % 60);

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  // 위치 초기화 && 초기 위치 설정 필수!
  useEffect(() => {
    if (!lastPosition) {
      Geolocation.getCurrentPosition((position) => {
        setLastPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    }
  }, [lastPosition]);

  // 위치 추적 시작 함수
  const startTracking = () => {
    const startTime = Date.now(); // 달리기 시작 시점의 타임스탬프

    const trackId = Geolocation.watchPosition((position) => {
      let distance = 0;

      if (lastPosition) {
        distance = calculateDistance(
          lastPosition.latitude,
          lastPosition.longitude,
          position.coords.latitude,
          position.coords.longitude
        );
      } else {
        setLastPosition({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      }

      const newTotalDistance = totalDistance + distance;
      const displayDistance = Math.round((newTotalDistance) * 100) / 100.0;

      // 1초에 몇미터 가는지
      const speed = position.coords.speed ?? 0; // m/s
      let calculatedPace;
      let paceValue;
      if (speed !== 0) {
        calculatedPace = 1000 / speed; // 속도가 0이 아닐 때만 페이스 계산
        paceValue = msToPace(speed); // '분:초' 형식으로 페이스 변환
      } else {
        calculatedPace = 0; // 속도가 0일 경우 페이스를 0으로 설정
        paceValue = '-'; // 화면에 표시할 값
      }
      // setPaceStr(calculatedPace); // 서버
      setPace(paceValue); // 화면

      const elapsedTime = Math.floor((position.timestamp - startTime) / 1000); // 경과 시간 계산 (초)

      const newLocationData = {
        second: elapsedTime,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        distance: newTotalDistance,
        speed: speed,
        pace: calculatedPace,
      };

      // 데이터 누적 업데이트
      setRunningSession(oldRecords => ({
        ...oldRecords,
        runningRecordInfos: [...oldRecords.runningRecordInfos, newLocationData]
      }));
      setTotalDistance(newTotalDistance);
      setDisplayDistance(displayDistance);
      setLastPosition({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },
      (error) => {
        console.error(error);
      },
      { enableHighAccuracy: true, distanceFilter: 0, interval: 1000 });

    trackIdRef.current = trackId;
  };

  // Haversine 공식을 사용하여 두 지점 간의 거리를 계산하는 함수
  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // 지구의 반경(m)
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // 거리(m)
  }
  function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // 모달 : 시작 텍스트 클릭
  const handleStartButton = () => {
    setModalType('start');
    setShowModal(true);
  };
  // 모달 : 종료 텍스트 클릭
  const handleStopButton = () => {
    setModalType('stop');
    setShowModal(true);
  };

  // 모달 : "확인"을 눌렀을 때의 동작
  const handleConfirm = async () => {
    if (modalType === 'start') {
      if (locationPermissionGranted) {
        startRun();
      } else {
        const permission = await requestLocationPermission();
        if (permission === 'granted') {
          setLocationPermissionGranted(true);
          startRun();
        } else {
          console.warn("위치 권한 허용을 하셔야 함.");
        }
      }
      setShowModal(false);
      setModalType(null); // 모달 타입 초기화
    } else if (modalType === 'stop') {
      stopRun();
      setShowModal(false);
      setModalType(null); // 모달 타입 초기화

      // 수집한 데이터를 변수에 저장
      const endTime = secondsElapsed; // 종료 시간 (타이머 시간)
      const endTotalDistance = totalDistance; // 총 거리
      const averageSpeed = endTotalDistance / endTime; // 평균 속력 계산

      // 누락 데이터 전처리
      const filledRunningRecordInfos = fillMissingData(runningSession.runningRecordInfos);

      // runningRecordInfos에서 latitude와 longitude 제거
      const transformedRunningRecordInfos = filledRunningRecordInfos.map(({ latitude, longitude, ...rest }) => rest);

      // 한국 날짜 변환 
      const koreaDate = convertToKST(runningSession.date);

      // 서버에 보낼 데이터 객체 생성
      const runningData = {
        initLatitude: runningSession.runningRecordInfos[0].latitude,
        initLongitude: runningSession.runningRecordInfos[0].longitude,
        watchOrMobile: runningSession.watchOrMobile,
        userId: userId,
        characterIndex: equippedCharacterIndex,
        type: runningSession.type,
        rivalRecord: runningSession.rivalRecord,
        runningRecordInfos: transformedRunningRecordInfos,
        totalTime: endTime,
        totalDistance: endTotalDistance,
        averageSpeed: averageSpeed,
        date: koreaDate.toISOString(),
      };

      console.log("1 / initialLatitudeState(시작 위도) : " + runningSession.runningRecordInfos[0].latitude);
      console.log("1 / initialLongitudeState(시작 경도) : " + runningSession.runningRecordInfos[0].longitude);
      console.log("1 / watchOrMobile(모바일인가요?) : " + runningSession.watchOrMobile);
      console.log("1 / userId(유저 Id) : " + userId);
      console.log("1 / characterIndex(캐릭터 Id) : " + equippedCharacterIndex);
      console.log("1 / type (홀로 달리기) : " + runningSession.type);
      console.log("1 / rivalRecord(라이벌 없음) : " + runningSession.rivalRecord);
      console.log("2.runningSession.runningRecordInfos(1초단위 배열) : " + JSON.stringify(transformedRunningRecordInfos, null, 2));
      console.log("3 / totalTime(초) : " + secondsElapsed);
      console.log("3 / totalDistance(M) : " + totalDistance);
      console.log("3 / averageSpeed(m/s) : " + averageSpeed);
      console.log("3 / koreaDate(작성시간) : " + koreaDate.toISOString());

      // 데이터 전송
      try {
        const response = await postRunningData(runningData);
        console.log("데이터 전송 성공: ", response);
      } catch (error) {
        console.error("데이터 전송 실패: ", error);
      }

    }
  };

  // 모달 : "취소"를 눌렀을 때의 동작
  const handleCancel = () => {
    setShowModal(false);
    setModalType(null);
  };

  // 위치 권한 요청 함수 (안드로이드용)
  async function requestLocationPermission() {
    try {
      if (Platform.OS === 'android') {
        return await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "위치 권한",
            message: "이 앱은 위치 추적 기능이 필요합니다.",
            buttonNeutral: "나중에",
            buttonNegative: "거부",
            buttonPositive: "허용"
          }
        );
      }
      return 'granted';
    } catch (err) {
      console.warn(err);
    }
  }

  // 누락된 초에 대한 데이터 전처리 ( 복사 )
  const fillMissingData = (data: GpsData[]): GpsData[] => {
    if (data.length === 0) return [];
    const filledData: GpsData[] = [];
    let lastData = data[0];

    for (let second = 0; second <= data[data.length - 1].second; second++) {
      const currentData = data.find(d => d.second === second);
      if (currentData) {
        filledData.push(currentData);
        lastData = currentData;
      } else {
        filledData.push({ ...lastData, second });
      }
    }
    return filledData;
  };

  // 한국 시간 변환
  const convertToKST = (dateString: string): Date => {
    const date = new Date(dateString);
    const kstOffset = 9 * 60; // 한국은 UTC+9
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const kstDate = new Date(utc + (3600000 * kstOffset));

    return kstDate;
  };

  // 컴포넌트 렌더링 시작
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}>
      <S.BackgroundImage
        source={require('@/assets/images/MainBackground3.png')}
        resizeMode="cover">
        <S.ModalContainer>
          <S.Header>
            <S.CloseButton onPress={onClose}>
              <S.CloseImage source={CloseIcon} />
            </S.CloseButton>
          </S.Header>

          <S.Body>
            <S.TimerBox>
              <S.TimerText>{formatTime(secondsElapsed)}</S.TimerText>
            </S.TimerBox>

            <S.StartBox>
              <S.ButtonBackground
                source={require('@/assets/images/StartButton.png')}
                resizeMode="contain">
                <S.RunButton onPress={isRunning ? handleStopButton : handleStartButton}>
                  <S.StartText>{isRunning ? '종료' : '시작'}</S.StartText>
                </S.RunButton>
              </S.ButtonBackground>
            </S.StartBox>

            <S.RecodeBox>
              <S.RecodeLeft>
                <S.RecodeTextBox>
                  <S.RecodeTitle>페이스</S.RecodeTitle>
                </S.RecodeTextBox>
                <S.RecodeBottomBox>
                  <S.RecodeText>{pace} ( 분 : 초 ) </S.RecodeText>
                </S.RecodeBottomBox>
              </S.RecodeLeft>
              <S.RecodeRight>
                <S.RecodeTextBox>
                  <S.RecodeTitle>총 거리</S.RecodeTitle>
                </S.RecodeTextBox>
                <S.RecodeBottomBox>
                  <S.RecodeText>{displayDistance} 미터</S.RecodeText>
                </S.RecodeBottomBox>
              </S.RecodeRight>
            </S.RecodeBox>
          </S.Body>

          {/* 행성 */}
          <S.ThemeBox>
            <SpinAnimation>
              <S.StyledImage
                source={planetData[equippedPlanetIndex].Planet}
                resizeMode="contain"
              />
            </SpinAnimation>
          </S.ThemeBox>

          {/* 캐릭터 */}
          <S.CharacterBox>
            <S.StyledGif
              source={
                characterData[equippedCharacterIndex].evolutions[
                  equippedEvolutionStage
                ].running
              }
              resizeMode="contain"
            />
          </S.CharacterBox>
        </S.ModalContainer>
      </S.BackgroundImage>

      <RuningModal
        isVisible={showModal}
        modalType={modalType}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </Modal>
  );
};

export default AloneRunModal;
