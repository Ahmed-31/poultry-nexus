import React from 'react';
import {motion} from 'framer-motion';
import salesImage from '../../../images/Sales & Order Processing.webp';
import procurementImage from '../../../images/Procurement & Inventory Control.webp';
import packagingImage from '../../../images/Packaging & Dispatch Management.webp';
import productionImage from '../../../images/a factory that manufactures poultry equipment.webp';
import deliveryImage from '../../../images/Delivery & Internal Support.webp';
import {useAuth} from '@/src/context/AuthContext';
import Loader from '@/src/components/common/Loader';
import {useTranslation} from "react-i18next";

const HomePage = () => {
    const {user, loading} = useAuth();
    const {t} = useTranslation();

    if (loading) {
        return (<Loader/>);
    }

    if (!user) {
        return <p className="text-center mt-10 text-xl">{t('auth.notLoggedIn')}</p>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-100 to-pink-200 p-10">
            <header className="text-center mb-16">
                <motion.h1
                    className="text-6xl font-extrabold text-gray-900 drop-shadow-lg"
                    initial={{opacity: 0, y: -50}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.7}}
                >
                    {t('home.title')}
                </motion.h1>
                <motion.p
                    className="text-xl text-gray-700 mt-6"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{delay: 0.4, duration: 0.7}}
                >
                    {t('home.subtitle')}
                </motion.p>
            </header>

            <div className="space-y-16">
                <ZigZagSection
                    title={t('home.sections.sales.title')}
                    steps={t('home.sections.sales.steps', {returnObjects: true})}
                    reverse={false}
                    image={salesImage}
                    imageAlt='A simple, realistic high-definition photo of a small office focused on Sales & Order Processing in the poultry equipment industry.'
                />

                <ZigZagSection
                    title={t('home.sections.procurement.title')}
                    steps={t('home.sections.procurement.steps', {returnObjects: true})}
                    reverse={true}
                    image={procurementImage}
                    imageAlt='A simple, realistic high-definition photo of an office environment focused on Procurement & Inventory Control in the poultry equipment industry.'
                />

                <ZigZagSection
                    title={t('home.sections.production.title')}
                    steps={t('home.sections.production.steps', {returnObjects: true})}
                    reverse={false}
                    image={productionImage}
                    imageAlt='A simple, realistic high-definition photo of a factory that manufactures poultry equipment. The photo shows a production manager wearing a hard hat.'
                />

                <ZigZagSection
                    title={t('home.sections.packaging.title')}
                    steps={t('home.sections.packaging.steps', {returnObjects: true})}
                    reverse={true}
                    image={packagingImage}
                    imageAlt='A simple, realistic high-definition photo of a factory focused on Packaging & Dispatch Management for poultry equipment.'
                />

                <ZigZagSection
                    title={t('home.sections.delivery.title')}
                    steps={t('home.sections.delivery.steps', {returnObjects: true})}
                    reverse={false}
                    image={deliveryImage}
                    imageAlt='A simple, realistic high-definition photo of a factory focused on Delivery & Internal Support for poultry equipment.'
                />
            </div>
        </div>
    );
};

const ZigZagSection = ({title, steps, reverse, image, imageAlt}) => (
    <motion.div
        className={`flex flex-col lg:flex-row ${reverse ? 'lg:flex-row-reverse' : ''} items-center gap-10`}
        initial={{opacity: 0, y: 50}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.6}}
    >
        <div className="lg:w-1/2">
            <h2 className="text-4xl font-bold text-indigo-800 mb-4 border-b-4 border-indigo-300 pb-3">{title}</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-4 text-lg">
                {steps.map((step, index) => (
                    <li key={index} className="leading-relaxed">{step}</li>
                ))}
            </ul>
        </div>
        <div className="lg:w-1/2 flex justify-center items-center">
            <motion.div
                className="p-2 border border-gray-300 rounded-xl shadow-md bg-white hover:shadow-xl transition-shadow duration-300"
                whileHover={{scale: 1.05}}
            >
                <div className="relative w-full h-64 lg:h-80 rounded-xl overflow-hidden">
                    <motion.img
                        src={image}
                        alt={imageAlt}
                        className="w-full h-full object-cover"
                        whileHover={{scale: 1.03}}
                        transition={{duration: 0.3}}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-xl"></div>
                </div>
            </motion.div>
        </div>
    </motion.div>
);

export default HomePage;
