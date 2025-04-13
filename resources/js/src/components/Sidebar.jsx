import React, {useContext, lazy, Suspense, useMemo, useEffect} from "react";
import {NavLink, useLocation} from "react-router-dom";
import {ChevronDown, ChevronUp, Menu as DefaultIcon} from "lucide-react";
import {MenuContext} from "@/src/context/MenuContext";

const DynamicIcon = ({name, size = 20}) => {
    const IconComponent = useMemo(() => {
        try {
            return lazy(() =>
                import("lucide-react").then((module) => ({
                    default: module[name] || DefaultIcon,
                }))
            );
        } catch (error) {
            return DefaultIcon;
        }
    }, [name]);

    return (
        <Suspense fallback={<DefaultIcon size={size} className="mr-3 text-gray-400"/>}>
            <IconComponent size={size} className="mr-3"/>
        </Suspense>
    );
};

const Sidebar = ({isSidebarOpen}) => {
    const location = useLocation();
    const {menuItems, openMenus, toggleMenu, setOpenMenus} = useContext(MenuContext);

    useEffect(() => {
        const expandedMenus = {};

        const findActiveParent = (items, parentTitle = null) => {
            items.forEach((item) => {
                if (item.children.length > 0) {
                    findActiveParent(item.children, item.title.toLowerCase());
                }
                if (location.pathname.startsWith(item.url)) {
                    if (parentTitle) {
                        expandedMenus[parentTitle] = true;
                    }
                }
            });
        };

        findActiveParent(menuItems);
        setOpenMenus(expandedMenus);
    }, [location.pathname, menuItems, setOpenMenus]);

    const renderMenu = (items) =>
        items.map((item) => (
            <li key={item.id} className="w-full">
                {item.children.length > 0 ? (
                    <>
                        <button
                            className="w-full flex justify-between items-center p-3 hover:bg-gray-200 transition duration-300 rounded-md focus:outline-none"
                            onClick={() => toggleMenu(item.title.toLowerCase())}
                            aria-expanded={openMenus[item.title.toLowerCase()] || false}
                        >
              <span className="flex items-center">
                <DynamicIcon name={item.icon}/>
                <span className="whitespace-nowrap">{item.title}</span>
              </span>
                            {openMenus[item.title.toLowerCase()] ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                        </button>
                        {openMenus[item.title.toLowerCase()] && (
                            <ul className="pl-8 space-y-2">{renderMenu(item.children)}</ul>
                        )}
                    </>
                ) : (
                    <NavLink
                        to={item.url}
                        className={({isActive}) =>
                            `flex items-center p-3 transition duration-300 rounded-md whitespace-nowrap ${
                                isActive ? "bg-gray-300" : "hover:bg-gray-200"
                            }`
                        }
                    >
                        <DynamicIcon name={item.icon}/>
                        <span className="whitespace-nowrap">{item.title}</span>
                    </NavLink>
                )}
            </li>
        ));

    return (
        <aside
            className={`min-h-screen bg-white shadow-md border-r border-gray-300 transition-all duration-300 ${
                isSidebarOpen ? "inline-flex flex-col w-auto" : "hidden"
            }`}
        >
            <div className="flex-1 p-4">
                <nav>
                    <ul className="space-y-2">{renderMenu(menuItems)}</ul>
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;
