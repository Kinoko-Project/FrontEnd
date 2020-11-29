import React from 'react' ;
import styled from 'styled-components';
const Container   = styled.div`

    width : 100%;
    display: flex;
    padding : 50px;
    background      :rgb(224, 224, 218);

`;
// 전체 틀
const Section1    = styled.div`
    height : 83vh;
    display:flex;
    flex : 1;
    flex-direction : column;
    margin : 0 20px;
    border-radius : 20px;
`;

// 버섯 정보 구역
const Item1 = styled.div`
    flex : 3;
    display: flex;
    border: 1px solid black;
    border-radius : 10px;
    background: white;
    margin-bottom: 10px;
`;

const Item1Img = styled.div`
    flex : 1.6;
    justify-content : center;
    /* background : green; */
    margin : 5px;
    display: flex;
    flex-direction : column;
    justify-content : center;
    align-items : center;
`;
const Item1Info = styled.div`
    margin : 10px;
    flex : 4;
    display: flex;
    justify-content: center;
    align-items : center;
    background : blue;
`;


//선택한 키노코 이미지
const KinokoImg = styled.div`
    box-shadow      : 0 0 8px 0 rgba(0, 0, 0, 0.12), 0 0 8px 0 rgba(0, 0, 0, 0.06);
    width  : 170px;
    height : 170px;
    border-radius : 23px;
    margin : 5px;
`;
const Text = styled.div`
    padding : 5px;
`;

//선택한 버섯 정보
const KinokoInfo = styled.div`
    
    background : blue;
`;

//버섯 아이콘 구역
const Item2 = styled.div`
    display: flex;
    justify-content : space-evenly;
    align-items : center;
    background: white;
    border: 1px solid black;
    border-radius : 10px;
    flex : 1;

`;

//버섯 아이콘
const KinokoIcons = styled.div`
    text-align : center;
    /* background : #ddd; */
    box-shadow      : 0 0 8px 0 rgba(0, 0, 0, 0.12), 0 0 8px 0 rgba(0, 0, 0, 0.06);
    width : 150px;
    height : 150px;
    margin : 5px;
    cursor: pointer;
    
    &:hover{
        background : #ddd;
    }
`;

//기기 사용법 구역
const Section2    = styled.div`
    height  : 83vh;
    flex : 1;
    margin : 0 20px;
    padding : 10px;
    /* flex-basis : 40vh; */
    background: white;
    border: 1px solid black;
    border-radius : 20px;
`;

const Help = () => {
    return (
        <Container>
            <Section1> 
                <Item1>
                    <Item1Img> {/* 선택한 버섯 이미지 */}
                        <KinokoImg></KinokoImg>
                        <Text>표고버섯</Text>
                    </Item1Img>
                    <Item1Info> {/* 선택한 버섯 정보 */}
                        <KinokoInfo></KinokoInfo>
                    </Item1Info>
                </Item1>

                <Item2> {/* 버섯 종류 아이콘 */}
                    <KinokoIcons>1</KinokoIcons>
                    <KinokoIcons>2</KinokoIcons>
                    <KinokoIcons>3</KinokoIcons>
                    <KinokoIcons>4</KinokoIcons>
                </Item2>
            </Section1>

            <Section2> 기기 사용 방법은 추후 추가할 예정</Section2>
        </Container>
    );
};

export default Help ;