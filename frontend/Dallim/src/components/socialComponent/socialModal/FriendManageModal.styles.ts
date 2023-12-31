import styled from 'styled-components/native';
import {TextInput, Image} from 'react-native';
import {Animated} from 'react-native';
import {colors} from '@/components/common/globalStyles';

export const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.8);
`;

export const ModalContent = styled.View`
  /* border-color: red;
  border-width: 1px; */
  width: 90%;
  height: 80%;
`;

export const Header = styled.View`
  /* border-top-color: ${colors.button.depth1.color}; */
  /* border-top: ${colors.button.depth1.color}; */
  /* border-left-color: ${colors.button.depth1.color}; */
  /* border-right-color: ${colors.button.depth1.color}; */
  /* border-bottom-color: white; */
  /* border-color: red; */
  /* border: ${colors.button.depth1.color}; */
  /* border-width: 1px; */
  border-radius: 20px;
  width: 100%;
  height: 80%;
  align-items: center;
  background-color: white;
  /* z-index: -2; */
  /* overflow: hidden; */
`;

export const Top = styled.View`
  border-bottom-color: ${colors.button.depth1.color};
  border-bottom-width: 1px;
  width: 100%;
  height: 10%;
  align-items: center;
  justify-content: center;
`;

export const TopText = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: #2c2c46;
`;

export const ListBox = styled.View`
  /* border-color: blue;
  border-width: 1px; */
  width: 100%;
  height: 88%;
  align-items: center;
  padding: 5px;
`;

export const UserBox = styled.View`
  /* border-color: red;
  border-width: 1px; */
  width: 90%;
  height: 70px;
  /* margin-top: 5px; */
  /* margin-bottom: 5px; */
  margin-left: 5%; // 스크롤
`;

export const FriendBox = styled.View`
  /* border-color: red;
  border-width: 1px; */
  /* align-items: center; */
  /* justify-content: center; */
  width: 90%;
  height: 70px;
  /* margin-top: 10px; */
  margin-left: 5%; // 스크롤
`;

export const WaitBox = styled.View`
  /* border-color: red;
  border-width: 1px; */
  width: 90%;
  height: 70px;
  /* margin-top: 10px; */
  margin-left: 5%; // 스크롤
`;

export const Body = styled.View`
  /* border-color: red;
  border-width: 1px; */
  width: 100%;
  height: 10%;
  align-items: center;
`;

export const ViewSelector = styled.View`
  /* border-color: blue;
  border-width: 1px; */
  width: 100%;
  height: 70px;
  align-items: flex-start;
  justify-content: center;
  flex-direction: row;
  gap: 8px;
  bottom: 10px;
  z-index: -1;
`;

export const SelectorButton = styled.TouchableOpacity<{isActive: boolean}>`
  /* border-color: red;
  border-width: 1px; */
  border-radius: 10px;
  background-color: ${({isActive}) =>
    isActive ? 'white' : 'rgba(72,66,135,1)'};
  /* z-index: ${({isActive}) => (isActive ? '4' : '-4')}; */
  /* color: ${({isActive}) => (isActive ? 'white' : 'rgba(72,66,135,1)')}; */
  align-items: center;
  justify-content: center;
  width: 30%;
  height: 70%;
  overflow: hidden;
`;

export const SelectorText = styled.Text<{isActive: boolean}>`
  color: ${({isActive}) => (isActive ? 'rgba(72,66,135,1)' : 'white')};
  font-size: 15px;
  font-weight: bold;
  /* color: black; */
`;

export const Footer = styled.View`
  /* border-color: red;
  border-width: 1px; */
  width: 100%;
  height: 10%;
  align-items: center;
  justify-content: center;
`;

export const EmptyImage = styled.Image`
  width: 50%;
  height: 40%;
  margin-top: 20%;
`;

export const EmptyText = styled.Text`
  font-size: 10px;
  color: #8c8c8c;
  text-align: center;
`;

export const Bottom = styled.View`
  flex-direction: row;
  border-radius: 15px;
  width: 100%;
  height: 10%;
  align-items: center;
`;

export const CloseButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
`;

export const CloseImage = styled.Image`
  width: 100%;
  height: 100%;
`;

export const Search = styled.View`
  /* border-color: blue;
  border-width: 1px; */
  flex-direction: row;
  border-radius: 15px;
  width: 65%;
  height: 40px;
  align-items: center;
`;

export const SearchLeft = styled.View`
  border-color: gray;
  border-width: 1px;
  border-radius: 10px;
  flex-direction: row;
  margin-left: 5%;
  width: 80%;
  height: 100%;
`;

export const SearchBox = styled.View`
  /* border-color: green;
  border-width: 1px; */
  height: 100%;
  width: 100%;
  font-size: 10px;
  padding-left: 10px;
  color: #8c8c8c;
`;

//기존
// export const SearchInput = styled.TextInput`
//   /* border-color: green;
//   border-width: 1px; */
//   font-size: 12px;
//   color: black;
//   width: 90%;
//   height: 100%;
//   border-bottom-width: 1px;
//   border-bottom-color: #d9d9d9;
// `;

export const SearchInput = styled(TextInput)`
  /* border-color: green;
  border-width: 1px; */
  font-size: 12px;
  color: black;
  width: 90%;
  height: 100%;
  /* border-bottom-width: 1px;
  border-bottom-color: #adadad; */
`;

export const SearchRight = styled.View`
  /* border-color: red;
  border-width: 1px; */
  flex-direction: row;
  width: 20%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

export const SendButton = styled.TouchableOpacity`
  /* border-color: red;
  border-width: 1px; */
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  width: 70%;
  height: 80%;
`;

export const SearchIcon = styled(Image)`
  width: 100%;
  height: 100%;
`;

export const AnimatedFooterText = styled(Animated.Text)`
  font-size: 25px;
  color: white;
`;
