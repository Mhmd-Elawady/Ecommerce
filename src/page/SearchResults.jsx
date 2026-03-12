import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import SlideProductLoading from "../components/slideproducts/SlideProductLoading";
import Product from "../components/slideProducts/Product";

function SearchResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const query = new URLSearchParams(useLocation().search).get("query");

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://dummyjson.com/products/search?q=${query}`
        );
        const data = await res.json();
        setResults(data.products || []);
      } catch (error) {
        console.error("Search Error:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <PageTransition key={query}>
      <div className="category_products">
        <div className="container">

          {loading ? (
            <SlideProductLoading />
          ) : results.length > 0 ? (
            <>
              <div className="top_slide">
                <h2>Results for: {query}</h2>
              </div>
              <div className="products">
                {results.map((item) => (
                  <Product item={item} key={item.id} />
                ))}
              </div>
            </>
          ) : (
            <p>No results found for "{query}".</p>
          )}

        </div>
      </div>
    </PageTransition>
  );
}

export default SearchResults;