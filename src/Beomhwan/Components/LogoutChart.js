import React, {useLayoutEffect, useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import axios from 'axios';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import {useKinokoState} from '../../KinokoContext';
import {URL} from '../Util';
import { getLogoutDate } from '../api';

const LogoutChartComponent = ({loading, prgId, date}) => {
    const chartRef = useRef();
    
    useLayoutEffect(() => {

        let chart = am4core.create('logoutDiv', am4charts.XYChart);
        am4core.useTheme(am4themes_animated);
        chart.cursor = new am4charts.XYCursor();

        let title = chart.titles.create();
        title.text = 'Now Loading...';
        title.fontSize = 20;
        title.tooltipText = "最近ログアウト時間からログイン一時間前まで表示されます。";
        title.marginBottom = 20;

        chart.legend = new am4charts.Legend();

        // data 삽입 => prg.prg_id도 추가할 것!
        chart.dataSource.url = `${URL}/api/myfarm/data/hour?prgId=55`; // ${prgId}
        chart.dataSource.parser = new am4core.JSONParser();
        chart.dataSource.parser.options.emptyAs = 0;
        chart.dataSource.events.on("parseended", function(ev) {
            let a = [];
            let data = ev.target.data;
            console.log('data : ', data);
            data.temperature.map((da,i) => {
                a.push({
                    temp: da.value,
                    humi: data.humidity[i].value,
                    date: new Date(da.date)
                })
            })
            
            ev.target.data = a;

            if(prgId === 0) {
                chart.openModal('適用されたプログラムがございません。');
            } else if(a.length === 0 && prgId > 0) {
                chart.openModal('ログアウト時間が一時間以内です。');
            }
            title.text = 'ログアウト時間の栽培機温度、湿度変化';
        })

        // axis 생성
        let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.dataFields.date = 'date';

        let tempAxis = chart.yAxes.push(new am4charts.ValueAxis());
        tempAxis.dataFields.data = 'temp';
        tempAxis.title.text = "温度 / 湿度";

        let humiAxis = chart.yAxes.push(new am4charts.ValueAxis());
        humiAxis.dataFields.data = 'humi';

        // series 생성
        let tempSeries = chart.series.push(new am4charts.LineSeries());
        tempSeries.name = '温度';
        tempSeries.dataFields.valueY = 'temp';
        tempSeries.dataFields.dateX = 'date';
        tempSeries.stroke = am4core.color('rgba(255,0,0,0.5)');
        tempSeries.fill = am4core.color('rgba(255,0,0,1)');
        tempSeries.strokeWidth = 3;
        tempSeries.tensionX = 0.8;
        tempSeries.tooltipText = '{dateX.formatDate("MM-dd HH:mm")} : {valueY}도';

        let humiSeries = chart.series.push(new am4charts.LineSeries());
        humiSeries.name = '湿度';
        humiSeries.dataFields.valueY = 'humi';
        humiSeries.dataFields.dateX = 'date';
        humiSeries.stroke = am4core.color('rgba(0,0,255,0.5)');
        humiSeries.strokeWidth = 3;
        humiSeries.tensionX = 0.8;
        humiSeries.fill = am4core.color('rgba(0,0,255,1)');
        humiSeries.tooltipText = "{dateX.formatDate('MM-dd HH:mm')} : {valueY}%";

        // bullet 생성
        let tempBullet = tempSeries.bullets.push(new am4charts.Bullet());
        tempBullet.width = 10;
        tempBullet.height = 10;

        chartRef.current = chart;
        
        return () => chart.dispose();
    }, [loading]);

    if(loading) {
        return <>Chart Loading...</>
    }

    return <ChartContainer id="logoutDiv"></ChartContainer>;
}

const ChartContainer = styled.div`
    width: 100%;
    height: 100%;
`;


const LogoutChart = () => {
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState('');
    const state = useKinokoState();
    const {data: programInfo} = state.programInfo;
    console.log(programInfo[0].id);

    const token = window.Kakao.Auth.getAccessToken();
    let userInfoString = window.localStorage.getItem('userInfo');
    const userInfo = JSON.parse(userInfoString);

    useEffect(() => {
        const getDate = async () => {
            getLogoutDate(userInfo.id, token).then(response => {
                console.log(response);
                setDate(response.data);
            }).catch(err => {
                setDate(null);
                setLoading(false);
            })
        }

        getDate().then(() => {
            setLoading(false);
        });
    }, []);

    // loading 중일 때
    if(loading) {
        return <>Now Loading...</>
    }

    // date 없을 시 null 반환
    if(!programInfo) {
        return <>現在プログラムがございません。</>;
    }

    return (
        <LogoutChartComponent loading={loading} prgId={programInfo[0].id} date={date}/>
    );
}

export default LogoutChart;