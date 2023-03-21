import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";

interface Story {
  title: string;
  url: string;
  author: string;
  created_at: string;
  objectID: string;
}

const StoryList = () => {
  const navigation = useNavigate();
  const [hits, setHits] = useState<Story[]>([]);
  const [page, setPage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const getData = async (pageNumber: number) => {
    try {
      const resultSet = await axios.get(
        `https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${pageNumber}&hitsPerPage=18`
      );
      const newHits = resultSet.data.hits.filter(
        (hit: Story) => !hits.map((h) => h.objectID).includes(hit.objectID)
      );
      setHits([...hits, ...newHits]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPage((prevPage) => prevPage + 1);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getData(page);
  }, [page]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    };
    observerRef.current = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        setPage((prevPage) => prevPage + 1);
      }
    }, options);
    observerRef.current.observe(containerRef.current);
    return () => observerRef.current?.disconnect();
  }, [containerRef]);

  const handleNavigation = (hit: any) => {
    navigation("/story", { state: { hit } });
  };

  return (
    <div className="storyContainer">
      <table border={1} className="table" id="tableContainer">
        <thead className="thead-dark" id="tableHeader">
          <tr>
            <th data-testid="tableHeader">Title</th>
            <th data-testid="tableHeader">URL</th>
            <th data-testid="tableHeader">Author</th>
            <th data-testid="tableHeader">Created At</th>
          </tr>
        </thead>
        <tbody className="tableBody">
          {hits.map((hit) => (
            <tr
              key={hit.objectID}
              onClick={() => handleNavigation(hit)}
              data-testid="storyRow"
            >
              <td data-testid="tableRow">{hit.title}</td>
              <td data-testid="tableRow">{hit.url}</td>
              <td data-testid="tableRow">{hit.author}</td>
              <td data-testid="tableRow">{hit.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div ref={containerRef}></div>
    </div>
  );
};

export default StoryList;
