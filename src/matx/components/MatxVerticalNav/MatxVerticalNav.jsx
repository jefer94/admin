import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from '@material-ui/core';
import TouchRipple from '@material-ui/core/ButtonBase';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import useAuth from '../../../app/hooks/useAuth';
import MatxVerticalNavExpansionPanel from './MatxVerticalNavExpansionPanel';

const useStyles = makeStyles(({ palette, ...theme }) => ({
  navItem: {
    transition: 'all 250ms ease-in-out',
    // color: palette.type === "dark" ? palette.text.secondary : "inherit",
    // "&:hover": {
    //   color: palette.text.primary,
    // },
  },
  compactNavItem: {
    overflow: 'hidden',
    justifyContent: 'center !important',
    '& $itemText': {
      display: 'none',
    },
    '& $itemIcon': {
      display: 'none',
    },
  },
  itemIcon: {},
  itemText: {
    fontSize: '0.875rem',
    paddingLeft: '0.8rem',
  },
  label: {
    color: palette.text.secondary,
  },
  bulletIcon: {
    background: palette.text.secondary,
  },
}));

const MatxVerticalNav = () => {
  const { isAuthenticated, user, capabilities } = useAuth();
  const navigations = useSelector((state) => state.navigations);
  const { settings } = useSelector((state) => state.layout);
  const { mode } = settings.layout1Settings.leftSidebar;
  const classes = useStyles();

  const renderLevels = (data) => data.filter((item) => {
    let visible = true;
    
    if(!settings.beta && item.beta === true) return false;
    if(Array.isArray(item.capabilities) && !item.capabilities.some(c => capabilities.includes(c))) return false;

    return true;
  }).map((item, index) => {
    if (item.type === 'label') {
      return (
        <p
          key={index}
          className={clsx({
       'px-4 mb-2 mt-6 uppercase text-12 sidenavHoverShow': true,
       [classes.label]: true,
       hidden: mode === 'compact',
     })}
        >
          {item.label}
        </p>
      );
    }
    if (item.children) {
      return (
        <MatxVerticalNavExpansionPanel mode={mode} item={item} key={index}>
          {renderLevels(item.children)}
        </MatxVerticalNavExpansionPanel>
      );
    } if (item.type === 'extLink') {
      return (
        <a
          key={index}
          href={item.path}
          className={clsx({
            'flex justify-between h-44 border-radius-4 mb-2 compactNavItem whitespace-pre overflow-hidden': true,
            [classes.navItem]: true,
            [classes.compactNavItem]: mode === 'compact',
          })}
          rel="noopener noreferrer"
          target="_blank"
        >
          <TouchRipple key={item.name} name="child" className="w-full">
            {(() => {
              if (item.icon) {
                return (
                  <Icon className="text-18 align-middle px-4">
                    {item.icon}
                  </Icon>
                );
              }
              return (
                <span className="item-icon icon-text">{item.iconText}</span>
              );
            })()}
            <span
              className={clsx(
                'align-middle sidenavHoverShow',
                classes.itemText,
              )}
            >
              {item.name}
            </span>
            <div className="mx-auto" />
            {item.badge && (
            <div className={`rounded bg-${item.badge.color} px-1 py-1px`}>
              {item.badge.value}
            </div>
            )}
          </TouchRipple>
        </a>
      );
    }
    return (
      <NavLink
        key={index}
        to={item.path}
        activeClassName="bg-gray"
        className={clsx({
          'flex justify-between h-44 border-radius-4 mb-2 compactNavItem whitespace-pre overflow-hidden': true,
          [classes.navItem]: true,
          [classes.compactNavItem]: mode === 'compact',
        })}
      >
        <TouchRipple key={item.name} name="child" className="w-full">
          {item?.icon ? (
            <Icon className="text-18 align-middle w-36 px-4">
              {item.icon}
            </Icon>
          ) : (
            <>
              <div
                    className={clsx({
                      'nav-bullet p-2px rounded ml-6 mr-2': true,
                      [classes.bulletIcon]: true,
                      hidden: mode === 'compact',
                    })}
                  />
              <div
                    className={clsx({
                      'nav-bullet-text ml-5 text-11': true,
                      hidden: mode !== 'compact',
                    })}
                  >
                    {item.iconText}
                  </div>
            </>
          )}
          <span
            className={clsx(
              'align-middle text-left sidenavHoverShow',
              classes.itemText,
            )}
          >
            {item.name}
          </span>
          <div className="mx-auto" />
          {item.badge && (
          <div
            className={clsx(
              `rounded bg-${item.badge.color} px-1 py-1px`,
              'sidenavHoverShow',
              classes.itemIcon,
            )}
          >
            {item.badge.value}
          </div>
          )}
        </TouchRipple>
      </NavLink>
    );
  });

  return <div className="navigation">{renderLevels(navigations)}</div>;
};

export default MatxVerticalNav;
