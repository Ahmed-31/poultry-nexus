// resources/js/src/pages/NotFoundPage.jsx
import React from 'react';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from "react-i18next";

const NotFoundPage = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-4">
            <h1 className="text-7xl font-extrabold text-red-500 mb-6 animate-bounce">404</h1>
            <p className="text-2xl font-medium text-gray-700 mb-4">{t('notFound.message')}</p>
            <div className="flex space-x-4">
                <button
                    onClick={handleGoBack}
                    className="px-6 py-2 bg-yellow-400 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-500 transition duration-300"
                >
                    {t('notFound.goBack')}
                </button>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                >
                    {t('notFound.goHome')}
                </button>
            </div>
        </div>
    );
};

export default NotFoundPage;
