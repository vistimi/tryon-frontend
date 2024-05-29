'use client'

import { useEffect, useState } from "react"
import { Progress } from "@nextui-org/react";
import { CheckCircleIcon } from "@/components/icons/checkCircle";
import { CrossCircleIcon } from "@/components/icons/crossCircle";

export default function Status () {
    const [status, setStatus] = useState<{
        generative?: boolean
        openpose?: boolean
        humanParser?: boolean
        clothMask?: boolean
    }>({})

    const ping = async () => {
        const promiseGenerative = await fetch('/api/generative', { method: 'GET' });
        const promiseOpenpose = await fetch('/api/openpose', { method: 'GET' });
        const promiseParserHuman = await fetch('/api/parserHuman', { method: 'GET' });
        const promiseParserCloth = await fetch('/api/parserCloth', { method: 'GET' });

        await Promise
            .all([promiseGenerative, promiseOpenpose, promiseParserHuman, promiseParserCloth])
            .then(async ([responseGenerative, responseOpenpose, responseParserHuman, responseParserCloth]) => {
                const status = {
                    generative: responseGenerative.ok,
                    openpose: responseOpenpose.ok,
                    humanParser: responseParserHuman.ok,
                    clothMask: responseParserCloth.ok,
                }
                setStatus(status)
            });
    }
    
    useEffect(() => {
        (
            async () => {
                await ping()
            }
        )()
    }, [])

    return (
        <div>
            <h1>Status</h1>
            <div>
                <h2>Generative</h2>
                {
                    status.generative !== undefined ? (
                        status.generative ? (
                            <CheckCircleIcon style={{ color: 'green'}} size={42}/>
                        ) : (
                            <CrossCircleIcon style={{ color: 'red'}} size={42}/>
                        )
                    ) : (
                        <Progress
                            size="sm"
                            isIndeterminate
                            aria-label="Loading..."
                            className=" w-10"
                        />
                    )
                }
            </div>
            <div>
                <h2>Openpose</h2>
                {
                    status.openpose !== undefined ? (
                        status.openpose ? (
                            <CheckCircleIcon style={{ color: 'green'}} size={42}/>
                        ) : (
                            <CrossCircleIcon style={{ color: 'red'}} size={42}/>
                        )
                    ) : (
                        <Progress
                            size="sm"
                            isIndeterminate
                            aria-label="Loading..."
                            className=" w-10"
                        />
                    )
                }
            </div>
            <div>
                <h2>Human Parser</h2>
                {
                    status.humanParser !== undefined ? (
                        status.humanParser ? (
                            <CheckCircleIcon style={{ color: 'green'}} size={42}/>
                        ) : (
                            <CrossCircleIcon style={{ color: 'red'}} size={42}/>
                        )
                    ) : (
                        <Progress
                            size="sm"
                            isIndeterminate
                            aria-label="Loading..."
                            className=" w-10"
                        />
                    )
                }
            </div>
            <div>
                <h2>Cloth Parser</h2>
                {
                    status.clothMask !== undefined ? (
                        status.clothMask ? (
                            <CheckCircleIcon style={{ color: 'green'}} size={42}/>
                        ) : (
                            <CrossCircleIcon style={{ color: 'red'}} size={42}/>
                        )
                    ) : (
                        <Progress
                            size="sm"
                            isIndeterminate
                            aria-label="Loading..."
                            className=" w-10"
                        />
                    )
                }
            </div>
        </div>
    );
}
