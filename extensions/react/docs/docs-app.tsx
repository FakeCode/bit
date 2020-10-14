import { docsFile } from '@teambit/documenter.types.docs-file';
import React from 'react';

import { Base } from './base';

export type DocsAppProps = {
  Provider: React.ComponentType;
  docs: docsFile;
  componentId: string;
  compositions: [React.ComponentType];
};

export function DocsApp({ Provider, docs, componentId, compositions }: DocsAppProps) {
  return (
    <Provider>
      <Base docs={docs} componentId={componentId} compositions={compositions} />
    </Provider>
  );
}

window.addEventListener('hashchange', (e) => {
  console.log('[docs]', 'hash changed', e);
});

window.addEventListener('popstate', (e) => {
  e.preventDefault();
  console.log('[docs]', 'popstate', e);
});
