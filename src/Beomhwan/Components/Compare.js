import React,{useState, useEffect} from 'react';
import styled from 'styled-components';
import { flexAlign } from '../../Util/css';
import {NotoSansRegular, SvgSize, BoxShadowTrick} from '../css/cssModule';
import {Line} from 'react-chartjs-2';
import {getKinoko} from '../api';
import {GiWaterDrop} from 'react-icons/gi';
import {RiArrowGoBackLine} from 'react-icons/ri';
import {BiArrowToLeft, BiArrowToRight} from 'react-icons/bi'; 
import {HiSun} from 'react-icons/hi';
import {options} from '../Util';

const NextSvg = styled(BiArrowToRight)`
    ${SvgSize};
    color: #dddddd;
    &:hover {
        color: gray;
    }
`;

const BackSvg = styled(BiArrowToLeft)`
    ${SvgSize};
    color: #dddddd;
    &:hover {
        color: gray;
    }
`;

const BackButton = styled(RiArrowGoBackLine)`
    ${SvgSize};
    color: gray;
    cursor: pointer;
    &:hover {
        color: black;
    }
    transition-duration: 0.2s;
    position: absolute;
    top: 20px;
`;

const Water = styled(GiWaterDrop)`
    width: 40px;
    height: 40px;
    color: #00BCD4;
`;

const Sun = styled(HiSun)`
    width: 40px;
    height: 40px;
    color: #F5A962;
`;

const ContainerBox = styled.div`
    width: 1010px;
    height: 100%;
    overflow: hidden;
`;

const CompareListBox = styled.div`
    float:left;
    width: ${props => props.width}px;
    height: 100%;
    transition-duration: 0.5s;
    transform: translate3d(-${props => props.x}px, 0, 0);
`;

const ChartBox = styled.div`
    padding-top: 30px;
    flex: 4;
    height: 100%;
`;

const DescriptionBox = styled.div`
    flex: 2;
    height: 100%;
    ${flexAlign};
    flex-direction: column;
`;

const CompareBox = styled.div`
    float: left;
    width: ${p=>p.width}px;
    height: 100%;
    ${flexAlign};
    padding-top: 10px;
`;

const CardFlex = styled.div`
    ${flexAlign};
    flex-direction: row;
`;

const CardBox = styled.div`
    background-color: white;
    border: 1px solid #dddddd;
    border-radius: 10px;
    width: 150px;
    height: 150px;
    margin: 20px;
    ${flexAlign};
    flex-direction: column;
`;

const TitleBox = styled.div`
    ${NotoSansRegular}
    width: 100%;
    font-size: 1.2em;
    flex: 1;
    ${flexAlign};
`;

const CardTitle = styled.div`
    ${flexAlign};
    flex: 1;
`;

const CardContent = styled.div`
    ${flexAlign};
    flex: 3;
    font-size: 1.5em;
`;

const ExtraInfoBox = styled.div`
    width: 100%;
    flex: 2;
`;

const StatusCard = styled.div`
    width: 50px;
    position: relative;
    height: 50px;
    perspective: 150em;
    text-align: center;
    user-select: none;
    margin-right: 15px;

    .side {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        transition: all .6s ease;
        border: 1px solid #dddddd;
        border-radius: 50px;
        background-color: #FFF; 
        ${flexAlign};
    }

    .front {
    }
    
    .back {
        transform: rotateY(180deg);
    }

    &:hover .front {
        transform: rotateY(-180deg);
    }
    &:hover .back {
        transform: rotateY(0);
    }

    .description {
        text-transform: uppercase;
        /* line-height: 50px; */
    }
`;

const ButtonContainer = styled.div`
    width: 100%;
    display: flex;
`;

const Button = styled.button`
    background-color: rgba(0,0,0,0);
    border: 1px solid #dddddd;
    border-radius: 5px;
    flex: 1;
    height: 40px;
    cursor: pointer;
    &:focus {
        outline: none;
    }
    &:hover ${NextSvg}, &:hover ${BackSvg} {
        color: gray;
    }
    &:hover {
        border: 1px solid gray;
    }
`;

const LineChart = ({data}) => {
    console.log(data);
    return <Line data={data} options={options} />
};

function useGetClientWidth() {
    let size = 1010;
    return size;
}

const Compare = ({goSlide, chart}) => {

    console.log(chart);
    let [chartData, setChartData] = useState([]);
    const [slideInfo, setSlideInfo] = useState({
        chartSize: 0,
        width: 0,
        x: 0,
        count: 0
    });

    const responsiveWidth = useGetClientWidth();
    console.log('반응형 : ', responsiveWidth);

    useEffect(() => {
        setSlideInfo({...slideInfo, width: responsiveWidth * chart.length});
    }, [responsiveWidth]);

    useEffect(() => {
        setSlideInfo({...slideInfo, width:  responsiveWidth * chart.length});

        chart.map(async (ch,i) => {
            await getKinoko(ch.prg_id)
            .then(data => {
                let chart = {
                    ...ch,
                    kinokoCount: data.length
                }

                setChartData(ch => [...ch, chart]);
            });
        });
    }, []);

    const onNext = () => {
        slideInfo.count < chart.length - 1
        ? setSlideInfo({
            ...slideInfo,
            x: slideInfo.x + responsiveWidth,
            count: ++slideInfo.count
        })
        : setSlideInfo({...slideInfo, count: chart.length-1});
    };

    const onPreview = () => {
        
        slideInfo.count > 0
        ? setSlideInfo({
            ...slideInfo, 
            count: --slideInfo.count,
            x: slideInfo.x - responsiveWidth
        })
        : setSlideInfo({...slideInfo, count: 0}) 
        
    };

    return (
        <ContainerBox width={responsiveWidth}>
            {chart.length !== 0 ? 
            <>
            <CompareListBox width={slideInfo.width} x={slideInfo.x}>
                {chartData.map((ch,i) => 
                    <CompareBox key={i} width={responsiveWidth}>
                        <ChartBox>
                            <LineChart data={ch.data} />
                            {/* <CompareChart /> */}
                        </ChartBox>
                        <DescriptionBox>
                            <TitleBox>
                                - {ch.prg_name} -
                            </TitleBox>
                            <CardFlex>
                                <CardBox>
                                    <CardTitle>取ったキノコの数</CardTitle>
                                    <CardContent>{ch.kinokoCount}個</CardContent>
                                </CardBox>
                                <CardBox>
                                    <CardTitle>栽培日</CardTitle>
                                    <CardContent>{ch.data.labels.length}日目</CardContent>
                                </CardBox>
                            </CardFlex>
                            <ExtraInfoBox>
                                <BackButton onClick={goSlide} /> 
                                <ButtonContainer>
                                    <Button onClick={onPreview}><BackSvg /></Button>
                                    <Button onClick={onNext}><NextSvg /></Button> 
                                </ButtonContainer>
                                <ButtonContainer>
                                    <StatusCard>
                                        <div class="side front">
                                            <div class="descrition">
                                                <Water /> 
                                            </div>
                                        </div>
                                        <div class="side back">
                                            <div class="description">
                                                {ch.prg_water}回
                                            </div>
                                        </div>
                                    </StatusCard>
                                    <StatusCard>
                                        <div class="side front">
                                            <div class="descrition">
                                                <Sun /> 
                                            </div>
                                        </div>
                                        <div class="side back">
                                            <div class="description">
                                                {ch.prg_sunshine}回
                                            </div>
                                        </div>
                                    </StatusCard>
                                </ButtonContainer>
                            </ExtraInfoBox>
                        </DescriptionBox>    
                    </CompareBox>
                )}
            </CompareListBox>
            </>
            : 
            <>
                <CompareBox style={{flexDirection: 'column'}} width={responsiveWidth}>
                    <NoneCheckedMessage>チェックされたプログラムがございません。</NoneCheckedMessage>
                    <ReturnButton onClick={goSlide}>もどる</ReturnButton>
                </CompareBox>
            </>
            }
        </ContainerBox>
    )
}

const NoneCheckedMessage = styled.p`
    text-align: center;
    font-size: 1.3em;
    margin: 10px auto;
`;

const ReturnButton = styled.button`
    width: 200px;
    height: 50px;
    border: 1px solid #dddddd;
    background-color: white;
    border-radius: 5px;
    cursor: pointer;
    ${BoxShadowTrick};
`;

export default Compare;
export {DescriptionBox, ExtraInfoBox, CardFlex, CardBox, CardContent, CardTitle, TitleBox, StatusCard, ButtonContainer, Water, Sun};