

// import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import SearchBooks from './pages/SearchBooks';
// import SavedBooks from './pages/SavedBooks';

// const cache = new InMemoryCache();

// // Create the ApolloClient instance
// const client = new ApolloClient({
//   uri: '/graphql',
//   cache
// });

// const App = () => {
//   return (
//     // ApolloProvider should wrap your entire app
//     <ApolloProvider client={client}>
//       <Router>
//         {/* Navbar should not have its own Router */}
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


import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';

const cache = new InMemoryCache();

const client = new ApolloClient({
  uri: '/graphql',
  cache,
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Router> {/* Wrap the app in a single Router */}
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
