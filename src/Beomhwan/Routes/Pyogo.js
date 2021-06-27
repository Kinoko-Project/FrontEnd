import React, {useRef, useEffect, memo, useState} from 'react';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';
import Modal from '../Components/Modal';
import {flexAlign} from '../../Util/css';
import {options} from '../Util';
import {BoxShadowTrick} from '../css/cssModule';
import ModalContent from '../Components/ModalContent';
import PyogoTimeLine from '../Components/PyogoTimeLine';

const data = {
    labels: ['1日目','2日目','3日目','4日目','5日目','6日目','7日目','8日目','9日目','10日目','11日目','12日目','13日目','14日目'],
    datasets: [
        {
            label: '温度',
            data: [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25,],
            fill: false,
            borderColor: '#EC5858',
        },
        {
            label: '湿度',
            data: [80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, 80, ],
            fill: false,
            borderColor: '#00BCD4',
        }
    ]
};

export const Chart = () => {
    const ChartRef = useRef();

    return(
        <Line data={data} options={options} ref={ChartRef} />
    );
};

const PyogoStyled = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
`;

const PyogoGraphBox = styled.div`
    height: 500px;
    border-bottom: 1px solid gray;
    padding: 30px;
    margin: 5px;
`;

const FooterBox = styled.div`
    padding: 30px;
    display: flex;
    flex-direction: row;
`;

const Description = styled.div`
    flex: 9;
    text-align: center;
`;

const GrowStartBox = styled.div`
    padding: 30px;
    flex: 1;
    display: flex;
`;

const GrowStartButton = styled.button`
    width: 100px;
    height: 40px;
    border-radius: 5px;
    border: 3px solid #dddddd;
    background-color: white;
    transition: 0.3s;
    cursor: pointer;
    &:focus {
        outline: none;
    }
    ${BoxShadowTrick};
`;

const ModalOnButton = ({onModal}) => {
    return (
        <GrowStartButton onClick={onModal}>
            適用
        </GrowStartButton>
    )
} 

const Pyogo = () => {
    const [opacity, setOpacity] = useState(0);
    const PyogoModalText = {
        title: 'シイタケ環境プログラム適用',
        caution1: `
            一定の環境でシイタケの栽培を実施します。
            水をやる回数は8時間に1回です。
        `,
        caution2: '栽培を開始しますか？',
        waterText: '水やり回数：3回',
        sunText: '採光回数：0回'
    }

    const onModal = () => {
        setOpacity(1);
    };

    const onClose = () => {
        setOpacity(0);
    };

    return (
        <PyogoStyled>
            <Modal opacity={opacity} customId='0' onClose={onClose}>
                <ModalContent chartname='pyogo' text={PyogoModalText} onClose={onClose}/>
            </Modal>
            <PyogoGraphBox>
                <Chart />
            </PyogoGraphBox>
            <FooterBox>
                <Description>
                    <PyogoTimeLine />
                </Description>
                <GrowStartBox>
                    <ModalOnButton onModal={onModal}>適用</ModalOnButton>
               </GrowStartBox>
            </FooterBox>
        </PyogoStyled>
    );
};

export default Pyogo;