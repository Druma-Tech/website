// import React from 'react'
import WordPullUp from './ui/word-pull-up'
// import { VelocityScroll } from './ui/scroll-based-velocity';
// import BlurFade from "./ui/blur-fade";
import BoxReveal from './ui/box-reveal';
import IconCloud from './ui/icon-cloud';

function Hero() {
    // const images = Array.from({ length: 21 }, (_, i) => {
    //     const isLandscape = i % 2 === 0;
    //     const width = isLandscape ? 400 : 300;
    //     const height = isLandscape ? 400 : 300;
    //     return `https://picsum.photos/seed/${i + 1}/${width}/${height}`;
    // });
    const slugs = [
        "typescript",
        "javascript",
        "dart",
        "java",
        "react",
        "flutter",
        "android",
        "html5",
        "css3",
        "nodedotjs",
        "express",
        "nextdotjs",
        "prisma",
        "amazonaws",
        "postgresql",
        "firebase",
        "nginx",
        "vercel",
        "testinglibrary",
        "jest",
        "cypress",
        "docker",
        "git",
        "jira",
        "github",
        "gitlab",
        "visualstudiocode",
        "androidstudio",
        "sonarqube",
        "figma",
    ];

    const handleSignUp = () => {
        window.location.href = "/signup";
    }
    return (<>
        <section className="hero" style={{ backgroundColor: "#26262f" }}>


            <nav className="border-gray-200 dark:bg-gray-900">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src="Druma Large.png" className="h-10" alt="Flowbite Logo" />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">Druma</span>
                    </a>
                    <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                        <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={handleSignUp}>Sign Up</button>
                        <button data-collapse-toggle="navbar-cta" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-cta" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                            </svg>
                        </button>
                    </div>
                    <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-cta">
                        <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
                            <li>
                                <a href="/" className="block py-2 px-3 md:p-0 text-white rounded  md:dark:text-blue-500" aria-current="page">Home</a>
                            </li>
                            <li>
                                <a href="/" className="block py-2 px-3 md:p-0 text-white rounded  md:dark:text-blue-500" aria-current="page">About</a>
                            </li>
                            <li>
                                <a href="/" className="block py-2 px-3 md:p-0 text-white rounded  md:dark:text-blue-500" aria-current="page">Services</a>
                            </li>
                            <li>
                                <a href="/" className="block py-2 px-3 md:p-0 text-white rounded  md:dark:text-blue-500" aria-current="page">Contact</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="grid max-w-screen-xl px-4 pt-8 mx-auto lg:gap-8 xl:gap-0 lg:pt-16 lg:grid-cols-12">
                <div className="hidden lg:mt-0 lg:col-span-4 lg:flex px-4">
                    <img src="hero.jpg" alt="mockup" />
                </div>
                <div className="ml-auto place-self-center lg:col-span-8">
                    <WordPullUp
                        className="text-3xl font-bold tracking-[0.02em] text-white dark:text-white md:text-6xl md:leading-[5rem]"
                        words="Welcome to DRUMA-AI"
                    />
                    <p className="max-w-2xl mb-6 text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">Unlock the power of AI-driven object detection with our cutting-edge technology. Experience the next generation of computer vision solutions</p>
                    <a href="/" className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-gray-400 rounded-lg bg-white focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
                        Get started
                        <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                    </a>
                    <a href="/" className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white border border-gray-300 rounded-lg focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                        Learn More
                    </a>
                </div>

            </div>
        </section>
        {/* <section id="photos" className='grid lg:grid-cols-12 mx-5'>
            <div className="lg:col-span-12 columns-2 gap-4 sm:columns-7 py-5">
                {images.map((imageUrl, idx) => (
                    <BlurFade key={imageUrl} delay={0.25 + idx * 0.05} inView>
                        <img
                            className="mb-4 size-full rounded-lg object-contain"
                            src={imageUrl}
                            alt={`Random stock image ${idx + 1}`}
                        />
                    </BlurFade>
                ))}
            </div>
        </section> */}
        {/* <VelocityScroll
            images={images}
            default_velocity={5}
            className="font-display text-center text-4xl font-bold tracking-[-0.02em] text-black drop-shadow-sm dark:text-white md:text-7xl md:leading-[5rem]"
        /> */}
        <section className="features h-full" style={{ backgroundColor: "#f7f8fa" }}>
            <div className='flex flex-col py-10 ml-20 pl-5'>
                <h2 className='text-4xl font-bold' style={{ color: "#3F3C3F" }}>Transforming the Future</h2>
                <p className='max-w-2xl mt-2 text-gray-500 dark:text-gray-400 text-xl'>Crafting the AI-Powered Vision</p>
            </div>
            <div className="grid p-5 mx-20 gap-4 lg:grid-cols-12">
                <div className="lg:col-span-7">
                    <img
                        src="robot1.jpg"
                        alt=""
                        className="object-cover h-full w-full rounded-lg"
                    />
                </div>

                <div className="lg:col-span-5 flex flex-col space-y-4">
                    <img
                        src="robot2.jpg"
                        alt=""
                        className="w-full h-1/2 object-cover rounded-lg"
                    />
                    <img
                        src="robot3.jpg"
                        alt=""
                        className="w-full h-1/2 object-cover rounded-lg"
                    />
                </div>
            </div>
        </section>

        <div className="relative w-full">
            <img
                src="main.jpg"
                alt="Main background"
                className="w-full h-full object-cover rounded-lg"
            />

            {/* Text overlay */}
            <div className="absolute inset-0 flex items-center justify-end bg-black bg-opacity-40 px-[25%]">
                <div className="text-left text-white w-[500px]">
                    <BoxReveal boxColor={"#5046e6"} duration={0.5}>
                        <h1 className="text-4xl font-bold mb-2">Reshaping the AI Landscape</h1>
                    </BoxReveal>
                    <BoxReveal boxColor={"#5046e6"} duration={0.5}>
                        <p className="text-lg pb-5">
                            Immerse yourself in the future of AI-powered vision. Our advanced algorithms and deep learning models deliver unparalleled accuracy, speed, and versatility.
                        </p>
                    </BoxReveal>
                    <div className="flex space-x-4">
                        <BoxReveal boxColor={"#5046e6"} duration={0.5}>
                            <a href="/" className="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-gray-400 rounded-lg bg-white focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900">
                                Get started
                                <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            </a>
                        </BoxReveal>
                        <BoxReveal boxColor={"#5046e6"} duration={0.5}>
                            <a href="/" className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white border border-gray-300 rounded-lg focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                                Learn More
                            </a>
                        </BoxReveal>
                    </div>
                </div>
            </div>

        </div>

        <section className='our-approach'>
            <div className="flex items-center py-10 mx-20">
                <div className="flex flex-col pl-6">
                    <h2 className="text-4xl font-bold" style={{ color: "#3F3C3F" }}>Our Approach</h2>
                    <p className="max-w-2xl mt-2 text-gray-500 dark:text-gray-400 text-xl">Leveraging the power of AI</p>
                </div>

                <button className="ml-auto mr-8 px-6 py-3 white text-blue-300 font-semibold rounded-lg hover:bg-blue-200 border border-blue-300">
                    Discover
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-20 p-6 justify-items-center">
                {[1, 2, 3, 4].map((card) => (
                    <div key={card} className="flex w-full max-w-[670px] h-[259px] bg-white shadow-md rounded-lg overflow-hidden border border-gray-800">
                        {/* Image Section */}
                        <div className="flex-shrink-0 w-1/3 flex items-center justify-center p-4">
                            <img
                                src={`hero.jpg`}
                                alt={`Card ${card}`}
                                className="w-36 h-36 rounded-full object-cover"
                            />
                        </div>

                        {/* Text Section */}
                        <div className="flex flex-col justify-center pl-4 pr-4 w-2/3">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">Card Title {card}</h3>
                            <p className="text-gray-600 text-sm">
                                This is a brief description of the content on this card. It gives a little insight into what’s covered.
                            </p>
                        </div>
                    </div>
                ))}
            </div>


        </section>

        <section className='our-mission bg-gray-100'>
            <div className="flex items-center py-10 mx-20">
                <div className="flex flex-col pl-6 my-10">
                    <h1 className="text-5xl font-bold" style={{ color: "#3F3C3F" }}>Our Mission</h1>
                    <p className="max-w-5xl mt-2 text-gray-500 dark:text-gray-400 text-2xl">At the heart of our mission lies a deep-rooted commitment to advancing the frontiers of AI-driven computer vision. We are driven by a vision to revolutionize the way businesses and industries harness the power of artificial intelligence.</p>
                </div>

                <div className="relative flex size-full max-w-lg items-center justify-center overflow-hidden rounded-lg bg-background px-20 pb-20 pt-8">
                    <IconCloud iconSlugs={slugs} />
                </div>
            </div>
        </section>

        <section className='flex transforming-future'>
            <div className="flex-shrink-0 w-1/3 flex items-center justify-center p-4">
                <img
                    src={`transform.jpg`}
                    alt={`Card`}
                    className="w-72 h-72 rounded-full object-cover"
                />
            </div>
            <div className="flex items-center py-10 mx-5">
                <div className="flex flex-col pl-6 my-10">
                    <h1 className="text-3xl font-bold" style={{ color: "#3F3C3F" }}>Pioneering the AI </h1>
                    <p className="max-w-3xl mt-2 text-gray-500 dark:text-gray-400 text-xl">Discover how our cutting-edge AI-powered solutions are transforming industries, from object detection and image recognition to predictive analytics and autonomous systems.
                    </p>
                    <button className=" py-3 my-3 w-36 bg-blue-300 text-black font-semibold rounded-lg hover:bg-blue-400">
                        Get started
                    </button>
                </div>
            </div>
            <div className="flex items-center py-10 mx-10">
                <div className="flex flex-col pl-6 my-10">
                    <h1 className="text-3xl font-bold" style={{ color: "#3F3C3F" }}>Reimagining the future</h1>
                    <p className="max-w-4xl mt-2 text-gray-500 dark:text-gray-400 text-xl">At the heart of our mission lies a deep-rooted commitment to advancing the frontiers of AI-driven computer vision. We are driven by a vision to revolutionize the way businesses and industries harness the power of artificial intelligence.</p>
                    <button className=" py-3 my-3 w-36 text-black font-semibold rounded-lg" style={{ backgroundColor: "orange" }}>
                        Explore now
                    </button>
                </div>
            </div>
        </section>

        <section className='footer h-96' style={{ backgroundColor: "#26262f" }}>
            <div className="flex flex-col items-center mx-32 pt-36">
                <img src="Druma Large.png" className="h-32" alt="Druma Logo" />
                <h4 className="text-gray-200 mt-4">
                    © 2024 Druma AI All rights reserved
                </h4>
            </div>
        </section>

    </>
    )
}

export default Hero