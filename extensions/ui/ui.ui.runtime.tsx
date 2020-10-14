import type { GraphqlUI } from '@teambit/graphql';
import { GraphqlAspect } from '@teambit/graphql';
import { Slot, SlotRegistry } from '@teambit/harmony';
import type { ReactRouterUI } from '@teambit/react-router';
import { ReactRouterAspect } from '@teambit/react-router';
import { Button } from '@teambit/evangelist.elements.button';
import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import Avatar, { AccountTypes } from '@teambit/staged-components.workspace-components.avatar';

import { Compose } from './compose';
import { UIRootFactory } from './ui-root.ui';
import { UIAspect, UIRuntime } from './ui.aspect';
import { ClientContext } from './ui/client-context';

type HudSlot = SlotRegistry<ReactNode>;
type ContextSlot = SlotRegistry<ContextType>;
export type UIRootRegistry = SlotRegistry<UIRootFactory>;

type ContextType = React.JSXElementConstructor<React.PropsWithChildren<any>>;

// import * as serviceWorker from './serviceWorker';

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();

function TempHeader() {
  const isIframed = typeof window !== 'undefined' && window.top !== window;

  if (isIframed) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: 8 }}>
      <Avatar
        account={{
          name: '',
          profileImage: 'https://static.bit.dev/bit-logo.svg',
          accountType: AccountTypes.user,
        }}
        size={35}
        // style={{marginRight: 8}}
      />
      <input placeholder="search for components" style={{ marginRight: 'auto', marginLeft: 8 }} />
      <a href="https://dev.bit.dev/pricing" style={{ padding: 8 }}>
        pricing
      </a>
      <a href="https://dev.bit.dev/~create-collection" style={{ marginRight: '16px' }}>
        <Button importance="cta" style={{ padding: '8px 16px' }}>
          + New
        </Button>
      </a>
      <Avatar
        account={{
          name: 'kutner',
          profileImage: 'https://s.gravatar.com/avatar/18753b52208563aa388239347f22c721?rating=g&default=blank',
          accountType: AccountTypes.user,
        }}
        size={35}
      ></Avatar>
    </div>
  );
}

/**
 * extension
 */
export class UiUI {
  constructor(
    /**
     * GraphQL extension.
     */
    private graphql: GraphqlUI,

    /**
     * react-router extension.
     */
    private router: ReactRouterUI,
    /**
     * ui root registry.
     */
    private uiRootSlot: UIRootRegistry,
    /** slot for overlay ui elements */
    private hudSlot: HudSlot,
    /** slot for context provider elements */
    private contextSlot: ContextSlot
  ) {}

  render(rootExtension: string) {
    const GraphqlProvider = this.graphql.getProvider;
    const rootFactory = this.getRoot(rootExtension);
    if (!rootFactory) throw new Error(`root: ${rootExtension} was not found`);
    const uiRoot = rootFactory();
    const routes = this.router.renderRoutes(uiRoot.routes);
    const hudItems = this.hudSlot.values();
    const contexts = this.contextSlot.values();

    ReactDOM.render(
      <GraphqlProvider>
        <ClientContext>
          <Compose components={contexts}>
            <TempHeader />
            {hudItems}
            {routes}
          </Compose>
        </ClientContext>
      </GraphqlProvider>,
      document.getElementById('root')
    );
  }

  /** adds elements to the Heads Up Display */
  registerHudItem = (element: ReactNode) => {
    this.hudSlot.register(element);
  };

  // ** adds global context at the ui root */
  registerContext(context: ContextType) {
    this.contextSlot.register(context);
  }

  registerRoot(uiRoot: UIRootFactory) {
    return this.uiRootSlot.register(uiRoot);
  }

  private getRoot(rootExtension: string) {
    return this.uiRootSlot.get(rootExtension);
  }

  static slots = [Slot.withType<UIRootFactory>(), Slot.withType<ReactNode>(), Slot.withType<ContextType>()];

  static dependencies = [GraphqlAspect, ReactRouterAspect];

  static runtime = UIRuntime;

  static async provider(
    [graphql, router]: [GraphqlUI, ReactRouterUI],
    config,
    [uiRootSlot, hudSlot, contextSlot]: [UIRootRegistry, HudSlot, ContextSlot]
  ) {
    return new UiUI(graphql, router, uiRootSlot, hudSlot, contextSlot);
  }
}

UIAspect.addRuntime(UiUI);
