
'use client'
import { ReactLenis, useLenis } from '@studio-freight/react-lenis'
import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenis = useLenis(({ scroll }) => {
    ScrollTrigger.update();
  })

  useEffect(() => {
    if (lenis) {
      gsap.ticker.add((time)=>{
          lenis.raf(time * 1000)
      })
      gsap.ticker.lagSmoothing(0)
    }

    return () => {
       if (lenis) {
         gsap.ticker.remove((time: any) => {
            lenis.raf(time * 1000)
        })
       }
    }
  }, [lenis])

  return (
    <ReactLenis root autoRaf={false}>
      {children}
    </ReactLenis>
  )
}
