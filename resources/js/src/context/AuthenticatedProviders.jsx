import {OrderProvider} from "../context/OrderContext.jsx";
import {InventoryProvider} from "../context/InventoryContext.jsx";
import {useAuth} from "./AuthContext.jsx";
import Loader from "../components/common/Loader.jsx";

const AuthenticatedProviders = ({children}) => {
    const {user, loading} = useAuth();

    if (loading) return <Loader/>;

    return user ? (
        <OrderProvider>
            <InventoryProvider>
                {children}
            </InventoryProvider>
        </OrderProvider>
    ) : (
        children
    );
};

export default AuthenticatedProviders;
