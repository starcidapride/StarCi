import axios from 'axios'
import fs from 'fs'
import path from 'path'

const API_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest'
const API_KEY = '9ff22340-3550-43fb-b9d6-f1691cd5f488'
const TOKEN_PRICES_FILE_PATH = path.resolve('./src/api/coinmarketcap/token-prices.json')

export const createFileIfNotExists = (filePath : string ) => {
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            fs.writeFile(filePath, '', (err) => {
                if (err) {
                    console.error('Error creating file:', err)
                } else {
                    console.log('File created successfully.')
                }
            })
        } else {
            console.log('File already exists.')
        }
    })
}

export const writeTokenPrices = async () : Promise<TokenData[]|null> => {
    try {
        createFileIfNotExists(TOKEN_PRICES_FILE_PATH)
        
        const response = await axios.get(API_URL, {
            params: {
                CMC_PRO_API_KEY: API_KEY
            }
        })

        const tokenPrices = response.data
        fs.writeFileSync(TOKEN_PRICES_FILE_PATH, JSON.stringify(tokenPrices, null, 2))
        console.log('Token prices written to file successfully.')

        return tokenPrices
    } catch (error) {
        console.error('Error writing token prices:', error)

        return null
    }
}

export const readTokenPrices = () : TokenData[]|null => {
    try {
        console.log(TOKEN_PRICES_FILE_PATH)
        const data = fs.readFileSync(TOKEN_PRICES_FILE_PATH, 'utf8')
        const tokenPrices = JSON.parse(data)
        return tokenPrices
    } catch (error) {
        // console.error('Error reading token prices:', error)
        return null
    }
}

export type TokenData = {
    id: number
    name: string
    symbol: string
    slug: string
    num_market_pairs: number
    date_added: string
    tags: string[]
    max_supply: number
    circulating_supply: number
    total_supply: number
    platform: {
        id: number
        name: string
        symbol: string
        slug: string
        token_address: string
    };
    infinite_supply: boolean
    cmc_rank: number
    self_reported_circulating_supply: null | number
    self_reported_market_cap: null | number
    tvl_ratio: null | number
    last_updated: string
    quote: {
        USD: {
            price: number
            volume_24h: number
            volume_change_24h: number
            percent_change_1h: number
            percent_change_24h: number
            percent_change_7d: number
            percent_change_30d: number
            percent_change_60d: number
            percent_change_90d: number
            market_cap: number
            market_cap_dominance: number
            fully_diluted_market_cap: number
            tvl: null | number
            last_updated: string
        }
    }
}