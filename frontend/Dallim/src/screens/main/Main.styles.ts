import styled from 'styled-components/native';
import {ImageBackground, Image} from 'react-native';
import { Animated } from 'react-native';
import { TouchableOpacity } from 'react-native';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
export const BackgroundImage = styled(ImageBackground)`
  flex: 1;
  width: 100%;
  height: 100%;
`;

export const Header = styled.View`
  /* border-width: 1px;
  border-color: blue; */
  flex-direction: row;
  width: 100%;
  height: 15%;
`;

export const HeaderLeft = styled.View`
  /* border-width: 1px;
  border-color: yellow; */
  width: 40%;
  height: 100%;
  justify-content: flex-end;
`;

export const ToggleButtonWrapper = styled(TouchableOpacity)`
  border-width: 1px;
  border-radius: 100px;  
  border-color: transparent;
  padding: 4px; 
  width: 80px;
  height: 40px;
  margin-left: 20px;
  background-color: rgba(255, 255, 255, 0.3);
`;

export const ToggleButton = styled(Animated.View)<{ isOn?: boolean }>`
  width: 30px;
  height: 30px;
  border-radius: 100px;
  background-color: ${props => (props.isOn ? '#F5DA25' : 'white')};
`;

export const HeaderRight = styled.View`
  /* border-width: 1px;
  border-color: green; */
  flex-direction: row;
  width: 60%;
  height: 100%;
  justify-content: flex-end;
  align-items: flex-end;
`;

export const LevelText = styled.Text<{ isOn?: boolean }>`
  font-size: 20px;
  color: ${props => (props.isOn ? 'black' : 'white')};
  margin-right: 10%;
`;

export const PointText = styled.Text<{ isOn?: boolean }>`
  font-size: 20px;
  color: ${props => (props.isOn ? 'black' : 'white')};
  margin-right: 10%;
`;

export const Body = styled.View`
  /* border-width: 1px;
  border-color: red; */
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 85%;
`;

export const ThemeBox = styled.View`
  /* border-width: 1px;
  border-color: red; */
  width: 90%;
  height: 60%;
`;

export const StyledImage = styled(Image)`
  width: 100%;
  height: 100%;
`;