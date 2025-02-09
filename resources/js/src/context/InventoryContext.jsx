// resources/js/src/context/InventoryContext.jsx
import React, {createContext, useContext, useState, useEffect} from 'react';
import {
    getInventory,
    addInventory,
    deleteInventory,
    updateInventory,
    getProducts,
    getWarehouses
} from '../services/inventoryService';

const InventoryContext = createContext();

export const useInventory = () => useContext(InventoryContext);

export const InventoryProvider = ({children}) => {
    const [inventory, setInventory] = useState([]);
    const [products, setProducts] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchInventory();
        fetchProducts();
        fetchWarehouses();
    }, []);

    const fetchInventory = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getInventory();
            setInventory(data);
        } catch (err) {
            setError('Failed to load inventory data');
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (err) {
            setError('Failed to load products');
        }
    };

    const fetchWarehouses = async () => {
        try {
            const data = await getWarehouses();
            setWarehouses(data);
        } catch (err) {
            setError('Failed to load warehouses');
        }
    };

    const addInventoryItem = async (newItem) => {
        setLoading(true);
        try {
            await addInventory(newItem);
            await fetchInventory();
        } catch (err) {
            setError('Failed to add inventory item');
        } finally {
            setLoading(false);
        }
    };

    const deleteInventoryItem = async (id) => {
        setLoading(true);
        try {
            await deleteInventory(id);
            setInventory(prevInventory => prevInventory.filter(item => item.id !== id));
        } catch (err) {
            setError('Failed to delete inventory item');
        } finally {
            setLoading(false);
        }
    };

    const updateInventoryItem = async (id, updatedItem) => {
        setLoading(true);
        try {
            await updateInventory(id, updatedItem);
            await fetchInventory();
        } catch (err) {
            setError('Failed to update inventory item');
        } finally {
            setLoading(false);
        }
    };

    const value = {
        inventory,
        products,
        warehouses,
        loading,
        error,
        fetchInventory,
        addInventoryItem,
        deleteInventoryItem,
        updateInventoryItem
    };

    return (
        <InventoryContext.Provider value={value}>
            {children}
        </InventoryContext.Provider>
    );
};
