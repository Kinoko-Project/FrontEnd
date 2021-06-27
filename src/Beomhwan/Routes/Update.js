import React, {useRef, useState, useEffect} from 'react';
import styled from 'styled-components';
import {Line} from 'react-chartjs-2';
import {CustomChart as UpdateCustomChart, WarningText, SettingBox, Button, LogBox, CheckBox, CheckMenu, Menu2, SetDate, SetWaterSun, SettingName} from './Add';
import * as Description from '../Components/Compare';
import { setChartjsDataset, options } from '../Util';
import {getRunningChartInfo, getKinoko, updateCustomProgram} from '../api';
import Modal from '../Components/Modal';
import {Button as ModalButton, ModalTitleBox} from '../Components/ModalContent';
import { useKinokoState } from '../../KinokoContext';
import Select from '../Components/Select';
import {Redirect} from 'react-router-dom';



// ------------------------지금까지의 환경 그래프------------------------

const RanCustomChart = ({data}) => {
    const LineChart = useRef();

    console.dir(LineChart);

    return <Line ref={LineChart} data={data} options={options} />
}
// --------------------------------------------------------------------


// -----------------------------------------------------------------------

// --------------------Div 분할 세팅--------------------
const CustomAddDiv = styled.div`
    width: 100%;
    height: 500px;
    display: flex;
    flex-wrap: wrap;
`;
// ---------------------------------------------------- 

// -----------------지금까지 실행되었던 커스텀 환경 정보 스타일-----------------
const UpdateGraphBox = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid gray;
`;

const RanEnvironmentGraph = styled.div`
    flex: 2;
    padding: 20px;
`;

const RanEnvironmentInfo = styled.div`
    flex: 1;
    padding: 20px;
    border-left: 1px solid gray;
`;
// -------------------------------------------------------------------------

const DrawGraph = styled.div`
    padding: 10px;
    flex: 1.5;
    height: 45vh;
`;

class MyError extends Error {
    constructor(errorName, ...params) {
        super(...params);
        this.name = errorName;
    }
}

const Update = ({cookies, history}) => {
    const [loading, setLoading] = useState(true);
    const [optionCounts, setOptionCounts] = useState({});
    const [compareChartData, setCompareChartData] = useState({});
    const limitDate = useRef(0);
    const extendDate = useRef(0);
    const [data, setData] = useState([]);
    const [kinokoCount, setKinokoCount] = useState(0);
    const [modalInfo, setModalInfo] = useState({
        opacity: 0,
        customId: null,
        titleText: '',
        modalTextfirst: '',
    });

    const state = useKinokoState();
    const { data:programInfo } = state.programInfo;

    useEffect(() => {
        if(programInfo) {
            getKinoko(programInfo[0].id).then(res => {
                setKinokoCount(res.length);
            })
            getRunningChartInfo(programInfo[0].id, 'custom').then(async res => {
                console.log(res);
                extendDate.current = res.humidity.length + 1;
                limitDate.current = res.humidity.length;
                await setOptionCounts({
                    water: res.water,
                    sunshine: res.sunshine
                });
                setData(chartData => chartData.concat({
                    Date: extendDate.current + '日目',
                    Temperature: 20,
                    Humidity: 80
                }));

                let date = [];
                let temp = [];
                let humi = [];
                let grow = [];
                await res.humidity.map((ch,i) => {
                    date.push((i + 1) + '日目');
                    temp.push(res.temperature[i].setting_value);
                    humi.push(ch.setting_value);
                    if(res.growthRate.length !== 0) {
                        grow.push(res.growthRate[i].gr_value);
                    }
                });
                await setCompareChartData(setChartjsDataset(date, temp, humi, grow));
            }).then(() => {
                setLoading(false);
            })
        }
    },[]);

    // 1일 추가
    const Add = () => {
        extendDate.current += 1;
        let addData = {
            Temperature: 20,
            Humidity: 80,
            Date: extendDate.current + "日目"
        };

        setData(chartData => chartData.concat(addData));
        
        console.dir(data);
    };

    // 1일 빼기
    const Remove = () => { 
        setData(
            data.filter(ch => ch.Date !== extendDate.current + "日目")
        );
        extendDate.current > limitDate.current ? extendDate.current -= 1 : extendDate.current = limitDate.current; // 지정된 일차에 맞춰서
        console.dir(data);
    };

    const [count, setCount] = useState({
        sunCount: 0,
        waterCount: 3
    });

    const sunChange = (e) => {
        switch(e) {
            case '+' :
                count.sunCount < 5 
                    ? setCount({...count, sunCount: count.sunCount + 1})
                    : setCount({...count, sunCount: 5});
                break;
            case '-' :
                count.sunCount > 0
                    ? setCount({...count, sunCount: count.sunCount - 1})
                    : setCount({...count, sunCount: 0});
                break;
            default :
                break;
        };
    };

    const waterChange = (e) => {
        switch(e) {
            case '+' :
                count.waterCount < 10 
                    ? setCount({...count, waterCount: count.waterCount + 1})
                    : setCount({...count, waterCount: 10});
                break;
            case '-' :
                count.waterCount > 3
                    ? setCount({...count, waterCount: count.waterCount - 1})
                    : setCount({...count, waterCount: 3});
                break;
            default :
                break;
        };    
    };

    function onSubmit() {
        try{
            let temp = [];
            let humi = [];
            let token = window.Kakao.Auth.getAccessToken();
            let period = data.length;
            data.map(ch => {
                if(ch.Temperature > 27) {
                    throw new MyError('TempErrorUp');
                }
                else if(ch.Temperature < 17) {
                    throw new MyError('TempErrorDown');
                }
                temp.push(ch.Temperature);
                humi.push(ch.Humidity);
            });

            console.log(programInfo[0].id);
            console.log(temp, humi);
            console.log(period);
            console.log(token);
            console.log(count);

            const updateInfo = {
                prgId: programInfo[0].id,
                token: token,
                period: period,
                temps: temp,
                humis: humi,
                water: count.waterCount,
                sunshine: count.sunCount
            }

            updateCustomProgram(updateInfo).then(res => {
                console.log(res);
                setModalInfo({
                    opacity: 1,
                    customId: programInfo[0].id,
                    titleText: 'プログラムを成功的に延長しました。',
                    modalTextfirst: '',
                });
            })
        }catch(e) {
            if(e.name === 'TempErrorUp') {
                alert('温度制限27℃を超えました！');
            } 
            else if(e.name === 'TempErrorDown') {
                alert('温度制限17℃より低いです！');
            }
        }
    }

    function onClose () {
        setModalInfo({
            opacity: 0,
            customId: null,
            titleText: '',
            modalTextfirst: '',
        })
        history.push('/');
    }

    if(loading) return <LoadingContainer>Loading...</LoadingContainer>

    if(!programInfo) {
        alert('現在実行中のプログラムがございません！');
        return (<Redirect to="/setting/custom" />);
    }

    return (
        <>
            <CustomAddDiv>
                <UpdateGraphBox>
                    <RanEnvironmentGraph>
                        <RanCustomChart data={compareChartData}/>
                    </RanEnvironmentGraph>
                    <RanEnvironmentInfo>
                        <Description.DescriptionBox>
                            <Description.TitleBox>
                                - {programInfo[0].prg_name} -
                            </Description.TitleBox>
                            <Description.CardFlex>
                                <Description.CardBox>
                                    <Description.CardTitle>取ったキノコの数</Description.CardTitle>
                                    <Description.CardContent>{kinokoCount}個</Description.CardContent>
                                </Description.CardBox>
                                <Description.CardBox>
                                    <Description.CardTitle>栽培日</Description.CardTitle>
                                    <Description.CardContent>{limitDate.current}日目</Description.CardContent>
                                </Description.CardBox>
                            </Description.CardFlex>
                            <Description.ExtraInfoBox>
                                <Description.ButtonContainer>
                                    <Description.StatusCard>
                                        <div class="side front">
                                            <div class="descrition">
                                                <Description.Water /> 
                                            </div>
                                        </div>
                                        <div class="side back">
                                            <div class="description">
                                                {optionCounts.water}回
                                            </div>
                                        </div>
                                    </Description.StatusCard>
                                    <Description.StatusCard>
                                        <div class="side front">
                                            <div class="descrition">
                                                <Description.Sun /> 
                                            </div>
                                        </div>
                                        <div class="side back">
                                            <div class="description">
                                                {optionCounts.sunshine}回
                                            </div>
                                        </div>
                                    </Description.StatusCard>
                                </Description.ButtonContainer>
                            </Description.ExtraInfoBox>
                        </Description.DescriptionBox> 
                    </RanEnvironmentInfo>
                </UpdateGraphBox>
            </CustomAddDiv>
            <SettingBox>
                <DrawGraph>
                    <UpdateCustomChart Data={data} titleMsg={'그래프를 업데이트 해보자!'}/>
                </DrawGraph>
                <SettingBox>
                <CheckBox>
                    <CheckMenu>
                        <WarningText>温度は17~27℃で制限します。</WarningText>
                        {data.map(ch => {
                            if(ch.Temperature > 27)
                                return <LogBox>{ch.Date} 温度が27℃以上です！</LogBox>
                            else if(ch.Temperature < 17)
                                return <LogBox>{ch.Date} 温度が27℃以下です！</LogBox>
                        })}
                    </CheckMenu>
                    <Menu2>
                        <SetDate>
                            <Button onClick={Remove}>1日抜き</Button>
                            <Button onClick={Add}>1日追加</Button>
                        </SetDate>
                        <SetWaterSun>
                            <Select 
                                count={count} 
                                sunChange={sunChange} 
                                waterChange={waterChange} 
                            />
                        </SetWaterSun>
                    </Menu2>
                </CheckBox>
                    <SettingName>
                        <Button onClick={onSubmit}>適用する</Button>
                    </SettingName>
                </SettingBox>
            </SettingBox>
            <Modal onClose={onClose} opacity={modalInfo.opacity} customId={modalInfo.customId} width={400} height={200}>
                <ModalTitleBox>
                    {modalInfo.titleText}
                </ModalTitleBox>
            </Modal>
        </>
    );
};

const LoadingContainer = styled.p`
    font-size: 1.4em;
    text-align: center;
`;

export default Update;

// modal 띄운 뒤에 이동시킬 것!