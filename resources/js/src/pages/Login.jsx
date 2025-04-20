import React, {useState} from 'react';
import {useAuth} from '../context/AuthContext';
import {useNavigate} from 'react-router-dom';
import Loader from "../components/common/Loader.jsx";
import {useTranslation} from "react-i18next";

const Login = () => {
    const {t} = useTranslation();
    const {login} = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            await login(email, password);
            navigate('/');
        } catch {
            setError(t('login.errors.invalid'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-10 bg-white p-6 rounded shadow-md relative">
            {isSubmitting && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                    <Loader/>
                </div>
            )}
            <h2 className="text-2xl font-bold mb-4">{t('login.title')}</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className={isSubmitting ? 'opacity-50' : ''}>
                <input
                    type="email"
                    placeholder={t('login.fields.email')}
                    className="w-full p-2 mb-4 border rounded"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                />
                <input
                    type="password"
                    placeholder={t('login.fields.password')}
                    className="w-full p-2 mb-4 border rounded"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded"
                    disabled={isSubmitting}
                >
                    {t('login.actions.submit')}
                </button>
            </form>
        </div>
    );
};

export default Login;
