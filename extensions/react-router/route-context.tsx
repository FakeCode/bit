import React, { useEffect, useState, ComponentType } from 'react';
import { BrowserRouter, MemoryRouter, RouteProps, useHistory } from 'react-router-dom';
import { RouteSlot, SlotRouter } from './slot-router';
import { ReactRouterUI } from './react-router.ui.runtime';

export type History = ReturnType<typeof useHistory>;

const isIframed = typeof window !== 'undefined' && window.parent !== window;
const Router = isIframed ? MemoryRouter : (BrowserRouter as ComponentType);

export function RouteContext({
  rootRoutes,
  routeSlot,
  reactRouterUi,
}: {
  rootRoutes: RouteProps[];
  routeSlot: RouteSlot;
  reactRouterUi: ReactRouterUI;
}) {
  const [currentLocation, setLocation] = useState(window.location.pathname);

  // TODO - remove
  useEffect(() => {
    const unregister = setInterval(() => {
      if (currentLocation === window.location.pathname) return;
      setLocation(window.location.pathname);
    }, 100);

    return () => {
      clearInterval(unregister);
    };
  }, [currentLocation]);

  return (
    <Router>
      <div>(DEV - harmony url: {currentLocation})</div>
      <RouterGetter onRouter={reactRouterUi.setRouter} />
      <SlotRouter slot={routeSlot} rootRoutes={rootRoutes} />
    </Router>
  );
}

// needs to be rendered inside of <BrowserRouter/>
function RouterGetter({ onRouter: onHistory }: { onRouter: (routerHistory: History) => void }) {
  const history = useHistory();
  useEffect(() => onHistory(history), [history]);

  return null;
}
