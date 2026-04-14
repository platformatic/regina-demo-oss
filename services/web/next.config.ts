import type { NextConfig } from 'next'

import { PHASE_DEVELOPMENT_SERVER } from 'next/constants'


export default (phase: string) => {
    const isDev = phase === PHASE_DEVELOPMENT_SERVER
    /**
     * @type {import('next').NextConfig}
     */
    const nextConfig = {
        basePath: isDev ? undefined : '/web',
    }
    return nextConfig
}
