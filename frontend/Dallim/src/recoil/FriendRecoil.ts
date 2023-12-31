import {atom} from 'recoil';

// Friend 타입을 정의합니다.
export type Friend = {
  userId: number;
  characterIndex: number;
  evolutionStage: number;
  nickname: string;
  level: number;
};

// 친구 상태 관리
export const friendsState = atom<Friend[]>({
  key: 'friendsState', // 고유한 key 값
  default: [], // 초기 상태 값 : 빈 배열
});

// 친구 요청 관리
export const friendRequestsState = atom<Friend[]>({
  key: 'friendRequestsState',
  default: [],
});
