import { Suspense, useEffect, useState } from 'react'
import { useStore } from '../store'

export function Loader({ children }) {

    return (
        <>
            <div>
                <div className="fullscreen" style={{
                    backgroundImage: "url(/graphics/loadingscreen.png)",
                    backgroundSize: 'cover'
                }}>
                    <div className="loading-title">
                        <h1>
                            POIMANDRES RACING GAME
                        </h1>
                        <h2>
                            Loading...
                        </h2>
                    </div>
                </div>
            </div>
        </>
    )
}
