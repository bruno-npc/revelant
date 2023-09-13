import styled from 'styled-components/native'
export const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #f0f0f0;
`;

export const Input = styled.TextInput`
background-color: transparent;
margin: 10px;
font-size: 15px;
color: '#000';
border: 1px solid black;
border-radius: 4px;
padding: 6px 6px;
`;

export const Button = styled.TouchableOpacity`
background-color: '#418cfd';
margin-right: 7px;
border-radius: 4px;
padding: 5px 12px;
align-items: center;
justify-content: center;
`;

export const ButtonText = styled.Text`
color: #FFF;
font-size: 16px;
`;