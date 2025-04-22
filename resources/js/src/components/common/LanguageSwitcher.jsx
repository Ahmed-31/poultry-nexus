import React, {useState} from 'react';
import {Globe, Check} from 'lucide-react';
import {useTranslation} from 'react-i18next';
import {Button} from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {useToast} from "@/hooks/use-toast.js";
import {useDispatch} from 'react-redux';
import {setLanguage} from '@/src/store/languageSlice';

const LanguageSwitcher = () => {
    const dispatch = useDispatch();
    const {i18n, t} = useTranslation();
    const [animate, setAnimate] = useState(false);
    const languages = [
        {code: 'en', label: 'English', flag: '🇺🇸'},
        {code: 'ar', label: 'العربية', flag: '🇪🇬'},
    ];
    const {toast} = useToast();

    const changeLang = (lng) => {
        i18n.changeLanguage(lng).then(() => {
            localStorage.setItem('lang', lng);
            document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';

            dispatch(setLanguage(lng));

            toast({
                title: '✅ ' + t('languageChangedTitle'),
                description: t('languageChanged'),
            });
        });
    };

    const handleClick = () => {
        setAnimate(true);
        setTimeout(() => setAnimate(false), 400); // match animation duration
    };

    return (
        <TooltipProvider>
            <DropdownMenu>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className={`p-2 ${animate ? 'animate-spin-once' : 'hover:animate-pulse-scale'}`}
                                onClick={handleClick}
                            >
                                <Globe size={20}/>
                            </Button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent className="animate-fade-in">
                        Change Language
                    </TooltipContent>
                </Tooltip>

                <DropdownMenuContent align="end" className="animate-slide-down-fade">
                    {languages.map(lang => (
                        <DropdownMenuItem
                            key={lang.code}
                            onClick={() => changeLang(lang.code)}
                            className="flex items-center justify-between"
                        >
                            <span className="flex items-center gap-2">
                                <span className="text-lg">{lang.flag}</span>
                                {lang.label}
                            </span>
                            {i18n.language === lang.code && (
                                <Check size={16} className="text-green-500"/>
                            )}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </TooltipProvider>
    );
};

export default LanguageSwitcher;
