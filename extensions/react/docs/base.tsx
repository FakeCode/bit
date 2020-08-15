import React, { HTMLAttributes, FC } from 'react';
import { useQuery } from '@apollo/react-hooks';
import classNames from 'classnames';
import { isFunction } from 'ramda-adjunct';
import 'reset-css';
import { gql } from 'apollo-boost';
import { ThemeContext } from '@teambit/documenter-temp.theme.theme-context';
import { ComponentModel } from '@teambit/component';
import { CompositionsSummary } from './compositions-summary/compositions-summary';
import { Properties } from './properties/properties';
import { ComponentOverview } from './component-overview';
import { ExamplesOverview, ExampleProps } from './examples-overview';
import styles from './base.module.scss';

export type DocsSectionProps = {
  docs: {
    examples?: ExampleProps[];
    default?: FC<any>;
    labels?: string[];
    abstract?: string;
    compositions?: React.ComponentType[];
    displayName?: string;
  };
  compositions: React.ComponentType[];
  componentId: string;
} & HTMLAttributes<HTMLDivElement>;

const GET_COMPONENT = gql`
  query($id: String!) {
    getHost {
      get(id: $id) {
        id {
          name
          version
          scope
        }
        displayName
        packageName
        compositions {
          identifier
        }
      }
      getDocs(id: $id) {
        abstract
        properties {
          name
          description
          required
          type
          defaultValue {
            value
            computed
          }
        }
      }
    }
  }
`;

/**
 * base template for react component documentation.
 */
export function Base({ docs = {}, componentId, compositions, ...rest }: DocsSectionProps) {
  const { loading, error, data } = useQuery(GET_COMPONENT, {
    variables: { id: componentId },
  });
  // :TODO @uri please add a proper loader with amir
  if (loading) return <div></div>;
  if (error) throw error;

  const component = ComponentModel.from(data.getHost.get);
  const docsModel = data.getHost.getDocs;

  const {
    examples = [],
    labels = [],
    abstract = docsModel.abstract,
    compositions: overviewCompositions = compositions,
    displayName = component.displayName,
  } = docs;

  const Content = isFunction(docs.default) ? docs.default : () => null;

  return (
    <ThemeContext>
      <div className={classNames(styles.docsMainBlock)} {...rest}>
        <ComponentOverview
          displayName={displayName}
          version={component.version}
          abstract={abstract}
          labels={labels}
          packageName={component.packageName}
        />

        <Content />

        <CompositionsSummary compositions={overviewCompositions} />

        <ExamplesOverview examples={examples} />

        <Properties properties={docsModel.properties} />
      </div>
    </ThemeContext>
  );
}