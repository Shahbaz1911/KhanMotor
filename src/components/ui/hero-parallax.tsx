"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, Quote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const GoogleIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mr-1"
  >
    <path
      d="M19.35 10.22C19.35 9.52 19.29 8.85 19.16 8.2H10V11.9H15.35C15.15 13.19 14.53 14.28 13.59 14.96V17.38H16.4C18.23 15.74 19.35 13.19 19.35 10.22Z"
      fill="#4285F4"
    />
    <path
      d="M10 20C12.7 20 15.01 19.08 16.4 17.38L13.59 14.96C12.69 15.58 11.45 16 10 16C7.39 16 5.17 14.32 4.31 11.95H1.38V14.43C2.86 17.61 6.17 20 10 20Z"
      fill="#34A853"
    />
    <path
      d="M4.31 11.95C4.12 11.39 4 10.79 4 10C4 9.21 4.12 8.61 4.31 8.05V5.57H1.38C0.5 7.15 0 8.52 0 10C0 11.48 0.5 12.85 1.38 14.43L4.31 11.95Z"
      fill="#FBBC05"
    />
    <path
      d="M10 4C11.53 4 12.82 4.56 13.79 5.48L16.47 2.8C14.93 1.39 12.7 0.5 10 0.5C6.17 0.5 2.86 2.89 1.38 5.57L4.31 8.05C5.17 5.68 7.39 4 10 4Z"
      fill="#EA4335"
    />
  </svg>
);

const TestimonialCard = ({ product }: { product: any }) => {
  return (
    <Card className="h-full w-full flex flex-col bg-card/80 dark:bg-background/80 backdrop-blur-md shadow-lg border-border">
      <CardHeader className="flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={product.thumbnail} alt={product.name} />
          <AvatarFallback>{product.name?.substring(0, 2) ?? 'A'}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-xl font-black uppercase">{product.name}</CardTitle>
          <CardDescription className="dark:text-gray-300">{product.title}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <Quote className="h-8 w-8 text-foreground/50 mb-2 transform -scale-x-100" />
        <p className="text-muted-foreground italic mb-4 flex-grow">{product.quote}</p>
        <div className="flex items-center gap-2 mt-auto">
          <div className="flex items-center">
            <GoogleIcon />
            <span className="text-sm font-medium text-muted-foreground">oogle</span>
          </div>
          <div className="flex">
            {Array(product.rating || 5).fill(0).map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            ))}
            {Array(5 - (product.rating || 5)).fill(0).map((_, i) => (
              <Star key={i} className="h-5 w-5 text-muted-foreground/50" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


export const HeroParallax = ({
  products,
}: {
  products: {
    title: string;
    link: string;
    thumbnail: string;
    name: string;
    quote: string;
    rating: number;
  }[];
}) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  );
  return (
    <div
      ref={ref}
      className="h-[300vh] py-40 overflow-hidden  antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row  mb-20 space-x-20 ">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full  left-0 top-0">
      <h1 className="text-2xl md:text-7xl font-black dark:text-white uppercase">
        What Our Clients Say
      </h1>
      <p className="max-w-2xl text-base md:text-xl mt-8 dark:text-neutral-200 lowercase">
        we are proud to have a long list of satisfied customers. here are some of their stories and experiences with motor khan.
      </p>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
    name: string;
    quote: string;
    rating: number;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product h-96 w-[30rem] relative flex-shrink-0"
    >
      <TestimonialCard product={product} />
    </motion.div>
  );
};
    