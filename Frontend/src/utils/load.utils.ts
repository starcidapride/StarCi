import fs from 'fs'

export const loadPrivateKey = () => {
    try {
        const privateKeyData = fs.readFileSync('private.key', 'utf8')
        return privateKeyData
    } catch (error) {
        console.error('Error loading private key:', error)
        return null 
    }
}