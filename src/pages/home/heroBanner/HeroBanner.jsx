import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useFetch from '../../../hooks/useFetch';

import ContentWrapper from '../../../components/contentWrapper/ContentWrapper';
import Img from '../../../components/lazyLoadImage/Img';

import './heroBanner.scss';

const HeroBanner = () => {
  const [backgroundImg, setBackgroundImg] = useState('');
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { url } = useSelector((state) => state.home);
  const { data, loading } = useFetch('/movie/upcoming');

  useEffect(() => {
    const bgImg =
      url.backdrop +
      data?.results?.[Math.floor(Math.random() * 20)]?.backdrop_path;
    setBackgroundImg(bgImg);
  }, [data]);

  const handleSearchQueryOnKeyUp = (event) => {
    if (event.key === 'Enter' && query.length > 0) {
      navigate(`/search/${query}`);
    }
  };

  const handleSearchQueryOnBtn = () => {
    if (query.length > 0) {
      navigate(`/search/${query}`);
    }
  };

  return (
    <div className='heroBanner'>
      {!loading && (
        <div className='backdrop-img'>
          <Img src={backgroundImg} />
        </div>
      )}

      <div className='opacity-layer'></div>

      <ContentWrapper>
        <div className='heroBannerContent'>
          <span className='title'>Welcome.</span>
          <span className='subTitle'>
            Millions of Movies, TV Shows and People to discover. Explore Now.
          </span>
          <div className='searchInput'>
            <input
              type='text'
              placeholder='Search Keywords...'
              onChange={(e) => setQuery(e.target.value)}
              onKeyUp={handleSearchQueryOnKeyUp}
            />
            <button onClick={handleSearchQueryOnBtn}>Search</button>
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
};

export default HeroBanner;
