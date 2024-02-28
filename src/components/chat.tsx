'use client'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIcicles, faCloud, faCloudRain, faCloudBolt, faSnowflake, faSun, faWind } from '@fortawesome/free-solid-svg-icons'
import { useState } from "react";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type Category = "ice" | "cloud" | "rain" | "lightning" | "snow" | "sun" | "wind"
const icons: {
    [K in Category]: IconDefinition;
} = {
    ice: faIcicles,
    cloud: faCloud,
    rain: faCloudRain,
    lightning: faCloudBolt,
    snow: faSnowflake,
    sun: faSun,
    wind: faWind,
}
  
export default function Chat() {
    const [name, setName] = useState('')
    const [message, setMessage] = useState('')
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setMessage("")

        const response = await fetch('api/chat', {
            method: 'POST',
            body: JSON.stringify({name})
        })
        
        const reader = response.body!.getReader()
        const decoder = new TextDecoder("utf-8")
    
        while (true) {
            const chunk = await reader?.read()
            const {done, value} = chunk
            
            const decodedChunk = decoder.decode(value)
            
            const lines = decodedChunk.split("\n")
            const parsedLines = lines.map((line) => 
                line.replace(/^data: /, "").trim()
            ).filter(line => line !== "" && line !== "[DONE]")
            .map(line => JSON.parse(line))

            for (const parsedLine of parsedLines) {
                const content = parsedLine.choices[0].delta.content
                if (content) {
                    setMessage(message => message + content)
                }
            }
            
            if (done) {
                break;
            }
        }
    }

    const [category, title, description] = message.split('\n')
    const formattedCategory: Category = category?.split(':')[1]?.trim() as Category
    const formattedTitle: string = title?.split(':')[1]?.trim()
    const formattedDescription = description?.split(':')[1]?.trim()
    const icon = formattedCategory && icons[formattedCategory?.toLowerCase() as Category]

    return (
        <div className='w-full max-w-lg text-center'>
            <h1 className='text-4xl font-bold md:text-5xl'>Weather Phenomenon Generator</h1>
        
            <form onSubmit={handleFormSubmit}>
                <label>
                    <input value={name} onChange={handleInputChange} className="mb-4 mt-6 w-full rounded-xl border-0 text-center shadow-none ring-1 ring-zinc-300 placeholder:text-zinc-400 focus:ring-zinc-800 focus:outline-none"/>
                </label>
                <button type="submit" className="rounded-xl bg-zinc-600 px-4 py-2 font-semibold text-white transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100">Generate</button>
            </form>
            {message ? <div className="mt-4 rounded-xl bg-gradient-to-b from-zinc-100 to-zinc-200 p-4 md:p-8">
                {formattedCategory ? <div className="mb-4"><FontAwesomeIcon icon={icon} size="6x" /></div> : null}
                <p className="text-2xl font-bold md:text-3xl">{ formattedTitle }</p>
                <p className="mt-4 text-zinc-500">{ formattedDescription }</p>
            </div> : null}
        </div>
    );
}