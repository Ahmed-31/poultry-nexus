"use client"

import React, {useState, useRef, useEffect} from "react"
import {
    Popover,
    PopoverTrigger,
    PopoverContent
} from "@/components/ui/popover"
import {
    Command,
    CommandInput,
    CommandEmpty,
    CommandGroup,
    CommandItem
} from "@/components/ui/command"
import {Button} from "@/components/ui/button"
import {Check, ChevronsUpDown} from "lucide-react"
import {cn} from "@/lib/utils"
import {useTranslation} from "react-i18next";

export function SmartSelect({
                                options,
                                selected,
                                onChange,
                                placeholder = t('smartSelect.placeholder'),
                                label,
                                multiple = true
                            }) {
    const [open, setOpen] = useState(false);
    const listRef = useRef(null);
    const scrollTopRef = useRef(0);
    const {t} = useTranslation();

    const toggleOption = (value) => {
        if (multiple) {
            scrollTopRef.current = listRef.current?.scrollTop || 0
            if (selected.includes(value)) {
                onChange(selected.filter((v) => v !== value))
            } else {
                onChange([...selected, value])
            }
        } else {
            onChange(value)
            setOpen(false)
        }
    }

    const isSelected = (value) =>
        multiple ? selected.includes(value) : selected === value

    const selectedLabels = multiple
        ? options
            .filter((opt) => selected.includes(opt.value))
            .map((opt) => opt.label)
            .join(", ")
        : options.find((opt) => opt.value === selected)?.label

    // Restore scroll position after re-render
    useEffect(() => {
        if (listRef.current && scrollTopRef.current) {
            listRef.current.scrollTop = scrollTopRef.current
        }
    }, [selected])

    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium mb-1">{label}</label>}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                    >
                        {selectedLabels || placeholder}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0 max-h-[300px] overflow-y-auto">
                    <Command>
                        <CommandInput placeholder={t('smartSelect.searchPlaceholder')}/>
                        <CommandEmpty>{t('smartSelect.noResults')}</CommandEmpty>
                        <CommandGroup>
                            <div ref={listRef} className="max-h-[240px] overflow-y-auto">
                                {options.map((option) => (
                                    <CommandItem
                                        key={option.value}
                                        onSelect={() => toggleOption(option.value)}
                                        className="cursor-pointer"
                                    >
                                        <div className="flex items-center">
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    isSelected(option.value) ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {option.label}
                                        </div>
                                    </CommandItem>
                                ))}
                            </div>
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}
