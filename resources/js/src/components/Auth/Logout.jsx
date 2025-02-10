import React from 'react';
import {Navigate} from 'react-router-dom';
import {useAuth} from "../../context/AuthContext.jsx";

const Logout = () => {
    const {logout} = useAuth();

    React.useEffect(() => {
        logout();
    }, [logout]);

    return <Navigate to="/login"/>;
};

export default Logout;
