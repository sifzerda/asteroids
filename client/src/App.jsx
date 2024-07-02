import './App.css';
// Bringing in the required import from 'react-router-dom'
import { Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import Header from './components/Header';
import Footer from './components/Footer';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// subjects //

function App() {
  return (
    <ApolloProvider client={client}>
      <>
        <header className="header">
          <Header />
          <Navigation />
        </header>

        <div className="bucket-app">

          <main className="main-content mx-3">
            <Outlet />
          </main>
        </div>

        <Footer />
      </>
    </ApolloProvider>
  );
}

export default App;