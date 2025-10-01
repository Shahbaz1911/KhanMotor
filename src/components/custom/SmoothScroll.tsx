
'use client'
import { ReactLenis, useLenis } from '@studio-freight/react-lenis'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function SmoothScroll({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<any>(null)
    useEffect(() => {
        if(lenisRef.current) {
            lenisRef.current.lenis.on('scroll', ScrollTrigger.update)
            gsap.ticker.add((time: any)=>{
                lenisRef.current.lenis.raf(time * 1000)
            })
            gsap.ticker.lagSmoothing(0)
        }

        return () => {
            if(lenisRef.current) {
                // clean up listeners and ticker
                 gsap.ticker.remove((time: any) => {
                    lenisRef.current.lenis.raf(time * 1000)
                })
            }
        }
    }, [])

  return (
    <ReactLenis root ref={lenisRef} autoRaf={false}>
      {children}
    </ReactLenis>
  )
}
