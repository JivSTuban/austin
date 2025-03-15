"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export function Parallax({ children, speed = 0.5, direction = "up", className = "", offset = ["0", "1"] }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  })

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "up" ? ["0%", `${-speed * 100}%`] : [`${-speed * 100}%`, "0%"],
  )

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="h-full w-full">
        {children}
      </motion.div>
    </div>
  )
}

export function ParallaxImage({ src, alt, className = "", speed = 0.2 }) {
  const ref = useRef(null)
  const [elementTop, setElementTop] = useState(0)
  const [clientHeight, setClientHeight] = useState(0)

  useEffect(() => {
    const element = ref.current
    const onResize = () => {
      setElementTop(element.getBoundingClientRect().top + window.scrollY || window.pageYOffset)
      setClientHeight(window.innerHeight)
    }
    onResize()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [ref])

  const { scrollY } = useScroll()

  const y = useTransform(
    scrollY,
    [elementTop - clientHeight, elementTop + clientHeight],
    [`${speed * 100}%`, `${-speed * 100}%`],
  )

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.img src={src} alt={alt} style={{ y, scale: 1.2 }} className="object-cover w-full h-full" />
    </div>
  )
}

export function FadeInWhenVisible({ children, delay = 0, className = "" }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.33 1"],
  })

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1])
  const y = useTransform(scrollYProgress, [0, 1], [50, 0])

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y }}
      initial={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
