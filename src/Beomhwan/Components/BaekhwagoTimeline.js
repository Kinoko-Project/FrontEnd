import {useRef, useLayoutEffect} from 'react';
import styled from 'styled-components';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as am4timeline from '@amcharts/amcharts4/plugins/timeline';

const Container = styled.div`
    width: 100%;
    height: 600px;
`;

const BaekhwagoTimeline = () => {
    const timeLineRef = useRef();

    useLayoutEffect(() => {
        am4core.useTheme(am4themes_animated);

        // Create chart instance
        // var chart = am4core.create("baekhwaTimeline", am4timeline.SpiralChart);
        // chart.levelCount = 3;
        // chart.inversed = true;
        // chart.endAngle = -135;

        const chart = am4core.create('baekhwaTimeline', am4timeline.SerpentineChart);
        chart.curveContainer.padding(50, 20, 50, 20);
        chart.levelCount = 4;
        chart.yAxisRadius = am4core.percent(25);
        chart.yAxisInnerRadius = am4core.percent(-25);
        chart.maskBullets = false;

        let title = chart.titles.create();
        title.text = 'ベクファゴ 段階基準：ラインにマウスをのせてください！';
        title.fontSize = 20;

        chart.data = [
            { 
                category: "進行段階", 
                openValue: 0, 
                endValue: 1,
                stage: '1段階',
                description: '1段階ではキノコの高菜の長さが1cm以下です。'
            },
            { 
                category: "進行段階", 
                openValue: 1, 
                endValue: 2,
                stage: '2段階',
                description: '2段階ではキノコの高菜の長さが1cm~2cmです。'
            },
            { 
                category: "進行段階", 
                openValue: 2, 
                endValue: 3,
                stage: '3段階',
                description: '3段階ではキノコの高菜の長さが2cm~4cmです。'
            },
            { 
                category: "進行段階", 
                openValue: 3, 
                endValue: 4,
                stage: '4段階',
                description: '4段階ではキノコの高菜の長さが4cm~5cmです。'
            },
            { 
                category: "進行段階", 
                openValue: 4, 
                endValue: 5,
                stage: '5段階',
                description: '5段階ではキノコの高笠の長さが5cmを超えます。'
            },
        ];

        var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "category";
        categoryAxis.renderer.grid.template.disabled = true;
        categoryAxis.renderer.labels.template.paddingRight = 25;
        categoryAxis.renderer.minGridDistance = 10;
        categoryAxis.renderer.innerRadius = -60;
        categoryAxis.renderer.radius = 60;

        var categoryAxisLabelTemplate = categoryAxis.renderer.labels.template;
        categoryAxisLabelTemplate.paddingLeft = 30;
        categoryAxisLabelTemplate.adapter.add("rotation", function (rotation, target) {
            var position = valueAxis.valueToPosition(valueAxis.min);
            return valueAxis.renderer.positionToAngle(position) - 90;
        });

        var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.minGridDistance = 70;
        valueAxis.paddingRight = 50;
        valueAxis.renderer.grid.template.disabled = true;
        valueAxis.renderer.line.strokeDasharray = "1,4";
        valueAxis.renderer.line.strokeOpacity = 0.5;
        valueAxis.cursorTooltipEnabled = false;
        valueAxis.min = 0;
        valueAxis.renderer.labels.template.disabled = true;

        var series = chart.series.push(new am4timeline.CurveColumnSeries());
        series.dataFields.categoryY = "category";
        series.dataFields.openValueX = 'openValue';
        series.dataFields.valueX = 'endValue';

        let categoryLabel = series.bullets.push(new am4charts.LabelBullet());
        categoryLabel.label.text = "{stage}";
        categoryLabel.label.fontSize = 12;
        categoryLabel.locationX = 0.5;
        categoryLabel.label.fill = am4core.color("#fff");

        var columnTemplate = series.columns.template;
        series.columns.template.tooltipText = '{description}';
        series.tooltip.fontSize = 16;
        columnTemplate.height = am4core.percent(80);
        columnTemplate.adapter.add("fill", function (fill, target) {
            return chart.colors.getIndex(target.dataItem.index * 2);
        })
        columnTemplate.strokeOpacity = 0;
        columnTemplate.margin = am4core.percent(30);

        timeLineRef.current = chart;
        return () => chart.dispose();
    }, []);

    return <Container id="baekhwaTimeline" ref={timeLineRef}></Container>
}

export default BaekhwagoTimeline;