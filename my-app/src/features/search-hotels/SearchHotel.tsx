import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function SearchPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [searchQuery, setSearchQuery] = useState(queryParams.get("query") || "");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    async function fetchSearchResults() {
      try {
        const response = await fetch(`/api/search?query=${searchQuery}`);
        const results = await response.json();
        setSearchResults(results);
      } catch (error) {
        console.error(error);
      }
    }

    fetchSearchResults();
  }, [searchQuery]);

//   return (
//     <div>
//       <h1>Search Results for "{searchQuery}"</h1>
//       <ul>
//         {searchResults.map((result) => (
//           <li key={result.id}>
//             <a href={result.url}>{result.title}</a>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
}