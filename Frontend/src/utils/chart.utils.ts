export const getDateKey = (date: Date) => {
    const hour = date.getHours()
    const minute = date.getMinutes()

    const _additional = minute >= 30 ? 1 : 0
    return Math.floor(hour * 2) + _additional
}


export type ChartItemData = {
    token0: string,
    token1: string,
    timeTick: number,
    time?: Date
}

export const deriveTimeFromKey = (key: number) => {
    if (key < 0 || key > 47) return
    const hour = Math.floor(key / 2)
    const minute = key % 2 === 0 ? '00' : '30'
    return `${hour}:${minute}`
}

export const deriveKeyFromTime = (time: string): number => {
    const [hour, minute] = time.split(':')
    const parsedHour = parseInt(hour, 10)
    const parsedMinute = parseInt(minute, 10)

    if (isNaN(parsedHour) || isNaN(parsedMinute) || parsedHour < 0 || parsedHour > 24 || parsedMinute < 0 || parsedMinute > 59) {
        throw new Error('Invalid time format')
    }

    const key = parsedHour * 2 + (parsedMinute === 0 ? 0 : 1)
    return key
}


export const deriveTimeFromKeyEach3Hours = (key: number): string[] | null => {
    if (key < 0 || key > 47) return null

    const timeList: string[] = []

    for (let i = 0; i < 48; i++) {
        const valueI = key - i
        const unsignedI = valueI < 0 ? valueI + 48 : valueI
        const value = deriveTimeFromKey(unsignedI)!

        timeList.push(value)
    }
    timeList.reverse()
    return timeList
}

const enum SortOptions {
    _24h,
    _1m
}
const getFilterReadableEvents = (
    _readableEvents: ChartItemData[],
    sortOptions: SortOptions = SortOptions._24h
) => {
    let _filterEvents = _readableEvents.filter(
        _event => {
            let _sortTime: number
        
            switch (sortOptions) {
            case SortOptions._24h:
            //_sortTime = new Date().getDay()
            }

            const _timeTick = _event.timeTick

            const now = new Date()

            const _sameTimeTickEvents = _readableEvents.filter(_event =>
                _event.timeTick == _timeTick
            && _event.time?.getDay() == now.getDay()
            && _event.time?.getMonth() == now.getMonth()
            && _event.time?.getFullYear() == now.getFullYear()
            )

            console.log(_sameTimeTickEvents)

            let flag = _sameTimeTickEvents.length > 0

            for (const _e of _sameTimeTickEvents) {
                if (_event.time! < _e.time!) {
                    flag = false
                }
            }

            return flag
        }
    ).map(
        _event => {
            return {
                token0: _event.token0,
                token1: _event.token1,
                timeTick: _event.timeTick
            }
        })
    if (!_filterEvents.length) {
        _filterEvents = _readableEvents.slice(-1)
    }
    return _filterEvents
}

export const appendItemsToFull = (events: ChartItemData[]) => {
    const _readableEvent = getFilterReadableEvents(events)

    console.log(_readableEvent)

    const fullList: ChartItemData[] = []

    const firstItem = _readableEvent[0]
    const lastItem = _readableEvent.at(-1)!

    for (let i = 0; i < 48; i++) {

        const findItem = _readableEvent.find(_event => _event.timeTick == i)

        if ( firstItem.timeTick <= i && i <= lastItem.timeTick){
            
            if (findItem) {
                fullList.push(findItem)
            } else {
                const _lastItem = fullList.at(-1)
                fullList.push(
                    {
                        token0: _lastItem!.token0,
                        token1: _lastItem!.token1,
                        timeTick: i,
                    }
                )
            }
        } 
        
        if (i < firstItem.timeTick){
            fullList.push(
                {
                    token0: firstItem.token0,
                    token1: firstItem.token1,
                    timeTick: i,
                }
            )
        }

        if (i > lastItem.timeTick){
            fullList.push(
                {
                    token0: lastItem.token0,
                    token1: lastItem.token1,
                    timeTick: i,
                }
            )
        }
    }


    
    console.log(fullList)

    return fullList
}
