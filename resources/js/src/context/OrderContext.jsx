// resources/js/src/context/OrderContext.jsx
import React, {createContext, useContext, useState, useEffect} from 'react';
import {
    getOrders,
    addOrder,
    updateOrder,
    deleteOrder
} from '../services/orderService';
import {getProducts, getProductBundles} from '../services/inventoryService';
import {getCustomers} from '../services/customersService';

// Create Order Context
const OrderContext = createContext();

// Custom Hook to use Order Context
export const useOrders = () => useContext(OrderContext);

// Provider Component
export const OrderProvider = ({children}) => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [productBundles, setProductBundles] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrders();
        fetchProducts();
        fetchCustomers();
        fetchProductBundles();
    }, []);

    // Fetch Orders from API
    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getOrders();
            setOrders(data);
        } catch (err) {
            setError('Failed to load orders.');
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (err) {
            setError('Failed to load products.');
        }
    };

    const fetchProductBundles = async () => {
        try {
            const data = await getProductBundles();
            setProductBundles(data);
        } catch (err) {
            setError('Failed to load product bundles.');
        }
    };

    const fetchCustomers = async () => {
        try {
            const data = await getCustomers();
            setCustomers(data);
        } catch (err) {
            setError('Failed to load customers.');
        }
    }

    // Add New Order
    const addOrderItem = async (newOrder) => {
        setLoading(true);
        try {
            await addOrder(newOrder);
            await fetchOrders();  // Refresh after adding
        } catch (err) {
            setError('Failed to add order');
        } finally {
            setLoading(false);
        }
    };

    // Update Existing Order
    const updateOrderItem = async (id, updatedOrder) => {
        setLoading(true);
        try {
            await updateOrder(id, updatedOrder);
            await fetchOrders();  // Refresh after updating
        } catch (err) {
            setError('Failed to update order');
        } finally {
            setLoading(false);
        }
    };

    // Delete Order
    const deleteOrderItem = async (id) => {
        setLoading(true);
        try {
            await deleteOrder(id);
            setOrders(prevOrders => prevOrders.filter(order => order.id !== id));
        } catch (err) {
            setError('Failed to delete order');
        } finally {
            setLoading(false);
        }
    };

    const value = {
        orders,
        loading,
        products,
        productBundles,
        customers,
        error,
        addOrderItem,
        updateOrderItem,
        deleteOrderItem,
    };

    return (
        <OrderContext.Provider value={value}>
            {children}
        </OrderContext.Provider>
    );
};
