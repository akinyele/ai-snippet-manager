'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'

interface SearchInputProps {
    onSearch: (query: string) => void
}

export function SearchInput({ onSearch }: SearchInputProps) {
    const [value, setValue] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        setValue(newValue)
        onSearch(newValue)
    }

    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
                type="text"
                value={value}
                onChange={handleChange}
                placeholder="Search snippets by title, description, tags, or language..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
    )
}