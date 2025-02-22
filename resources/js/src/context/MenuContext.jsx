import React, {createContext, useState, useEffect} from "react";
import {fetchMenus} from "../services/menuService";

export const MenuContext = createContext();

export const MenuProvider = ({children}) => {
    const [menuItems, setMenuItems] = useState([]);
    const [openMenus, setOpenMenus] = useState({});

    useEffect(() => {
        const loadMenus = async () => {
            const menus = await fetchMenus();
            setMenuItems(menus);
        };

        loadMenus();
    }, []);

    const toggleMenu = (menu) => {
        setOpenMenus((prev) => ({...prev, [menu]: !prev[menu]}));
    };

    return (
        <MenuContext.Provider value={{menuItems, openMenus, setOpenMenus, toggleMenu}}>
            {children}
        </MenuContext.Provider>
    );
};
