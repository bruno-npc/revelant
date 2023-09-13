import styled from 'styled-components/native'
export const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #f0f0f0;
`;

export const TopBar = styled.View`
  height: 60px;
  width: 100%;
`;

export const BackButton = styled.TouchableOpacity`
  position: absolute;
  left: 20px;
  top: 15px;
`;

export const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  margin-top: 20px;
`;

export const Subtitle = styled.Text`
  font-size: 18px;
  margin-top: 10px;
`;

export const Input = styled.TextInput`
  height: 40px;
  margin-top: 20px;
  border-width: 1px;
  border-color: #ccc;
  padding: 10px;
  border-radius: 5px;
`;

export const Button = styled.TouchableOpacity`
  background-color: #9372F1;
  padding: 15px;
  border-radius: 5px;
  align-items: center;
  margin-top: 20px;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

export const CheckBoxContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
`;

export const CheckBox = styled.TouchableOpacity`
  width: 20px;
  height: 20px;
  border-width: 1px;
  border-color: #ccc;
  border-radius: 3px;
  margin-right: 10px;
`;

export const CheckBoxText = styled.Text`
  font-size: 14px;
`;

export const TextLink = styled.TouchableOpacity`
  margin-top: 20px;
  align-items: center;
`;

export const TextLinkText = styled.Text`
  font-size: 14px;
  color: #9372F1;
`;