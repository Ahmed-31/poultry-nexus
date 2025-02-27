// resources/js/src/context/OrderContext.jsx
import React, {createContext, useContext, useState, useEffect} from 'react';
import {
    getOrders,
    getOrder,
    addOrder,
    updateOrder,
    deleteOrder
} from '../services/orderService';
import {getProducts} from '../services/productService.jsx';
import {getProductBundles} from '../services/productBundleService.jsx';
import {getCustomers} from '../services/customersService';

// Create Order Context
const OrderContext = createContext();

// Custom Hook to use Order Context
export const useOrders = () => useContext(OrderContext);

// Provider Component
export const OrderProvider = ({children}) => {
    const [orders, setOrders] = useState([]);
    const [currentOrder, setCurrentOrder] = useState(null);
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

    // Fetch Single Order by ID
    const fetchOrderById = async (orderId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getOrder(orderId);

            if (response && response.id) {
                setCurrentOrder(response);
            } else {
                console.error("Invalid order data received:", response);
                setCurrentOrder(null);
            }
        } catch (err) {
            console.error("Error fetching order:", err);
            setError("Failed to load order details.");
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
            await fetchOrders();
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
            await fetchOrders();
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
        currentOrder,
        loading,
        products,
        productBundles,
        customers,
        error,
        fetchOrders,
        fetchOrderById,
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
