import axios from 'axios'

export const fetchTokenPrice = async (ids: string, currencies: string): Promise<number | null> => {
    try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=${currencies}`)
        const data = response.data
        return data[ids][currencies] as number
    } catch (ex) {
        console.log(ex)
        return null
    }
}