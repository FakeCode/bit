import { ComponentModel } from '@teambit/component';
import React, { CSSProperties, createRef, useEffect, useState } from 'react';

export type ComponentPreviewProps = {
  /**
   * component to preview.
   */
  component: ComponentModel;

  /**
   * preview name.
   */
  previewName?: string;

  /**
   * preview style.
   */
  style?: CSSProperties;

  /**
   * string in the format of query params. e.g. foo=bar&bar=there
   */
  queryParams?: string;

  /**
   * enable/disable hot reload for the composition preview.
   */
  hotReload: boolean;
};

/**
 * renders a preview of a component.
 */
export function ComponentPreview({ component, style, previewName, queryParams }: ComponentPreviewProps) {
  // const iframeRef = createRef<HTMLIFrameElement>();

  const serverUrl = `/api/${component.id.fullName}/@/preview`;

  const url = `${(component.server && component.server.url) || serverUrl}/#${component.id.fullName}${
    `?preview=${previewName}&${queryParams && queryParams}` || ''
  }`;

  // const [urlState, setUrl] = useState(url);

  // useEffect(() => {
  //   setTimeout(() => {
  //     const next = 'https://google.com';
  //     setUrl(next);
  //     // '/preview/teambit.bit/react/#elements/image?preview=overview';
  //     // if (!iframeRef.current) return;

  //     // console.log('done v5');

  //     // iframeRef.current.contentWindow?.history.replaceState(null, 'iframe', next);
  //   }, 10000);
  // }, [iframeRef]);

  // return <div>(iframe placeholder)</div>
  return <iframe /* ref={iframeRef} */ style={style} src={url} />;
  // return null;
}

ComponentPreview.defaultProps = {
  hotReload: true,
};
