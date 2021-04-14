import React from "react";
import { Menu, MenuButton, MenuItems, MenuItem, MenuLink, MenuList, MenuPopover } from "@reach/menu-button";
import "@reach/menu-button/styles.css";

export const LabelDropdown = ({ children, className, items }) => {
    const printName = name => console.log(`You pressed ${name}`);

    console.log("Items is:", items);
    console.log("className is:", className);

    return (
        <Menu className={className}>
            <MenuButton>LabelList</MenuButton>
            <MenuPopover>
                <MenuItems>
                    {items.map(item => (
                        <MenuItem key={item.id} onSelect={() => printName(item.name)}>
                            {item.name}
                        </MenuItem>
                    ))}
                </MenuItems>
            </MenuPopover>
        </Menu>
    );
};
