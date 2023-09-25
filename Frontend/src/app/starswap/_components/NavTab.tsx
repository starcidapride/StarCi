'use client'
import { Accordion, AccordionItem, Listbox, ListboxItem } from '@nextui-org/react'
import {CurrencyDollarIcon} from '@heroicons/react/24/outline'

export const NavTab = () => {
    return (
        <Accordion isCompact>
            <AccordionItem key="1" aria-label="Liquidity Pool" title="Liquidity Pool">
                <Listbox variant="flat" aria-label="Listbox menu with descriptions">
                    <ListboxItem
                        key="new"
                        title="Trade"
                        description="Decentralized, efficient crypto swaps in liquidity pools, auto-priced for accessibility."
                        startContent={<CurrencyDollarIcon width={24} height={24} />}
                    />
                    <ListboxItem
                        key="copy"
                        title="Stake"
                        description="Earn rewards by locking assets securely in DeFi protocols."
                        startContent={<CurrencyDollarIcon width={24} height={24} />}
                    />
                    <ListboxItem
                        key="copy"
                        title="Farm"
                        description="Yield farming for passive income in DeFi liquidity pools."
                        startContent={<CurrencyDollarIcon width={24} height={24} />}
                    />
                </Listbox>
            </AccordionItem>
            <AccordionItem key="2" aria-label="Accordion 2" title="Accordion 2">
          aaaa
            </AccordionItem>
            <AccordionItem key="3" aria-label="Accordion 3" title="Accordion 3">
          aaaa
            </AccordionItem>
        </Accordion>
    )
}
