'use client';

import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useAuth } from '@clerk/nextjs';
import { useMemo } from 'react';

const httpLink = createHttpLink({
  uri: '/api/graphql',
});

function ApolloWrapper({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();

  const client = useMemo(() => {
    const authLink = setContext(async (_, { headers }) => {
      const token = await getToken();
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : '',
        },
      };
    });

    return new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache({
        typePolicies: {
          Query: {
            fields: {
              getProducts: {
                merge: false,
              },
              categories: {
                merge: false,
              },
            },
          },
        },
      }),
      defaultOptions: {
        watchQuery: {
          errorPolicy: 'all',
          notifyOnNetworkStatusChange: false,
        },
      },
    });
  }, [getToken]);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

export default ApolloWrapper;
