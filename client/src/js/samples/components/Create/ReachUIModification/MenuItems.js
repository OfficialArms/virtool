import * as React from "react";
import { createDescendantContext, useDescendants, useDescendantKeyDown } from "@reach/descendants";
import { usePrevious } from "@reach/utils/use-previous";
import { createNamedContext } from "@reach/utils/context";
import { isString } from "@reach/utils/type-check";
import { makeId } from "@reach/utils/make-id";
import { useComposedRefs } from "@reach/utils/compose-refs";
import { composeEventHandlers } from "@reach/utils/compose-event-handlers";

////////////////////////////////////////////////////////////////////////////////

/**
 * MenuItems
 *
 * A low-level wrapper for menu items. Compose it with `MenuPopover` for more
 * control over the nested components and their rendered DOM nodes, or if you
 * need to nest arbitrary components between the outer wrapper and your list.
 *
 * @see Docs https://reach.tech/menu-button#menuitems
 */
export const MenuItems = React.forwardRef(function MenuItems(
    { as: Comp = "div", children, id, onKeyDown, ...props },
    forwardedRef
) {
    const { dispatch, buttonRef, menuRef, selectCallbacks } = React.useContext(StableMenuContext);
    const {
        menuId,
        state: { isExpanded, buttonId, selectionIndex, typeaheadQuery }
    } = React.useContext(UnstableMenuContext);
    const menuItems = useDescendants(MenuDescendantContext);
    const ref = useComposedRefs(menuRef, forwardedRef);

    React.useEffect(() => {
        // Respond to user char key input with typeahead
        const match = findItemFromTypeahead(menuItems, typeaheadQuery);
        if (typeaheadQuery && match != null) {
            dispatch({
                type: SELECT_ITEM_AT_INDEX,
                payload: { index: match }
            });
        }
        let timeout = window.setTimeout(() => typeaheadQuery && dispatch({ type: SEARCH_FOR_ITEM, payload: "" }), 1000);
        return () => window.clearTimeout(timeout);
    }, [dispatch, menuItems, typeaheadQuery]);

    const prevMenuItemsLength = usePrevious(menuItems.length);
    const prevSelected = usePrevious(menuItems[selectionIndex]);
    const prevSelectionIndex = usePrevious(selectionIndex);

    React.useEffect(() => {
        if (selectionIndex > menuItems.length - 1) {
            // If for some reason our selection index is larger than our possible
            // index range (let's say the last item is selected and the list
            // dynamically updates), we need to select the last item in the list.
            dispatch({
                type: SELECT_ITEM_AT_INDEX,
                payload: { index: menuItems.length - 1 }
            });
        } else if (
            // Checks if
            //  - menu length has changed
            //  - selection index has not changed BUT selected item has changed
            //
            // This prevents any dynamic adding/removing of menu items from actually
            // changing a user's expected selection.
            prevMenuItemsLength !== menuItems.length &&
            selectionIndex > -1 &&
            prevSelected &&
            prevSelectionIndex === selectionIndex &&
            menuItems[selectionIndex] !== prevSelected
        ) {
            dispatch({
                type: SELECT_ITEM_AT_INDEX,
                payload: {
                    index: menuItems.findIndex(i => i.key === prevSelected.key)
                }
            });
        }
    }, [dispatch, menuItems, prevMenuItemsLength, prevSelected, prevSelectionIndex, selectionIndex]);

    let handleKeyDown = composeEventHandlers(
        function handleKeyDown(event) {
            let { key } = event;

            if (!isExpanded) {
                return;
            }

            switch (key) {
                case "Enter":
                case " ":
                    let selected = menuItems.find(item => item.index === selectionIndex);
                    // For links, the Enter key will trigger a click by default, but for
                    // consistent behavior across menu items we'll trigger a click when
                    // the spacebar is pressed.
                    if (selected) {
                        if (selected.isLink && selected.element) {
                            selected.element.click();
                        } else {
                            event.preventDefault();
                            // Focus the button first by default when an item is selected.
                            // We fire the onSelect callback next so the app can manage
                            // focus if needed.
                            focus(buttonRef.current);
                            selectCallbacks.current[selected.index] && selectCallbacks.current[selected.index]();
                            dispatch({ type: CLICK_MENU_ITEM });
                        }
                    }
                    break;
                case "Escape":
                    focus(buttonRef.current);
                    dispatch({ type: CLOSE_MENU });
                    break;
                case "Tab":
                    // prevent leaving
                    event.preventDefault();
                    break;
                default:
                    // Check if a user is typing some char keys and respond by setting
                    // the query state.
                    if (isString(key) && key.length === 1) {
                        const query = typeaheadQuery + key.toLowerCase();
                        dispatch({
                            type: SEARCH_FOR_ITEM,
                            payload: query
                        });
                    }
                    break;
            }
        },
        useDescendantKeyDown(MenuDescendantContext, {
            currentIndex: selectionIndex,
            orientation: "vertical",
            rotate: false,
            filter: item => !item.disabled,
            callback: index => {
                dispatch({
                    type: SELECT_ITEM_AT_INDEX,
                    payload: { index }
                });
            },
            key: "index"
        })
    );

    return (
        // TODO: Should probably file a but in jsx-a11y, but this is correct
        // according to https://www.w3.org/TR/wai-aria-practices-1.2/examples/menu-button/menu-button-actions-active-descendant.html
        // eslint-disable-next-line jsx-a11y/aria-activedescendant-has-tabindex
        <Comp
            // Refers to the descendant menuitem element that is visually indicated
            // as focused.
            // https://www.w3.org/TR/wai-aria-practices-1.2/examples/menu-button/menu-button-actions-active-descendant.html
            aria-activedescendant={useMenuItemId(selectionIndex) || undefined}
            // Refers to the element that contains the accessible name for the
            // `menu`. The menu is labeled by the menu button.
            // https://www.w3.org/TR/wai-aria-practices-1.2/examples/menu-button/menu-button-actions-active-descendant.html
            aria-labelledby={buttonId || undefined}
            // The element that contains the menu items displayed by activating the
            // button has role menu.
            // https://www.w3.org/TR/wai-aria-practices-1.2/#menubutton
            role="menu"
            tabIndex={-1}
            {...props}
            ref={ref}
            data-reach-menu-items=""
            id={menuId}
            onKeyDown={composeEventHandlers(onKeyDown, handleKeyDown)}
        >
            {children}
        </Comp>
    );
});

///////////////////////////////////////////////////////////////////////////////
// Actions

const CLEAR_SELECTION_INDEX = "CLEAR_SELECTION_INDEX";
const CLICK_MENU_ITEM = "CLICK_MENU_ITEM";
const CLOSE_MENU = "CLOSE_MENU";
const OPEN_MENU_AT_FIRST_ITEM = "OPEN_MENU_AT_FIRST_ITEM";
const OPEN_MENU_AT_INDEX = "OPEN_MENU_AT_INDEX";
const OPEN_MENU_CLEARED = "OPEN_MENU_CLEARED";
const SEARCH_FOR_ITEM = "SEARCH_FOR_ITEM";
const SELECT_ITEM_AT_INDEX = "SELECT_ITEM_AT_INDEX";
const SET_BUTTON_ID = "SET_BUTTON_ID";

const MenuDescendantContext = createDescendantContext < MenuButtonDescendant > "MenuDescendantContext";
const StableMenuContext = createNamedContext < StableMenuContextValue > ("StableMenuContext", {});
const UnstableMenuContext = createNamedContext < UnstableMenuContextValue > ("UnstableMenuContext", {});

const initialState = {
    // The button ID is needed for aria controls and can be set directly and
    // updated for top-level use via context. Otherwise a default is set by useId.
    // TODO: Consider deprecating direct ID in 1.0 in favor of id at the top level
    //       for passing deterministic IDs to descendent components.
    buttonId: null,

    // Whether or not the menu is expanded
    isExpanded: false,

    // When a user begins typing a character string, the selection will change if
    // a matching item is found
    typeaheadQuery: "",

    // The index of the current selected item. When the selection is cleared a
    // value of -1 is used.
    selectionIndex: -1
};

////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////

// Reducer

/**
 * When a user's typed input matches the string displayed in a menu item, it is
 * expected that the matching menu item is selected. This is our matching
 * function.
 */
function findItemFromTypeahead(items, string = "") {
    if (!string) {
        return null;
    }

    const found = items.find(item => {
        return item.disabled ? false : item.element?.dataset?.valuetext?.toLowerCase().startsWith(string);
    });
    return found ? items.indexOf(found) : null;
}

function useMenuItemId(index) {
    let { menuId } = React.useContext(UnstableMenuContext);
    return index != null && index > -1 ? makeId(`option-${index}`, menuId) : undefined;
}

//   interface MenuButtonState {
//     isExpanded: boolean;
//     selectionIndex: number;
//     buttonId: null | string;
//     typeaheadQuery: string;
//   }

//   type MenuButtonAction =
//     | { type: "CLICK_MENU_ITEM" }
//     | { type: "CLOSE_MENU" }
//     | { type: "OPEN_MENU_AT_FIRST_ITEM" }
//     | { type: "OPEN_MENU_AT_INDEX"; payload: { index: number } }
//     | { type: "OPEN_MENU_CLEARED" }
//     | {
//         type: "SELECT_ITEM_AT_INDEX";
//         payload: { max?: number; min?: number; index: number };
//       }
//     | { type: "CLEAR_SELECTION_INDEX" }
//     | { type: "SET_BUTTON_ID"; payload: string }
//     | { type: "SEARCH_FOR_ITEM"; payload: string };

function focus(element) {
    element && element.focus();
}

function popoverContainsEventTarget(popover, target) {
    return !!(popover && popover.contains(target));
}

function reducer(state, action = {}) {
    switch (action.type) {
        case CLICK_MENU_ITEM:
            return {
                ...state,
                isExpanded: true,
                selectionIndex: -1
            };
        case CLOSE_MENU:
            return {
                ...state,
                isExpanded: false,
                selectionIndex: -1
            };
        case OPEN_MENU_AT_FIRST_ITEM:
            return {
                ...state,
                isExpanded: true,
                selectionIndex: 0
            };
        case OPEN_MENU_AT_INDEX:
            return {
                ...state,
                isExpanded: true,
                selectionIndex: action.payload.index
            };
        case OPEN_MENU_CLEARED:
            return {
                ...state,
                isExpanded: false,
                selectionIndex: -1
            };
        case SELECT_ITEM_AT_INDEX:
            if (action.payload.index >= 0) {
                return {
                    ...state,
                    selectionIndex:
                        action.payload.max != null
                            ? Math.min(Math.max(action.payload.index, 0), action.payload.max)
                            : Math.max(action.payload.index, 0)
                };
            }
            return state;
        case CLEAR_SELECTION_INDEX:
            return {
                ...state,
                selectionIndex: -1
            };
        case SET_BUTTON_ID:
            return {
                ...state,
                buttonId: action.payload
            };
        case SEARCH_FOR_ITEM:
            if (typeof action.payload !== "undefined") {
                return {
                    ...state,
                    typeaheadQuery: action.payload
                };
            }
            return state;
        default:
            return state;
    }
}

////////////////////////////////////////////////////////////////////////////////
