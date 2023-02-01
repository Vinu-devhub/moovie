import React from 'react';

import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useParams } from 'react-router-dom';

import noResults from '../../assets/no-results.png';
import ContentWrapper from '../../components/contentWrapper/ContentWrapper';
import MovieCard from '../../components/movieCard/MovieCard';
import Spinner from '../../components/spinner/Spinner';
import { fetchDataFromApi } from '../../utils/api';

import './searchResults.scss';

const SearchResults = () => {
  const [data, setData] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const { query } = useParams();

  const fetchInitialData = () => {
    setLoading(true);
    fetchDataFromApi(`/search/multi?query=${query}&page=${pageNum}`).then(
      (resp) => {
        setData(resp);
        setPageNum((prev) => prev + 1);
        setLoading(false);
      },
    );
  };

  const fetchNextPageData = () => {
    fetchDataFromApi(`/search/multi?query=${query}&page=${pageNum}`).then(
      (resp) => {
        if (data?.results) {
          setData({
            ...data,
            results: [...data?.results, ...resp.results],
          });
        } else {
          setData(resp);
        }
        setPageNum((prev) => prev + 1);
      },
    );
  };

  useEffect(() => {
    setPageNum(1);
    fetchInitialData();
  }, [query]);

  return (
    <div className='searchResultsPage'>
      {loading && <Spinner initial={true} />}
      {!loading && (
        <ContentWrapper>
          {data?.results?.length > 0 ? (
            <>
              <div className='pageTitle'>
                {`Search ${
                  data?.total_results > 1 ? 'results' : 'result'
                } of '${query}'`}
              </div>
              <InfiniteScroll
                className='content'
                dataLength={data?.results?.length || []}
                next={fetchNextPageData}
                hasMore={pageNum <= data?.total_pages}
                loader={<Spinner />}
              >
                {data?.results?.map((item, index) => {
                  if (item.media_type === 'person') return;
                  return (
                    <MovieCard key={index} data={item} fromSearch={true} />
                  );
                })}
              </InfiniteScroll>
            </>
          ) : (
            <span className='resultNotFound'>Sorry, No results found!</span>
          )}
        </ContentWrapper>
      )}
    </div>
  );
};

export default SearchResults;
