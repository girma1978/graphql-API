

// import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import SearchBooks from './pages/SearchBooks';
// import SavedBooks from './pages/SavedBooks';

// const cache = new InMemoryCache();

// const client = new ApolloClient({
//   uri: '/graphql',
//   cache,
// });

// const App = () => {
//   return (
//     <ApolloProvider client={client}>
//       <Router> {/* Wrap the app in a single Router */}
//         <Navbar />
//         <Routes>
//           <Route path="/" element={<SearchBooks />} />
//           <Route path="/saved" element={<SavedBooks />} />
//         </Routes>
//       </Router>
//     </ApolloProvider>
//   );
// };

// export default App;


import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Auth from './utils/auth'; // Ensure the path to your Auth utility is correct

const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = Auth.getToken();
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]), // Apply the authLink
  cache: new InMemoryCache(),
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<SearchBooks />} />
          <Route path="/saved" element={<SavedBooks />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
};

export default App;