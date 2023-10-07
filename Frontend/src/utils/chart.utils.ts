import {
    ColorType,
    createChart,
    CandlestickData,
    IChartApi,
    ISeriesApi,
    Time,
    TickMarkType,
    WhitespaceData,
    BaselineData,
} from 'lightweight-charts'

export const CHART_BACKGROUND_COLOR = 'white'
export const CHART_LINE_COLOR = '#2962FF'
export const CHART_TEXT_COLOR = 'black'
export const CHART_AREA_TOP_COLOR = '#2962FF'
export const CHART_AREA_BOTTOM_COLOR = 'rgba(41, 98, 255, 0.28)'
export const CHART_UP_COLOR = '#26a69a'
export const CHART_DOWN_COLOR = '#ef5350'
export const CHART_BORDER_VISIBLE = false
export const CHART_WICK_UP_COLOR = '#26a69a'
export const CHART_WICK_DOWN_COLOR = '#ef5350'

export type CandlestickChart = {
  chart: IChartApi;
  series: ISeriesApi<'Candlestick'>;
};

export const createCandlestickChart = (
    container: HTMLDivElement,
    chartInterval: ChartInterval,
): CandlestickChart => {
    const chart = createChart(container, {
        layout: {
            background: { type: ColorType.Solid, color: CHART_BACKGROUND_COLOR },
            textColor: CHART_TEXT_COLOR,
        },
        rightPriceScale: {
            borderVisible: false,
        },
        width: container.clientWidth,
        height: 300,
        timeScale: {
            timeVisible: true,
            borderVisible: false,
            tickMarkFormatter: (timePoint: number, type: TickMarkType) => {
                console.log(type)
                switch (chartInterval) {
                case ChartInterval._24H:
                    return new Date(timePoint * 1000).getHours()
                case ChartInterval._1W:
                    return new Date(timePoint * 1000).getDate()
                case ChartInterval._1M:
                    return new Date(timePoint * 1000).getDate()
                case ChartInterval._1Y:
                    if (type > 1) return ''
                    return parseMonth(new Date(timePoint * 1000).getMonth())
                }
            },
        },
    })

    const series = chart.addCandlestickSeries({
        upColor: CHART_UP_COLOR,
        downColor: CHART_DOWN_COLOR,
        borderVisible: CHART_BORDER_VISIBLE,
        wickUpColor: CHART_WICK_UP_COLOR,
        wickDownColor: CHART_WICK_DOWN_COLOR,
    })

    chart.timeScale().fitContent()

    return {
        series,
        chart,
    }
}

export const updateCandlestickChartData = (
    series: ISeriesApi<'Candlestick'>,
    data: DefCandlestickData[],
) => {
    const _data = data.map((element) => {
        return {
            time: element.time.getTime() / 1000,
            open: element?.open,
            high: element?.high,
            low: element?.low,
            close: element?.close,
        }
    })
    series.setData(_data as (CandlestickData<Time> | WhitespaceData<Time>)[])
}

export type BaselineChart = {
    chart: IChartApi;
    series: ISeriesApi<'Baseline'>;
  };
  
export const createBaselineChart = (
    container: HTMLDivElement,
    chartInterval: ChartInterval,
): BaselineChart => {
    const chart = createChart(container, {
        layout: {
            background: { type: ColorType.Solid, color: CHART_BACKGROUND_COLOR },
            textColor: CHART_TEXT_COLOR,
        },
        rightPriceScale: {
            borderVisible: false,
        },
        width: container.clientWidth,
        height: 300,
        timeScale: {
            timeVisible: true,
            borderVisible: false,
            tickMarkFormatter: (timePoint: number, type: TickMarkType) => {
                console.log(type)
                switch (chartInterval) {
                case ChartInterval._24H:
                    return new Date(timePoint * 1000).getHours()
                case ChartInterval._1W:
                    return new Date(timePoint * 1000).getDate()
                case ChartInterval._1M:
                    return new Date(timePoint * 1000).getDate()
                case ChartInterval._1Y:
                    if (type > 1) return ''
                    return parseMonth(new Date(timePoint * 1000).getMonth())
                }
            },
        },
    })

    const series = chart.addBaselineSeries({
        baseValue: { type: 'price', price: 25 },
        topLineColor: 'rgba( 38, 166, 154, 1)',
        topFillColor1: 'rgba( 38, 166, 154, 0.28)',
        topFillColor2: 'rgba( 38, 166, 154, 0.05)',
        bottomLineColor: 'rgba( 239, 83, 80, 1)',
        bottomFillColor1: 'rgba( 239, 83, 80, 0.05)',
        bottomFillColor2: 'rgba( 239, 83, 80, 0.28)',
    })

    chart.timeScale().fitContent()

    return {
        series,
        chart,
    }
}

export const updateBaselineChartData = (
    series: ISeriesApi<'Baseline'>,
    data: DefBaselineData[],
) => {
    const _data = data.map((element) => {
        return {
            time: element.time.getTime() / 1000,
            value: element.value
        }
    })
    series.setData(_data as BaselineData[])
}


export type DefCandlestickData = {
  time: Date;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
};

export type DefBaselineData = {
    time: Date;
    value: number
  };
  


interface DataWithTime {
  time: Date;
}

export const filterChartData = <T extends DataWithTime>(
    rawData: T[],
    chartInterval: ChartInterval,
): T[] => {
    // filter
    const timeInterval = new Date()
    switch (chartInterval) {
    case ChartInterval._24H:
        timeInterval.setDate(timeInterval.getDate() - 1)
        break
    case ChartInterval._1W:
        timeInterval.setDate(timeInterval.getDate() - 7)
        break
    case ChartInterval._1M:
        timeInterval.setMonth(timeInterval.getMonth() - 1)
        break
    case ChartInterval._1Y:
        timeInterval.setFullYear(timeInterval.getFullYear() - 1)
        break
    }
    return rawData.filter((element) => element.time >= timeInterval)
}

export const generateCandlestickChartPriceData = (
    rawData: PriceTick[],
    chartInterval: ChartInterval,
): DefCandlestickData[] => {
    const _result: DefCandlestickData[] = []

    // filter
    const _rawData = filterChartData(rawData, chartInterval)

    if (_rawData.length == 0) return []

    // process add group
    let _current = _rawData[0].time
    while (_current <= new Date()) {
        const _next: Date = new Date(_current.valueOf())
        _next.setMinutes(_next.getMinutes() + 1)

        const _partGroup: PriceTick[] = []

        _rawData.forEach((_raw) => {
            if (_raw.time >= _current && _raw.time < _next) {
                _partGroup.push(_raw)
            }
        })

        let _tick: DefCandlestickData
        if (_partGroup.length == 0) {
            _tick = {
                time: _current,
            }
        } else {
            _tick = {
                time: _current,
                open: _partGroup[0]?.previousToken0Price,
                close: _partGroup.at(-1)?.token0Price,
                high: _partGroup.reduce((prev, current) =>
                    prev.token0Price > current.token0Price ? prev : current,
                )?.token0Price,
                low: _partGroup.reduce((prev, current) =>
                    prev.token0Price < current.token0Price ? prev : current,
                )?.previousToken0Price,
            }
        }

        _result.push(_tick)
        _current = _next
    }

    console.log(_result)
    return _result
}

export const parseMonth = (monthNumber: number) => {
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ]

    if (monthNumber > 0 && monthNumber < 13) {
        return months[monthNumber]
    } else {
        return 'Invalid month number'
    }
}

export enum ChartInterval {
  _24H,
  _1W,
  _1M,
  _1Y,
}

export type ChartTick = {
  token0Locked: number;
  token1Locked: number;
  token0Price: number;
  timestamp: Date;
};

export type PriceTick = {
  previousToken0Price: number;
  token0Price: number;
  time: Date;
};
