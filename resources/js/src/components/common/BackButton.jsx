import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Button} from '@/Components/ui/button';
import {ArrowLeft} from 'lucide-react';
import {useTranslation} from 'react-i18next';

const BackButton = () => {
    const navigate = useNavigate();
    const {t} = useTranslation();

    return (
        <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="mb-4 flex items-center gap-2"
        >
            <ArrowLeft className="w-4 h-4"/>
            <span>{t('global.back')}</span>
        </Button>
    );
};

export default BackButton;
