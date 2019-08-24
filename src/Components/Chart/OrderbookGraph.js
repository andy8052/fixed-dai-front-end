import React, {useState, useEffect} from 'react'
import Typography from '@material-ui/core/Typography'

import { ChartCanvas, Chart } from "react-stockcharts";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { AreaSeries } from "react-stockcharts/lib/series";
import { createVerticalLinearGradient, hexToRGBA } from "react-stockcharts/lib/utils";
import { scaleLinear } from "d3-scale";
import { curveStep } from 'd3-shape';

export default function OrderbookGraph(props) {
    const canvasGradient = createVerticalLinearGradient([
        { stop: 0, color: hexToRGBA("#b5d0ff", 0.2) },
        { stop: 0.7, color: hexToRGBA("#6fa4fc", 0.4) },
        { stop: 1, color: hexToRGBA("#4286f4", 0.8) },
    ]);

    const [buyOrdersSorted, setBuyOrdersSorted] = useState(props.orders);

    useEffect(() => {
        setBuyOrdersSorted(props.orders)
    }, [props.orders])
        
    return (
        <ChartCanvas
            ratio={1}
            width={200}
            height={400}
            margin={{ left: 5, right: 0, top: 5, bottom: 30 }}
            seriesName="Orderbook"
            data={buyOrdersSorted}
            type={'svg'}
            xAccessor={d => {
                return d.rate
            }}
            xExtents={[2,4]}
            panEvent={true}
            seriesName={`Orderbook`}
            zoomEvent={false}
            xScale={scaleLinear()}
    >
        <Chart id={10} yExtents={[2000, 4000]} width={'80%'}>
        <linearGradient id="MyGradient" x1="0" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#196719" stopOpacity={0.2} />
                <stop offset="70%" stopColor="#2db92d" stopOpacity={0.4} />
                <stop offset="100%"  stopColor="#6fdc6f" stopOpacity={0.8} />
            </linearGradient>
        <XAxis
            axisAt="bottom"
            orient="bottom"
            tickStroke={'#505050'}
            ticks={5}
            zoomEnabled={false}
            tickStroke={'#505050'}
            stroke={'#505050'}
        />
        <AreaSeries
            yAccessor={d => {
                return d.amount
            }

            }
            fill="url(#MyGradient)"
            canvasGradient={canvasGradient}
            strokeWidth={2}
            stroke={'#009933'}
            interpolation={curveStep}
        />
        <YAxis
            stroke='#000000'
            axisAt="left"
            orient="right"
            tickStroke={'#505050'}
            ticks={5}
            yZoomWidth={0}
            tickStroke={'#505050'}
            stroke={'#505050'}
        />
        </Chart>
    </ChartCanvas>
    )
}